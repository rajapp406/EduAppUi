import Link from 'next/link';

export default function QuizNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Quiz Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">
          The quiz you're looking for doesn't exist or may have been removed.
        </p>
        <div className="mt-8">
          <Link
            href="/quiz"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Quiz List
          </Link>
        </div>
      </div>
    </div>
  );
}
