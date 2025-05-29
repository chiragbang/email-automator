import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) return new Response('Missing fields', { status: 400 });

  await dbConnect();

  const userExists = await User.findOne({ email });
  if (userExists) return new Response('User already exists', { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  return new Response(JSON.stringify({ email: user.email }), { status: 201 });
}
