import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export async function POST(req) {
  try {
    const { to, subject, body, resumeUrl } = await req.json();

    // OAuth2 credentials
    const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
    const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
    const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;

    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    // Get resume buffer from URL
    const attachment = resumeUrl
      ? {
          filename: 'resume.pdf',
          path: resumeUrl, // Must be a public link or signed URL
        }
      : null;

    const mailOptions = {
      from: `Chirag Bang <${SENDER_EMAIL}>`,
      to,
      subject,
      text: body,
      ...(attachment && { attachments: [attachment] }),
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
