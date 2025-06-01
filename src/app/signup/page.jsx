'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Form, Input, Button, Alert, Divider, Typography } from 'antd';

const { Title } = Typography;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify({ email: email.trim() }),
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

  const handleSignup = async () => {
    setError('');
    setMessage('');

    if (!name.trim() || !mobileNumber.trim() || !otp.trim() || !password) {
      setError('Please complete all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          otp: otp.trim(),
          name: name.trim(),
          mobileNumber: mobileNumber.trim(),
        }),
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Image Section */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
        <Image
          src="/signup.png"
          alt="Sign Up"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 bg-neutral-100">
        <div className="max-w-md w-full">
          <Title level={2} className="text-center mb-6">Sign Up</Title>

          {error && <Alert message={error} type="error" showIcon className="mb-4" />}
          {message && <Alert message={message} type="success" showIcon className="mb-4" />}

          {!otpSent ? (
            <Form layout="vertical" onFinish={sendOtp}>
              <Form.Item
                label="Name"
                rules={[{ required: true, message: 'Please enter your name!' }]}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={!email.trim()}
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleSignup}>
              <Form.Item label="Email">
                <Input value={email} disabled className="bg-gray-100" />
              </Form.Item>
              <Form.Item
                label="OTP"
                rules={[{ required: true, message: 'Please enter the OTP!' }]}
              >
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your number!' }]}
              >
                <Input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={!name.trim() || !mobileNumber.trim() || !otp.trim() || !password}
                >
                  Complete Sign Up
                </Button>
              </Form.Item>
            </Form>
          )}

          <Divider>or</Divider>

          <Button
            type="default"
            danger
            block
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
