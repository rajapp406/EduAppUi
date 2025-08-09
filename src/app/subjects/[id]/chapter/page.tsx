'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Chapter } from '@/models/chapter';
import { MainLayout } from '@/components/Layout/MainLayout';
import { loadChaptersBySubjectIdAsync } from '@/store/slices/chapter/thunks';

export default function SubjectChaptersPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  
  const dispatch = useAppDispatch();
  const { availableChapters, isLoading, error } = useAppSelector((state) => state.chapters);
  const { availableSubjects } = useAppSelector((state) => state.subjects);

  // Get the current subject name
  const currentSubject = availableSubjects?.find((sub: any) => sub.id === subjectId);

  useEffect(() => {
    if (subjectId) {
      dispatch(loadChaptersBySubjectIdAsync(subjectId));
    }
  }, [dispatch, subjectId]);

  const handleBack = () => {
    router.push('/subjects');
  };

  const handleChapterClick = (chapterId: string) => {
    router.push(`/subjects/${subjectId}/chapter/${chapterId}`);
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
        <Button onClick={handleBack}>Back to Subjects</Button>
      </div>
    );
  }

  return (
    <MainLayout>
        <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mr-4"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">
          {currentSubject ? `Chapters - ${currentSubject.name}` : 'Chapters'}
        </h1>
      </div>

      {availableChapters && availableChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableChapters.map((chapter: Chapter) => (
            <div 
              key={chapter.id} 
              className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleChapterClick(chapter.id)}
            >
              <h2 className="text-xl font-semibold">{chapter.title}</h2>
              <p className="text-gray-600 mt-2">Chapter {chapter.chapterNumber}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No chapters found for this subject.</p>
        </div>
      )}
    </div>
    </MainLayout> 
  );    
}
