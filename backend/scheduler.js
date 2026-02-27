import cron from 'node-cron';
import { supabase } from './supabaseClient.js';
import { sendEmail } from './emailService.js';
import { sendWhatsApp } from './whatsappService.js';

async function checkAndSendReminders() {
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 1 * 60 * 1000);

  try {
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        medication:medications(*)
      `)
      .eq('status', 'active')
      .lte('reminder_time', oneMinuteFromNow.toISOString())
      .gte('reminder_time', now.toISOString());

    if (error) throw error;

    for (const reminder of reminders) {
      // Fetch profile details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', reminder.user_id)
        .single();

      if (profileError) {
        console.error(`Error fetching profile for user ${reminder.user_id}:`, profileError);
        continue;
      }

      // Fetch user email from auth schema
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(reminder.user_id);

      if (userError) {
        console.error(`Error fetching user email for ${reminder.user_id}:`, userError);
        continue;
      }

      const { medication, type, dosage } = reminder;
      const subject = `Time for your ${medication.name} medication`;
      const body = `Hi ${profile.full_name}, it's time to take your ${dosage} of ${medication.name}.`;

      if (type === 'email') {
        await sendEmail({
          to: user.email,
          subject,
          text: body,
          html: `<p>${body}</p>`,
        });
      } else if (type === 'whatsapp') {
        await sendWhatsApp({
          to: profile.phone_number,
          body,
        });
      }

      // Update the reminder status to 'sent' to prevent re-sending
      await supabase
        .from('reminders')
        .update({ status: 'sent' })
        .eq('id', reminder.id);
    }
  } catch (error) {
    console.error('Error checking and sending reminders:', error);
  }
}

// Schedule to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running reminder check...');
  checkAndSendReminders();
});

console.log('Scheduler started. Will check for reminders every minute.');
