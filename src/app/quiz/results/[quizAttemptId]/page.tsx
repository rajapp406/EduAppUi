import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { quizService } from "@/services/quizService";
import { MainLayout } from "@/components/Layout/MainLayout";

// Import the client component dynamically to avoid SSR issues
import dynamicImport from "next/dynamic";

const QuizResultsClient = dynamicImport(() => import("./QuizResultsClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading Quiz Results</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  ),
});

// Enable static generation for this page
export const dynamic = "force-dynamic"; // Since quiz results are user-specific
export const revalidate = 0; // Don't cache user-specific data

interface PageProps {
  params: {
    quizAttemptId: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const quizAttempt = await quizService.getQuizAttemptById(
      params.quizAttemptId
    );
    const quizTitle = quizAttempt.quiz?.title || "Quiz";

    return {
      title: `${quizTitle} - Results | EduApp`,
      description: `View your quiz results for ${quizTitle}. Score: ${quizAttempt.score}%`,
      robots: "noindex, nofollow", // Don't index personal results
    };
  } catch {
    return {
      title: "Quiz Results | EduApp",
      description: "View your quiz results",
      robots: "noindex, nofollow",
    };
  }
}

// Server component for data fetching
async function QuizResultsServer({ quizAttemptId }: { quizAttemptId: string }) {
  try {
    // Fetch quiz attempt data on the server
    const quizAttempt = await quizService.getQuizAttemptById(quizAttemptId);

    // If quiz data is not embedded, fetch it separately
    let quiz = quizAttempt.quiz;
    if (!quiz && quizAttempt.quizId) {
      quiz = await quizService.getQuizById(quizAttempt.quizId);
    }

    if (!quiz || !quiz.questions || !quizAttempt.answers) {
      notFound();
    }

    return <QuizResultsClient quizAttempt={quizAttempt} quiz={quiz} />;
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    notFound();
  }
}

// Main page component
export default function QuizResultsPage({ params }: PageProps) {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">
                Loading Quiz Results
              </h2>
              <p className="text-gray-600">Please wait...</p>
            </div>
          </div>
        }
      >
        <QuizResultsServer quizAttemptId={params.quizAttemptId} />
      </Suspense>
    </MainLayout>
  );
}
