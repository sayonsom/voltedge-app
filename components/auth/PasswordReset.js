'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft, Mail } from 'lucide-react';

export default function PasswordReset({ onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#0078d4] hover:underline self-start"
      >
        <ArrowLeft size={16} />
        Back to login
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          Password reset email sent! Please check your inbox.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} icon={<Mail size={16} />}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
