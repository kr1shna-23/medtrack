// backend/reminders.js
import { supabase } from './supabaseClient.js';
import { sendEmail } from './emailService.js'; // To be created
import { sendWhatsApp } from './whatsappService.js'; // To be created

// Function to be deployed as a Supabase Edge Function
export async function handleReminders() {
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select(`
      *,
      medications (*),
      profiles (*)
    `)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching active reminders:', error);
    return;
  }

  for (const reminder of reminders) {
    const now = new Date();
    const reminderTime = new Date(reminder.reminder_time);

    if (now >= reminderTime) {
      const user = reminder.profiles;
      const medication = reminder.medications;

      // Send email reminder
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Medication Reminder: ${medication.name}`,
          text: `Hi ${user.full_name || ''}, it's time to take your medication: ${medication.name}.`,
          html: `<strong>Hi ${user.full_name || ''},</strong><p>It's time to take your medication: ${medication.name}.</p>`
        });
      }

      // Send WhatsApp reminder
      if (user.phone_number) {
        await sendWhatsApp({
          to: user.phone_number,
          body: `Hi ${user.full_name || ''}, it's time to take your medication: ${medication.name}.`
        });
      }

      // Reschedule the reminder for the next day
      const nextReminderTime = new Date(reminderTime);
      nextReminderTime.setDate(nextReminderTime.getDate() + 1);

      await supabase
        .from('reminders')
        .update({ reminder_time: nextReminderTime.toISOString() })
        .eq('id', reminder.id);
    }
  }
}
