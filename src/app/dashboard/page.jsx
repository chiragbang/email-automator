// import { getServerSession } from 'next-auth';
// // import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { authOptions } from '../api/auth/[...nextauth]/route';

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions);
//   // console.log('Session:', session);
//     console.log('Dashboard session:', session);


//   if (!session) {
//     return <div className="p-6 text-red-600">Access Denied. Please login.</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl">Welcome, {session.user.email} 👋</h1>
//     </div>
//   );
// }


import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log('Dashboard session:', session);

  if (!session) {
    return <div className="p-6 text-red-600">Access Denied. Please login.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl">Welcome, {session.user.name} 👋</h1>
    </div>
  );
}
