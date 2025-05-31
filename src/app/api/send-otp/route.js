import { sendEmail } from '@/lib/sendEmail';
import crypto from 'crypto';

let otpStore = {};  // Temporary in-memory store: { email: { otp, expiresAt } }

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return new Response('Email is required', { status: 400 });

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  // Save OTP in temporary store
  otpStore[email] = { otp, expiresAt };

  try {
    await sendEmail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });
    return new Response('OTP sent', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to send OTP', { status: 500 });
  }
}

// Export otpStore for verification API
export { otpStore };
