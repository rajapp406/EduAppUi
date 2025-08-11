import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { quizService } from "@/services/quizService";
import { StartQuizClient } from "./StartQuizClient";
import { MainLayout } from "@/components/Layout/MainLayout";

// Enable ISR for quiz pages
export const dynamic = "force-dynamic"; // Quiz attempts are user-specific
export const revalidate = 300; // Revalidate every 5 minutes

interface PageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const quiz = await quizService.getQuizById(params.id);

    return {
      title: `${quiz.title} | EduApp`,
      description:
        quiz.description ||
        `Take the ${quiz.title} quiz and test your knowledge.`,
      keywords: `quiz, ${quiz.primarySubject?.name}, education, learning`,
      openGraph: {
        title: quiz.title,
        description: quiz.description || `Take the ${quiz.title} quiz`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Quiz | EduApp",
      description: "Take a quiz and test your knowledge",
    };
  }
}

// Server component for data fetching
async function StartQuizServer({ quizId }: { quizId: string }) {
  try {
    // Fetch quiz data on the server
    const quiz = await quizService.getQuizById(quizId);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      notFound();
    }

    return <StartQuizClient quiz={quiz} />;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    notFound();
  }
}

// Simple loading component
function QuizLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <h2 className="text-xl font-semibold mb-2">Loading Quiz</h2>
        <p className="text-gray-600">Preparing your questions...</p>
      </div>
    </div>
  );
}

// Main page component
export default function StartQuizPage({ params }: PageProps) {
  return (
    <MainLayout>
      <Suspense fallback={<QuizLoading />}>
        <StartQuizServer quizId={params.id} />
      </Suspense>
    </MainLayout>
  );
}
