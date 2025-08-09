import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 mb-6">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/quiz"
              className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Browse Available Quizzes
            </Link>
            <Link
              href="/dashboard"
              className="inline-block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}