// Temporary in-memory store
const otpStore = new Map();

export const saveOtp = (email, otp) => {
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 mins
};

export const verifyOtp = (email, otp) => {
  const record = otpStore.get(email);
  if (!record) return false;

  const isValid = record.otp === otp && Date.now() < record.expires;

  if (isValid) otpStore.delete(email); // OTP should be single-use
  return isValid;
};
