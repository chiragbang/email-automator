// 'use client';

// import { useEffect, useState } from 'react';
// import { generateEmailTemplates } from '@/lib/emailTemplates';

// export default function ComposeEmailPage() {
//   const [profileData, setProfileData] = useState(null);
//   const [recipient, setRecipient] = useState('');
//   const [templates, setTemplates] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const res = await fetch('/api/profile');
//       if (res.ok) {
//         const data = await res.json();
//          data.resumeUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
//         setProfileData(data);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleRecipientChange = (e) => setRecipient(e.target.value);

//   const generateTemplates = () => {
//     const emailTemplates = generateEmailTemplates(profileData, recipient);
//     setTemplates(emailTemplates);
//   };

//   const handleSend = async (selectedEmail) => {
//     const res = await fetch('/api/send-email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         to: recipient,
//         subject: 'Job Application',
//         body: selectedEmail,
//         resumeUrl: profileData?.resumeUrl,
//       }),
//     });

//     const result = await res.json();
//     if (res.ok) {
//       alert('Email sent successfully!');
//     } else {
//       alert('Failed to send email: ' + result.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Compose Job Application Email</h1>

//       <input
//         type="email"
//         placeholder="Recipient's email"
//         value={recipient}
//         onChange={handleRecipientChange}
//         className="w-full border p-2 mb-4"
//       />

//       <button
//         onClick={generateTemplates}
//         disabled={!profileData || !recipient}
//         className="bg-green-600 text-white px-4 py-2 mb-6 rounded"
//       >
//         Generate Email Templates
//       </button>

//       {templates.map((template, index) => (
//         <div key={index} className="border p-4 my-4 bg-gray-50 rounded">
//           <pre className="whitespace-pre-wrap text-sm">{template}</pre>
//           <button
//             onClick={() => handleSend(template)}
//             className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Send This Email
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// === FRONTEND ===
// File: ComposeEmailPage.js

// 'use client';

// import { useEffect, useState } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { generateEmailTemplates } from '@/lib/emailTemplates';

// export default function ComposeEmailPage() {
//   const [profileData, setProfileData] = useState(null);
//   const [recipient, setRecipient] = useState('');
//   const [templates, setTemplates] = useState([]);
//   const [accessToken, setAccessToken] = useState(null);
//   const [userEmail, setUserEmail] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const res = await fetch('/api/profile');
//       if (res.ok) {
//         const data = await res.json();
//         setProfileData(data);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const login = useGoogleLogin({
//     scope: 'https://mail.google.com https://www.googleapis.com/auth/userinfo.email',
//     onSuccess: async (tokenResponse) => {
//       setAccessToken(tokenResponse.access_token);

//       // Get user email from token info
//       const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//       });
//       setUserEmail(data.email);
//     },
//     onError: (err) => console.error('Google Login Error:', err),
//   });

//   const handleRecipientChange = (e) => setRecipient(e.target.value);

//   const generateTemplates = () => {
//     const emailTemplates = generateEmailTemplates(profileData, recipient);
//     setTemplates(emailTemplates);
//   };

//   const handleSend = async (selectedEmail) => {
//     const res = await fetch('/api/send-email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//      body: JSON.stringify({
//   to: recipient,
//   subject: 'Job Application',
//   body: selectedEmail,
//   resumeUrl: profileData?.resumeUrl,
//   accessToken: userAccessToken,
//   senderEmail: userEmail
// })
//     });

//     const result = await res.json();
//     if (res.ok) {
//       alert('Email sent successfully!');
//     } else {
//       alert('Failed to send email: ' + result.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Compose Job Application Email</h1>

//       <button onClick={() => login()} className="bg-red-600 text-white px-4 py-2 mb-4 rounded">
//         Login with Google
//       </button>

//       <input
//         type="email"
//         placeholder="Recipient's email"
//         value={recipient}
//         onChange={handleRecipientChange}
//         className="w-full border p-2 mb-4"
//       />

//       <button
//         onClick={generateTemplates}
//         disabled={!profileData || !recipient}
//         className="bg-green-600 text-white px-4 py-2 mb-6 rounded"
//       >
//         Generate Email Templates
//       </button>

//       {templates.map((template, index) => (
//         <div key={index} className="border p-4 my-4 bg-gray-50 rounded">
//           <pre className="whitespace-pre-wrap text-sm">{template}</pre>
//           <button
//             onClick={() => handleSend(template)}
//             className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Send This Email
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { generateEmailTemplates } from '@/lib/emailTemplates';

export default function ComposeEmailPage() {
  const { data: session } = useSession();
  const [recipient, setRecipient] = useState('');
  const [templates, setTemplates] = useState([]);
  const profileData = session?.user?.profileData || null; // You can store profileData in session if needed

  const generateTemplates = () => {
    const emailTemplates = generateEmailTemplates(profileData, recipient);
    setTemplates(emailTemplates);
  };

  const handleSend = async (selectedEmail) => {
    if (!session) {
      alert('Please sign in first');
      return;
    }

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: 'Job Application',
        body: selectedEmail,
        // No need to send accessToken or senderEmail from client,
        // backend will get user email and tokens from session
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert('Email sent successfully!');
    } else {
      alert('Failed to send email: ' + result.error);
    }
  };

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Compose Job Application Email</h1>
        <p className="mb-2 text-gray-700">Please sign in with Google to send email from your account:</p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Compose Job Application Email</h1>

      <p className="mb-4">Signed in as: {session.user.email} <button className="ml-4 text-sm underline" onClick={() => signOut()}>Sign out</button></p>

      <input
        type="email"
        placeholder="Recipient's email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={generateTemplates}
        disabled={!recipient}
        className="bg-green-600 text-white px-4 py-2 mb-6 rounded"
      >
        Generate Email Templates
      </button>

      {templates.map((template, index) => (
        <div key={index} className="border p-4 my-4 bg-gray-50 rounded">
          <pre className="whitespace-pre-wrap text-sm">{template}</pre>
          <button
            onClick={() => handleSend(template)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send This Email
          </button>
        </div>
      ))}
    </div>
  );
}
