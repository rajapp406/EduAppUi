'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LoginModal from '../../components/Auth/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      console.log('Redirecting to dashboard...');
      // Try both methods to ensure redirection works
      router.push('/dashboard');
      // Fallback to window.location if router.push doesn't work
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated, router]);
  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account ff
          </p>
        </div>
        <LoginModal isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
