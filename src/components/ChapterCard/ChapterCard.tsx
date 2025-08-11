import React from "react";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Chapter } from "@/models/chapter";

interface ChapterCardProps {
  chapter: Chapter;
  subjectColors: {
    gradient: string;
    light: string;
    border: string;
    text: string;
  };
  isHovered: boolean;
  onHover: (chapterId: string | null) => void;
  onClick: (chapterId: string) => void;
  onQuizClick?: (chapterId: string) => void;
  progress?: number;
  estimatedTime?: string;
  completedCount?: number;
  status?: "new" | "in-progress" | "completed";
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  subjectColors,
  isHovered,
  onHover,
  onClick,
  onQuizClick,
  progress = 0,
  estimatedTime = "~45 min",
  completedCount = 0,
  status = "new",
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case "completed":
        return { icon: "✓", text: "Completed", color: "text-green-600" };
      case "in-progress":
        return { icon: "⏳", text: "In Progress", color: "text-yellow-600" };
      default:
        return { icon: "★", text: "New", color: "text-blue-600" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:-translate-y-1 group overflow-hidden
        ${
          isHovered
            ? `${subjectColors.border} shadow-lg`
            : "border-gray-200 hover:border-gray-300"
        }
      `}
      onClick={() => onClick(chapter.id)}
      onMouseEnter={() => onHover(chapter.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-transparent opacity-30 rounded-bl-full"></div>
      <div
        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${subjectColors.gradient} flex items-center justify-center text-white text-sm font-bold`}
      >
        {chapter.chapterNumber}
      </div>

      {/* Status Badge */}
      {status === "completed" && (
        <div className="absolute top-4 left-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Chapter Content */}
      <div className="p-6">
        {/* Chapter Icon */}
        <div className="mb-4">
          {chapter.iconUrl ? (
            <img
              src={chapter.iconUrl}
              alt={`${chapter.title} icon`}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${subjectColors.gradient} flex items-center justify-center shadow-md relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <BookOpen className="w-8 h-8 text-white z-10" />
            </div>
          )}
        </div>

        {/* Chapter Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {chapter.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Chapter {chapter.chapterNumber}
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">
                Progress
              </span>
              <span className="text-xs font-semibold text-gray-800">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${subjectColors.gradient} transition-all duration-500 relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Chapter Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{completedCount} completed</span>
            </div>
            <div className={`flex items-center gap-1 ${statusInfo.color}`}>
              <Star className="w-3 h-3" />
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(chapter.id);
            }}
            className={`
              flex-1 bg-gradient-to-r ${subjectColors.gradient} text-white 
              font-semibold py-3 px-4 rounded-xl shadow-md
              hover:shadow-lg hover:-translate-y-0.5 
              transition-all duration-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              flex items-center justify-center gap-2
              relative overflow-hidden
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Play className="w-4 h-4 z-10" />
            <span className="z-10">Start Learning</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuizClick?.(chapter.id);
            }}
            className="
              px-4 py-3 border-2 border-gray-300 text-gray-700 
              font-semibold rounded-xl hover:border-gray-400 
              hover:bg-gray-50 hover:-translate-y-0.5
              transition-all duration-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
              flex items-center justify-center
            "
            title="Take Quiz"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Arrow */}
      <div
        className={`
        absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white shadow-md
        flex items-center justify-center transition-all duration-300
        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
      `}
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </div>

      {/* Shimmer Effect on Hover */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
        transform -skew-x-12 transition-transform duration-700
        ${isHovered ? "translate-x-full" : "-translate-x-full"}
      `}
      ></div>
    </div>
  );
};

export default ChapterCard;
