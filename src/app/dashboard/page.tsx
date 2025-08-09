'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import QuizList from '../../components/Quiz/QuizList';
import { Loader2 } from 'lucide-react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle client-side redirection
  useEffect(() => {
    if (isClient && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && !user.isOnboardingComplete) {
        router.push('/onboarding');
      }
    }
  }, [isClient, isAuthenticated, isLoading, user, router]);

  // Show loading state until we know if user is authenticated
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Only render content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
     <MainLayout>
      <main className="min-h-[calc(100vh-4rem)] p-4">
       <Dashboard/>
       {/* <QuizList onStartQuiz={() => {
          // Handle quiz start
          console.log('Starting quiz:');
        }} /> */}
      </main>
      </MainLayout>
    </div>
  );
}
