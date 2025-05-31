import Otp from '@/models/Otp';

export async function verifyOtp(email, code) {
  const record = await Otp.findOne({ email });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  if (record.code !== code) return false;

  // Delete OTP after successful verification
  await Otp.deleteOne({ email });

  return true;
}
