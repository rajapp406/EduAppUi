'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LoginModal from '../../components/Auth/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);

    // Redirect based on authentication and onboarding status
    if (isAuthenticated && user) {
      if (!user.isOnboardingComplete) {
        console.log('Redirecting to onboarding...');
        router.push('/onboarding');
      } else {
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }
      
      // Fallback to window.location if router.push doesn't work
      if (typeof window !== 'undefined') {
        const redirectPath = !user.isOnboardingComplete ? '/onboarding' : '/dashboard';
        window.location.href = redirectPath;
      }
    }
  }, [isAuthenticated, user, router]);
  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-8 bg-card rounded-lg shadow-theme-md border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your account
          </p>
        </div>
        <LoginModal isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
