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
  const [uploading, setUploading] = useState(false);

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
            resumeUrl: data.resumeUrl || '', // ✅ Resume URL loaded
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
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);  // make sure your backend expects 'resume' key

    try {
      const res = await fetch('/api/upload-resume', { // assuming your API route is /api/upload-resume
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setForm((prev) => ({ ...prev, resumeUrl: data.fileUrl })); // Update resumeUrl with the uploaded file URL
      setMessage('Resume uploaded successfully!');
    } catch (error) {
      setMessage('Resume upload failed.');
    } finally {
      setUploading(false);
    }
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
      headers: { 'Content-Type': 'application/json' },
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
      {message && <p className={`mb-4 ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 border"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border"
        />
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          className="p-2 border"
        />
        <input
          name="totalExperience"
          value={form.totalExperience}
          onChange={handleChange}
          placeholder="Total Experience"
          className="p-2 border"
        />
        <input
          name="linkedinUrl"
          value={form.linkedinUrl}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="p-2 border"
        />
        <input
          name="githubUrl"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="p-2 border"
        />

        <label className="block">
          <span className="text-gray-700">Upload Resume (PDF, DOCX)</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
            disabled={uploading}
          />
        </label>

        {form.resumeUrl && (
          <p>
            Current Resume: <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a>
          </p>
        )}

        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
