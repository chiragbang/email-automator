'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    location: '',
    skills: '',
    totalExperience: '',
    linkedinUrl: '',
    githubUrl: '',
    resumeUrl: '',
  });

  const [message, setMessage] = useState('');

 useEffect(() => {
  const fetchProfile = async () => {
    const res = await fetch('/api/profile');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        setForm({
          fullName: data.fullName || '',
          location: data.location || '',
          skills: data.skills?.join(', ') || '',
          totalExperience: data.totalExperience || '',
          linkedinUrl: data.linkedinUrl || '',
          githubUrl: data.githubUrl || '',
          resumeUrl: data.resumeUrl || '', // ✅ Add this line
        });
      }
    }
  };
  fetchProfile();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  setForm({ ...form, resumeUrl: data.url });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      ...form,
      skills: form.skills.split(',').map((s) => s.trim()),
    };

    const res = await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage('Profile saved successfully!');
    } else {
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="p-2 border" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2 border" />
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma-separated)" className="p-2 border" />
        <input name="totalExperience" value={form.totalExperience} onChange={handleChange} placeholder="Total Experience" className="p-2 border" />
        <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="p-2 border" />
        <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="p-2 border" />
        <input type="file" onChange={handleFileUpload} className="p-2 border" />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">Save Profile</button>
      </form>
    </div>
  );
}
