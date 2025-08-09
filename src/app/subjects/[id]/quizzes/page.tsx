'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import QuizList from '@/components/Quiz/QuizList';
import { useGetSubjectQuery } from '@/services/subjectApi';
import { Loader } from '@/components/ui/loader';
import { AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { loadQuizzesBySubject } from '@/store/slices/quiz/thunks';
export default function SubjectQuizzesPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params?.id as string;
  const dispatch = useAppDispatch();
  
  // Fetch subject details using RTK Query
  const { 
    data: subject, 
    isLoading: isLoadingSubject, 
    isError: isSubjectError,
    error: subjectError 
  } = useGetSubjectQuery(subjectId, {
    skip: !subjectId,
  });
  console.log(subject)
  // Load quizzes for this subject
  useEffect(() => {
    if (subjectId) {
      dispatch(loadQuizzesBySubject({subjectId: subjectId, page: 1, limit: 10}));
    }
  }, [subjectId, dispatch]);

  // Handle loading state
  if (isLoadingSubject) {
    return <Loader />;
  }

  // Handle error state
  if (isSubjectError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {subjectError ? 
              (subjectError as any)?.data?.message || 'Failed to load subject details' : 
              'An error occurred while loading the subject'}
          </span>
        </div>
      </div>
    );
  }

  // Handle case when subject is not found
  if (!subject) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">Subject not found</span>
        </div>
      </div>
    );
  }

  if (isLoadingSubject) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Subject not found</h1>
        <button
          onClick={() => router.push('/subjects')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <QuizList 
        subjectId={subjectId}
        title={`${subject.name} Quizzes`}
        description={`Test your knowledge of ${subject.name}`}
      />
    </div>
    </MainLayout>
  );
}
