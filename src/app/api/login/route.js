import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response('Invalid password', { status: 401 });
    }

    // Send minimal safe user object for session token (don't expose password)
    const { _id, name, email: userEmail, mobileNumber } = user;

    return new Response(
      JSON.stringify({ id: _id, name, email: userEmail, mobileNumber }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response('Server error', { status: 500 });
  }
}
