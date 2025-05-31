import { otpStore } from './send-otp/route';

export async function POST(req) {
  const { email, otp } = await req.json();
  if (!email || !otp) return new Response('Email and OTP required', { status: 400 });

  const record = otpStore[email];
  if (!record) return new Response('OTP not found, please request a new one', { status: 400 });

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return new Response('OTP expired, please request a new one', { status: 400 });
  }

  if (record.otp !== otp) return new Response('Invalid OTP', { status: 400 });

  // OTP is valid — remove from store
  delete otpStore[email];

  return new Response('OTP verified', { status: 200 });
}
