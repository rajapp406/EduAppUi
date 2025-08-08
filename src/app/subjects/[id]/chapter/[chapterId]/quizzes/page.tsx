'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { loadQuizzesByChapter } from '@/store/slices/quizSlice';
import QuizList from '@/components/Quiz/QuizList';
import { subjectService } from '@/services/subjectService';
import { chapterService } from '@/services/chapterService';
import { useQuery } from '@tanstack/react-query';

export default function ChapterQuizzesPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params?.id as string;
  const chapterId = params?.chapterId as string;
  const dispatch = useAppDispatch();
  
  // Fetch subject details
  const { 
    data: subject, 
    isLoading: isLoadingSubject, 
    error: subjectError 
  } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => subjectService.getSubjectById(subjectId),
    enabled: !!subjectId,
  });

  // Fetch chapter details
  const { 
    data: chapter, 
    isLoading: isLoadingChapter, 
    error: chapterError 
  } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => chapterService.getChapterById(chapterId),
    enabled: !!chapterId,
  });
  
  // Load quizzes for this chapter
  useEffect(() => {
    if (chapterId) {
      dispatch(loadQuizzesByChapter({chapterId, page: 1, limit: 10}));
    }
  }, [chapterId, dispatch]);
  
  const { 
    quizzesByChapter, 
    isLoadingQuizzes, 
    error: quizError 
  } = useSelector((state: RootState) => state.quiz);
  
  // Handle loading states
  if (isLoadingSubject || isLoadingChapter) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Handle errors
  if (subjectError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        Error loading subject: {subjectError.message}
      </div>
    );
  }
  
  if (chapterError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        Error loading chapter: {chapterError.message}
      </div>
    );
  }
  
  if (quizError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        Error loading quizzes: {quizError}
      </div>
    );
  }
  
  if (!subject || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg mb-4">
          Subject or Chapter not found
        </div>
        <button
          onClick={() => router.push(`/subjects/${subjectId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Chapters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <button 
                onClick={() => router.push('/subjects')}
                className="text-blue-600 hover:text-blue-800"
              >
                Subjects
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <button 
                  onClick={() => router.push(`/subjects/${subjectId}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {subject.name}
                </button>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{chapter.title} Quizzes</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900">{chapter.title} Quizzes</h1>
        <p className="mt-2 text-gray-600">
          Test your knowledge of {chapter.title} with these quizzes.
        </p>
      </div>
      
      <QuizList 
        chapterId={chapterId}
        title={`${chapter.title} Quizzes`}
        description={`Test your knowledge of ${chapter.title} from ${subject.name}`}
      />
    </div>
  );
}
