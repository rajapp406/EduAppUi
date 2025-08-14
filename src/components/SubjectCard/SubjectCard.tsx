import React from "react";
import { Subject } from "../../models/subject";

interface SubjectCardProps {
  subject: Subject;
  onStart: (subjectId: string) => void;
  onQuiz: (subjectId: string) => void;
  isSelected?: boolean;
  showProgress?: boolean;
  progress?: number;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onStart,
  onQuiz,
  isSelected = false,
  showProgress = false,
  progress = 0,
}) => {
  // Generate a color based on subject name for consistency
  const getSubjectColor = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-red-500 to-red-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
      "from-purple-500 to-purple-600",
      "from-cyan-500 to-cyan-600",
      "from-orange-500 to-orange-600",
      "from-lime-500 to-lime-600",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getBorderColor = (name: string) => {
    const colors = [
      "border-blue-200 hover:border-blue-400",
      "border-red-200 hover:border-red-400",
      "border-green-200 hover:border-green-400",
      "border-yellow-200 hover:border-yellow-400",
      "border-purple-200 hover:border-purple-400",
      "border-cyan-200 hover:border-cyan-400",
      "border-orange-200 hover:border-orange-400",
      "border-lime-200 hover:border-lime-400",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const subjectGradient = getSubjectColor(subject.name);
  const borderColor = getBorderColor(subject.name);

  return (
    <div
      className={`
      relative bg-card rounded-2xl border-2 border-border hover:border-primary/50
      shadow-theme-sm hover:shadow-theme-xl transition-all duration-300 
      hover:-translate-y-1 cursor-pointer overflow-hidden
      ${isSelected ? "ring-2 ring-primary ring-opacity-50" : ""}
    `}
    >
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-muted to-transparent opacity-30 rounded-bl-full"></div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
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

      {/* Card Header */}
      <div className="p-6 pb-4 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3">
          {subject.iconUrl ? (
            <img
              src={subject.iconUrl}
              alt={`${subject.name} icon`}
              className="w-16 h-16 rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div
              className={`
              w-16 h-16 rounded-xl bg-gradient-to-br ${subjectGradient} 
              flex items-center justify-center shadow-lg relative overflow-hidden
            `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white text-2xl font-bold z-10">
                {subject.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Grade badge */}
          <div className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border shadow-theme-sm">
            Grade {subject.grade}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-4 flex flex-col gap-3">
        <h3 className="text-xl font-bold text-foreground text-center leading-tight">
          {subject.name}
        </h3>

        {/* Board info with icon */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <svg
            className="w-4 h-4 opacity-70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wide">
            {subject.board}
          </span>
        </div>

        {/* Progress bar (if enabled) */}
        {showProgress && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Progress
              </span>
              <span className="text-xs font-semibold text-foreground">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${subjectGradient} transition-all duration-500 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(subject.id);
          }}
          className={`
            flex-1 bg-gradient-to-r ${subjectGradient} text-white 
            font-semibold py-3 px-4 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-0.5 
            transition-all duration-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50
          `}
        >
          Start Learning
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuiz(subject.id);
          }}
          className="
            px-4 py-3 border-2 border-border text-foreground 
            font-semibold rounded-xl hover:border-primary/50 
            hover:bg-accent hover:-translate-y-0.5
            transition-all duration-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50
          "
        >
          Quiz
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
