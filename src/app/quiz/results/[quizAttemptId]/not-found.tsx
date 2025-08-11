import Link from 'next/link';
import Button from '@/components/ui/Button';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results Not Found</h1>
          <p className="text-gray-600 mb-8">
            The quiz results you're looking for don't exist or may have been removed.
          </p>
          <div className="space-y-4">
            <div>
              <Link href="/quiz">
                <Button>Browse Quizzes</Button>
              </Link>
            </div>
            <div>
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}