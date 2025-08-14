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
        return { icon: "✓", text: "Completed", color: "text-success" };
      case "in-progress":
        return { icon: "⏳", text: "In Progress", color: "text-warning" };
      default:
        return { icon: "★", text: "New", color: "text-primary" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`
        relative bg-card rounded-2xl border-2 transition-all duration-300 cursor-pointer
        hover:shadow-theme-xl hover:-translate-y-1 group overflow-hidden
        ${
          isHovered
            ? `border-primary shadow-theme-lg`
            : "border-border hover:border-primary/50"
        }
      `}
      onClick={() => onClick(chapter.id)}
      onMouseEnter={() => onHover(chapter.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-muted to-transparent opacity-30 rounded-bl-full"></div>
      <div
        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${subjectColors.gradient} flex items-center justify-center text-white text-sm font-bold`}
      >
        {chapter.chapterNumber}
      </div>

      {/* Status Badge */}
      {status === "completed" && (
        <div className="absolute top-4 left-4 w-6 h-6 bg-success rounded-full flex items-center justify-center">
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
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {chapter.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            Chapter {chapter.chapterNumber}
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Progress
              </span>
              <span className="text-xs font-semibold text-foreground">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${subjectColors.gradient} transition-all duration-500 relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Chapter Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50
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
              px-4 py-3 border-2 border-border text-foreground 
              font-semibold rounded-xl hover:border-primary/50 
              hover:bg-accent hover:-translate-y-0.5
              transition-all duration-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50
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
        absolute bottom-4 right-4 w-8 h-8 rounded-full bg-card shadow-theme-md
        flex items-center justify-center transition-all duration-300
        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
      `}
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
