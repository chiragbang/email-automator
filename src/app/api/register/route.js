// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcrypt';

// export async function POST(req) {
//   const { email, password } = await req.json();
//   if (!email || !password) return new Response('Missing fields', { status: 400 });

//   await dbConnect();

//   const userExists = await User.findOne({ email });
//   if (userExists) return new Response('User already exists', { status: 400 });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ email, password: hashedPassword });

//   return new Response(JSON.stringify({ email: user.email }), { status: 201 });
// }


// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcrypt';
// import { verifyOtp } from '@/lib/otpHelper';

// export async function POST(req) {
//   const { email, password, otp } = await req.json();

//   if (!email || !password || !otp) {
//     return new Response('Missing fields', { status: 400 });
//   }

//   await dbConnect();

//   // Verify OTP before creating user
//   const isOtpValid = await verifyOtp(email, otp);
//   if (!isOtpValid) {
//     return new Response('Invalid or expired OTP', { status: 401 });
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return new Response('User already exists', { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ email, password: hashedPassword });

//   return new Response(JSON.stringify({ email: user.email }), { status: 201 });
// }


import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { otpStore } from '../send-otp/route';

export async function POST(req) {
  const { email, password, otp } = await req.json();

  if (!email || !password || !otp) return new Response('Missing fields', { status: 400 });

  // Verify OTP first by calling verify API internally or duplicating the logic here
  // To avoid code duplication, call the verify function here directly or check OTP in your store.

  // Let's assume otpStore imported here:

  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return new Response('OTP invalid or expired', { status: 400 });
  }

  await dbConnect();

  const userExists = await User.findOne({ email });
  if (userExists) return new Response('User already exists', { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  // Remove OTP after successful registration
  delete otpStore[email];

  return new Response(JSON.stringify({ email: user.email }), { status: 201 });
}
