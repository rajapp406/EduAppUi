'use client';

import { OnboardingData, SUBJECT_INTERESTS } from '@/models/user';
import { Heart, BookOpen, Sparkles } from 'lucide-react';

interface InterestsStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  error?: string;
}

export const InterestsStep = ({ data, onUpdate, error }: InterestsStepProps) => {
  const selectedInterests = data.interests || [];

  const toggleInterest = (interest: string) => {
    const currentInterests = selectedInterests;
    const isSelected = currentInterests.includes(interest);
    
    let newInterests;
    if (isSelected) {
      newInterests = currentInterests.filter(i => i !== interest);
    } else {
      newInterests = [...currentInterests, interest];
    }
    
    onUpdate({ interests: newInterests });
  };

  const getSubjectIcon = (subject: string) => {
    const iconMap: Record<string, string> = {
      'Mathematics': '🔢',
      'Science': '🔬',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'English': '📚',
      'Hindi': '🇮🇳',
      'Social Studies': '🌍',
      'History': '🏛️',
      'Geography': '🗺️',
      'Computer Science': '💻',
      'Economics': '📈',
      'Accountancy': '💰',
      'Business Studies': '💼',
      'Political Science': '🏛️',
      'Psychology': '🧠',
      'Philosophy': '🤔',
      'Art': '🎨',
      'Music': '🎵'
    };
    return iconMap[subject] || '📖';
  };

  return (
    <div className="space-y-6">
      {/* Optional Step Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <p className="text-purple-800 font-semibold">This step is optional</p>
        </div>
        <p className="text-purple-700 text-sm">
          Tell us about your favorite subjects to help us personalize your learning experience 
          and recommend content that matches your interests.
        </p>
      </div>

      {/* Interests Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <label className="text-lg font-semibold text-gray-800">
            What subjects interest you the most?
          </label>
        </div>
        <p className="text-gray-600 mb-4">
          Select all subjects that you enjoy or want to focus on. You can change these anytime.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SUBJECT_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  hover:-translate-y-1 hover:shadow-md
                  ${isSelected
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSubjectIcon(interest)}</span>
                  <div>
                    <div className="font-medium text-sm">{interest}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Count */}
      {selectedInterests.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Great! You've selected {selectedInterests.length} subject{selectedInterests.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {getSubjectIcon(interest)} {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">How this helps you:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Get personalized content recommendations</li>
          <li>• See relevant quizzes and practice questions first</li>
          <li>• Connect with students who share similar interests</li>
          <li>• Receive targeted study tips and resources</li>
        </ul>
      </div>
    </div>
  );
};