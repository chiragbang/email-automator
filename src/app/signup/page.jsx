'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP to email
  const sendOtp = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setOtpSent(true);
        setMessage('OTP sent to your email. Please check your inbox.');
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to send OTP.');
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  // Step 2: Handle registration with OTP and password
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || !password) {
      setError('Please enter OTP and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });

      if (res.status === 201) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        const msg = await res.text();
        setError(msg || 'Registration failed.');
      }
    } catch {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={loading}
            required
          />
          <button
            onClick={sendOtp}
            className={`w-full p-3 rounded text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!email || loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 border rounded mb-4 bg-gray-100 cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full p-3 rounded text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!otp || !password || loading}
          >
            {loading ? 'Registering...' : 'Complete Sign Up'}
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-500 font-medium">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-full p-3 rounded bg-red-600 text-white hover:bg-red-700 transition"
      >
        Continue with Google
      </button>
    </div>
  );
}
