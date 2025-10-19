'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

export default function LoginForm({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">VoltEdge</h1>
        <p className="text-sm text-gray-600">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email address"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="button"
        onClick={onForgotPassword}
        className="text-sm text-[#0078d4] hover:underline text-left"
      >
        Forgot password?
      </button>

      <Button type="submit" disabled={loading} icon={<LogIn size={16} />}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
