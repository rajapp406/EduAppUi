'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchChapter } from '@/store/slices/chapterSlice';
import { Loader2, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fetchQuestion } from '@/store/slices/questionSlice';

export default function ChapterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const chapterId = Array.isArray(params?.chapterId) ? params.chapterId[0] : params?.chapterId || '';
  
  const dispatch = useAppDispatch();
  const { currentChapter, isLoading, error } = useAppSelector((state) => state.chapters);
  const { availableQuestions } = useAppSelector((state) => state.questions);
console.log("availableQuestions", availableQuestions);
  useEffect(() => {
    if (chapterId) {
      dispatch(fetchQuestion({chapterId, subjectId}));
    }
  }, [dispatch, chapterId, subjectId]);

  const handleBack = () => {
    router.push(`/subjects/${subjectId}/chapter`);
  };

  const handleStartQuiz = () => {
    router.push(`/subjects/${subjectId}/chapter/${chapterId}/quizzes`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={handleBack}>Back to Chapters</Button>
      </div>
    );
  }

  if (!availableQuestions.length) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500">Chapter not found</p>
        <Button onClick={handleBack} className="mt-4">Back to Chapters</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleBack} variant="outline" className="mb-6">
        Back to Chapters
      </Button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentChapter?.title}</h1>
            <p className="text-gray-600">{currentChapter?.content || 'Chapter content'}</p>
          </div>
          <Button 
            onClick={handleStartQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Quiz
          </Button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Chapter Details</h2>
          <div className="prose max-w-none">
            <p>Chapter {currentChapter?.chapterNumber}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          Chapter {currentChapter?.chapterNumber}
        </p>
        {availableQuestions?.map((question: any) => (
          <div key={question.id}>
            <h3 className="text-lg font-semibold">{question.questionText}</h3>
            <p className="text-gray-600">{question.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
