'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import PasswordReset from '@/components/auth/PasswordReset';

export default function Home() {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/map');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1] p-4">
      {showPasswordReset ? (
        <PasswordReset onBack={() => setShowPasswordReset(false)} />
      ) : (
        <LoginForm onForgotPassword={() => setShowPasswordReset(true)} />
      )}
    </div>
  );
}
