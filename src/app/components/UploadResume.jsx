import { useState } from 'react';

export default function ResumeUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/upload-resume', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      alert('Resume uploaded!');
      onUpload(data.fileUrl);
    } else {
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
        Upload Resume
      </button>
    </form>
  );
}
