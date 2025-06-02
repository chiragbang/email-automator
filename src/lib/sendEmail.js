import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set');
}

export async function sendEmail({ to, subject, text, html }) {
  const msg = {
    to,
    from: 'chiragbang.work@gmail.com', // Use the verified sender email in SendGrid
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Email sending failed');
  }
}
