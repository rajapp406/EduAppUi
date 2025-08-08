import { Loader2 } from 'lucide-react';

export default function QuizLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading quiz...</p>
        <p className="text-sm text-gray-500 mt-2">Preparing your quiz experience</p>
      </div>
    </div>
  );
}
