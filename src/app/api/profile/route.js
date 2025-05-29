import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import User from '@/models/User';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response('User not found', { status: 404 });

  const update = await UserProfile.findOneAndUpdate(
    { userId: user._id },
    { ...body, userId: user._id },
    { upsert: true, new: true }
  );

  return Response.json(update);
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response('User not found', { status: 404 });

  const profile = await UserProfile.findOne({ userId: user._id });
  return Response.json(profile || {});
}
