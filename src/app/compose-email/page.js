'use client';

import { useEffect, useState } from 'react';
import { generateEmailTemplates } from '@/lib/emailTemplates';

export default function ComposeEmailPage() {
  const [profileData, setProfileData] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
         data.resumeUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        setProfileData(data);
      }
    };
    fetchProfile();
  }, []);

  const handleRecipientChange = (e) => setRecipient(e.target.value);

  const generateTemplates = () => {
    const emailTemplates = generateEmailTemplates(profileData, recipient);
    setTemplates(emailTemplates);
  };

  const handleSend = async (selectedEmail) => {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: 'Job Application',
        body: selectedEmail,
        resumeUrl: profileData?.resumeUrl,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert('Email sent successfully!');
    } else {
      alert('Failed to send email: ' + result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Compose Job Application Email</h1>

      <input
        type="email"
        placeholder="Recipient's email"
        value={recipient}
        onChange={handleRecipientChange}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={generateTemplates}
        disabled={!profileData || !recipient}
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
