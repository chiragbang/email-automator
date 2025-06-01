"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input, Button, Form, Divider, Typography } from 'antd';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (values) => {
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 ">
        <div className="max-w-md w-full">

        <Typography.Title level={2} className="text-center">Login</Typography.Title>

        {error && <Typography.Text type="danger">{error}</Typography.Text>}

        <Form layout="vertical" onFinish={handleLogin} className="mt-4">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider>or</Divider>

        <Button
          type="default"
          className="w-full bg-red-500 text-white hover:bg-red-600"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Sign in with Google
        </Button>
      </div>
      </div>

      {/* Image Section */}
     <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
             <Image
               src="/signup.png"
               alt="Sign Up"
               fill
               style={{ objectFit: 'cover' }}
               priority
             />
           </div>
    </div>
  );
}