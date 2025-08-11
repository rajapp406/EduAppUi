"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Trophy,
  Play,
  FileText,
  ChevronRight,
  Star,
  Target,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Chapter } from "@/models/chapter";
import { MainLayout } from "@/components/Layout/MainLayout";
import { ChapterCard } from "@/components/ChapterCard/ChapterCard";
import { ChapterCardSkeleton } from "@/components/ChapterCard/ChapterCardSkeleton";
import { loadChaptersBySubjectIdAsync } from "@/store/slices/chapter/thunks";

export default function SubjectChaptersPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const dispatch = useAppDispatch();
  const { availableChapters, isLoading, error } = useAppSelector(
    (state) => state.chapters
  );
  const { availableSubjects } = useAppSelector((state) => state.subjects);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  // Get the current subject
  const currentSubject = availableSubjects?.find(
    (sub: any) => sub.id === subjectId
  );

  useEffect(() => {
    if (subjectId) {
      dispatch(loadChaptersBySubjectIdAsync(subjectId));
    }
  }, [dispatch, subjectId]);

  const handleBack = () => {
    router.push("/subjects");
  };

  const handleChapterClick = (chapterId: string) => {
    router.push(`/subjects/${subjectId}/chapter/${chapterId}`);
  };

  // Generate consistent colors for the subject
  const getSubjectColor = (name: string) => {
    const colors = [
      {
        gradient: "from-blue-500 to-blue-600",
        light: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        text: "text-blue-600",
      },
      {
        gradient: "from-red-500 to-red-600",
        light: "from-red-50 to-red-100",
        border: "border-red-200",
        text: "text-red-600",
      },
      {
        gradient: "from-green-500 to-green-600",
        light: "from-green-50 to-green-100",
        border: "border-green-200",
        text: "text-green-600",
      },
      {
        gradient: "from-yellow-500 to-yellow-600",
        light: "from-yellow-50 to-yellow-100",
        border: "border-yellow-200",
        text: "text-yellow-600",
      },
      {
        gradient: "from-purple-500 to-purple-600",
        light: "from-purple-50 to-purple-100",
        border: "border-purple-200",
        text: "text-purple-600",
      },
      {
        gradient: "from-cyan-500 to-cyan-600",
        light: "from-cyan-50 to-cyan-100",
        border: "border-cyan-200",
        text: "text-cyan-600",
      },
      {
        gradient: "from-orange-500 to-orange-600",
        light: "from-orange-50 to-orange-100",
        border: "border-orange-200",
        text: "text-orange-600",
      },
      {
        gradient: "from-lime-500 to-lime-600",
        light: "from-lime-50 to-lime-100",
        border: "border-lime-200",
        text: "text-lime-600",
      },
    ];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  const subjectColors = currentSubject
    ? getSubjectColor(currentSubject.name)
    : getSubjectColor("default");

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
            </div>

            {/* Stats Bar Skeleton */}
            <div className="bg-gray-100 rounded-2xl p-6 mb-8 animate-pulse">
              <div className="flex justify-around gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ChapterCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={handleBack}
                className="bg-red-500 hover:bg-red-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {currentSubject?.iconUrl ? (
                  <img
                    src={currentSubject.iconUrl}
                    alt={`${currentSubject.name} icon`}
                    className="w-12 h-12 rounded-xl object-cover shadow-lg"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subjectColors.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white text-xl font-bold">
                      {currentSubject?.name?.charAt(0).toUpperCase() || "C"}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentSubject?.name || "Subject"} Chapters
                  </h1>
                  <p className="text-gray-600">
                    Grade {currentSubject?.grade} • {currentSubject?.board}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div
              className={`bg-gradient-to-r ${subjectColors.light} border ${subjectColors.border} rounded-2xl p-6`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${subjectColors.text} mx-auto mb-2`}
                  >
                    <BookOpen className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {availableChapters?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Chapters</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${subjectColors.text} mx-auto mb-2`}
                  >
                    <Clock className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ~{(availableChapters?.length || 0) * 45}m
                  </div>
                  <div className="text-sm text-gray-600">Est. Study Time</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${subjectColors.text} mx-auto mb-2`}
                  >
                    <Target className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">0%</div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${subjectColors.text} mx-auto mb-2`}
                  >
                    <Trophy className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Grid */}
          {availableChapters && availableChapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableChapters.map((chapter: Chapter, index: number) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  subjectColors={subjectColors}
                  isHovered={hoveredChapter === chapter.id}
                  onHover={setHoveredChapter}
                  onClick={handleChapterClick}
                  onQuizClick={(chapterId) => {
                    // Handle quiz navigation
                    router.push(
                      `/subjects/${subjectId}/chapter/${chapterId}/quiz`
                    );
                  }}
                  progress={0} // TODO: Get actual progress from state
                  estimatedTime="~45 min"
                  completedCount={0} // TODO: Get actual completion count
                  status="new" // TODO: Determine actual status
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Chapters Available
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                It looks like there are no chapters available for this subject
                yet. Check back later or contact your instructor.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
