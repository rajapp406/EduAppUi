'use client';

import { OnboardingData, GRADES } from '@/models/user';
import { Board } from '@/models/api';
import { GraduationCap, BookOpen } from 'lucide-react';

interface BasicInfoStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  error?: string;
}

export const BasicInfoStep = ({ data, onUpdate, error }: BasicInfoStepProps) => {
  const boards = [
    { value: Board.CBSE, label: 'CBSE', description: 'Central Board of Secondary Education' },
    { value: Board.ICSE, label: 'ICSE', description: 'Indian Certificate of Secondary Education' },
    { value: Board.IB, label: 'IB', description: 'International Baccalaureate' },
    { value: Board.STATE, label: 'State Board', description: 'State Education Board' },
    { value: Board.CAMBRIDGE, label: 'Cambridge', description: 'Cambridge International' }
  ];

  return (
    <div className="space-y-8">
      {/* Grade Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-500" />
          <label className="text-lg font-semibold text-gray-800">
            What grade are you in? *
          </label>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {GRADES.map((grade) => (
            <button
              key={grade}
              onClick={() => onUpdate({ grade })}
              className={`
                p-4 rounded-lg border-2 font-semibold transition-all duration-200
                hover:-translate-y-1 hover:shadow-md
                ${data.grade === grade
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {grade}
              {grade === 12 && <span className="block text-xs text-gray-500">Final</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Board Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <label className="text-lg font-semibold text-gray-800">
            Which board are you studying under? *
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map((board) => (
            <button
              key={board.value}
              onClick={() => onUpdate({ board: board.value })}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                hover:-translate-y-1 hover:shadow-md
                ${data.board === board.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="font-semibold text-gray-800">{board.label}</div>
              <div className="text-sm text-gray-600 mt-1">{board.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Why do we need this?</strong> We use your grade and board information to 
          show you relevant subjects, chapters, and questions that match your curriculum.
        </p>
      </div>
    </div>
  );
};