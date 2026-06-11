import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ReminderChannel = "sms" | "whatsapp";

type ClaimedReminder = {
  id: number;
  medication_name: string | null;
  dosage: string | null;
  frequency: string | null;
  reminder_time: string;
  type: ReminderChannel;
  send_attempts: number | null;
  full_name: string | null;
  phone_number: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const TWILIO_SMS_FROM_NUMBER = Deno.env.get("TWILIO_SMS_FROM_NUMBER") || "";
const TWILIO_WHATSAPP_NUMBER = Deno.env.get("TWILIO_WHATSAPP_NUMBER") || "";
const MAX_REMINDERS_PER_RUN = Number(Deno.env.get("MAX_REMINDERS_PER_RUN") || "25");

const getSupabaseSecretKey = () => {
  const legacyServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyServiceRoleKey) return legacyServiceRoleKey;

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!secretKeys) return "";

  try {
    const parsed = JSON.parse(secretKeys);
    return parsed.default || Object.values(parsed)[0] || "";
  } catch {
    return "";
  }
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = String(getSupabaseSecretKey());

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const jsonResponse = (body: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

const requireConfig = () => {
  const missing = [
    ["SUPABASE_URL", supabaseUrl],
    ["SUPABASE_SERVICE_ROLE_KEY", supabaseServiceRoleKey],
    ["TWILIO_ACCOUNT_SID", TWILIO_ACCOUNT_SID],
    ["TWILIO_AUTH_TOKEN", TWILIO_AUTH_TOKEN],
    ["TWILIO_SMS_FROM_NUMBER", TWILIO_SMS_FROM_NUMBER],
    ["TWILIO_WHATSAPP_NUMBER", TWILIO_WHATSAPP_NUMBER],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

const normalizeSmsNumber = (phoneNumber: string | null) => {
  const cleaned = (phoneNumber || "").replace(/[^\d+]/g, "");

  if (!cleaned.startsWith("+") || cleaned.length < 8) {
    return null;
  }

  return cleaned;
};

const getTwilioToNumber = (phoneNumber: string | null, channel: ReminderChannel) => {
  const smsNumber = normalizeSmsNumber(phoneNumber);
  if (!smsNumber) return null;

  return channel === "whatsapp" ? `whatsapp:${smsNumber}` : smsNumber;
};

const buildMessage = (reminder: ClaimedReminder) => {
  const name = reminder.medication_name || "your medication";
  const dosage = reminder.dosage ? `${reminder.dosage} of ` : "";

  return `MedTrack reminder: Time to take ${dosage}${name}.`;
};

const getNextReminderTime = (reminderTime: string) => {
  const next = new Date(reminderTime);
  const now = new Date();

  if (Number.isNaN(next.getTime())) {
    now.setDate(now.getDate() + 1);
    return now.toISOString();
  }

  while (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.toISOString();
};

const sendTwilioMessage = async (reminder: ClaimedReminder) => {
  const to = getTwilioToNumber(reminder.phone_number, reminder.type);
  if (!to) {
    throw new Error("Missing or invalid profile phone number. Use E.164 format, for example +919876543210.");
  }

  const from = reminder.type === "whatsapp" ? TWILIO_WHATSAPP_NUMBER : TWILIO_SMS_FROM_NUMBER;
  const params = new URLSearchParams({
    To: to,
    From: from,
    Body: buildMessage(reminder),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : `Twilio request failed with ${response.status}`;
    throw new Error(message);
  }

  return body;
};

const markReminder = async (
  reminder: ClaimedReminder,
  result: { ok: true; twilioSid?: string } | { ok: false; error: string },
) => {
  const nextReminderTime = getNextReminderTime(reminder.reminder_time);
  const sendAttempts = (reminder.send_attempts || 0) + 1;

  const payload = result.ok
    ? {
      last_sent_at: new Date().toISOString(),
      last_error: null,
      send_attempts: sendAttempts,
      locked_until: null,
      reminder_time: nextReminderTime,
    }
    : {
      last_error: result.error.slice(0, 1000),
      send_attempts: sendAttempts,
      locked_until: null,
      reminder_time: nextReminderTime,
    };

  const { error } = await supabase
    .from("reminders")
    .update(payload)
    .eq("id", reminder.id);

  if (error) {
    throw error;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    requireConfig();

    const batchSize = Number.isFinite(MAX_REMINDERS_PER_RUN)
      ? Math.max(1, Math.min(MAX_REMINDERS_PER_RUN, 100))
      : 25;

    const { data, error } = await supabase.rpc("claim_due_reminders", {
      batch_size: batchSize,
      lock_minutes: 5,
    });

    if (error) {
      throw error;
    }

    const reminders = (data || []) as ClaimedReminder[];
    const results = [];

    for (const reminder of reminders) {
      try {
        const twilioResult = await sendTwilioMessage(reminder);
        await markReminder(reminder, {
          ok: true,
          twilioSid: typeof twilioResult?.sid === "string" ? twilioResult.sid : undefined,
        });

        results.push({
          id: reminder.id,
          type: reminder.type,
          ok: true,
          twilioSid: twilioResult?.sid,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown reminder send error";
        await markReminder(reminder, { ok: false, error: message });

        results.push({
          id: reminder.id,
          type: reminder.type,
          ok: false,
          error: message,
        });
      }
    }

    return jsonResponse({
      claimed: reminders.length,
      sent: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown function error";
    return jsonResponse({ error: message }, 500);
  }
});
