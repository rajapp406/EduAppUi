'use client';

import { OnboardingData } from '@/models/user';
import { Phone, Mail, Calendar, User } from 'lucide-react';

interface ContactInfoStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  error?: string;
}

export const ContactInfoStep = ({ data, onUpdate, error }: ContactInfoStepProps) => {
  return (
    <div className="space-y-6">
      {/* Optional Step Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>This step is optional.</strong> Providing contact information helps us 
          send important updates and allows parents to stay informed about your progress.
        </p>
      </div>

      {/* Date of Birth */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-500" />
          <label className="text-lg font-semibold text-gray-800">
            Date of Birth
          </label>
        </div>
        <input
          type="date"
          value={data.dateOfBirth || ''}
          onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
          className="
            w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 
            focus:outline-none transition-colors duration-200 text-gray-800
          "
        />
      </div>

      {/* Phone Number */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-blue-500" />
          <label className="text-lg font-semibold text-gray-800">
            Phone Number
          </label>
        </div>
        <input
          type="tel"
          value={data.phoneNumber || ''}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
          placeholder="Enter your phone number"
          className="
            w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 
            focus:outline-none transition-colors duration-200 text-gray-800
          "
        />
      </div>

      {/* Parent/Guardian Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Parent/Guardian Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Email
            </label>
            <input
              type="email"
              value={data.parentEmail || ''}
              onChange={(e) => onUpdate({ parentEmail: e.target.value })}
              placeholder="parent@example.com"
              className="
                w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 
                focus:outline-none transition-colors duration-200 text-gray-800
              "
            />
          </div>

          {/* Parent Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Phone
            </label>
            <input
              type="tel"
              value={data.parentPhone || ''}
              onChange={(e) => onUpdate({ parentPhone: e.target.value })}
              placeholder="Parent's phone number"
              className="
                w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 
                focus:outline-none transition-colors duration-200 text-gray-800
              "
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          <strong>Privacy:</strong> All contact information is encrypted and stored securely. 
          We only use this information for account security, progress updates, and emergency 
          communications. You can update or remove this information anytime from your profile.
        </p>
      </div>
    </div>
  );
};