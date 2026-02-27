import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL, // Use the email address you verified with SendGrid
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body)
    }
    return { success: false, error };
  }
}
