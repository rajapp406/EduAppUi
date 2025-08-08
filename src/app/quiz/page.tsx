'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import QuizList from '../../components/Quiz/QuizList';
import { Loader2 } from 'lucide-react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { useAuthentication } from '@/hooks/authHook';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function DashboardPage() {
  const {isAuthenticated, isLoading, isClient} = useAuthentication();
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
      <MainLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <main className="min-h-[calc(100vh-4rem)] p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
       <QuizList onStartQuiz={() => {
          // Handle quiz start
          console.log('Starting quiz:');
        }} />
      </main>
    </div>
    </MainLayout>
  );
}
