'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useAuthentication } from '@/hooks/authHook';
import { OnboardingWizard } from '@/components/Onboarding/OnboardingWizard';
import { OnboardingStorage } from '@/utils/onboardingStorage';
import { Loader2, RefreshCw } from 'lucide-react';
import LoginModal from '@/components/Auth/LoginModal';

export default function OnboardingPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthentication();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dataSummary, setDataSummary] = useState<any>(null);

  useEffect(() => {
    // If user is already onboarded, redirect to dashboard
    if (isAuthenticated && user && user.isOnboardingComplete) {
      router.push('/dashboard');
    }

    // Load data summary for progress indication
    if (typeof window !== 'undefined') {
      setDataSummary(OnboardingStorage.getDataSummary());
    }
  }, [isAuthenticated, user, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome to EduApp! 🎓
            </h1>
            <p className="text-lg text-gray-600">
              Let's set up your learning profile to personalize your experience
            </p>
            
            {/* Progress Summary */}
            {dataSummary && (dataSummary.hasBasicInfo || dataSummary.hasAcademicInfo || dataSummary.hasContactInfo || dataSummary.hasInterests) && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">
                    Continuing your setup...
                  </span>
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <span className={`px-2 py-1 rounded ${dataSummary.hasBasicInfo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    Basic Info {dataSummary.hasBasicInfo ? '✓' : '○'}
                  </span>
                  <span className={`px-2 py-1 rounded ${dataSummary.hasAcademicInfo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    Academic {dataSummary.hasAcademicInfo ? '✓' : '○'}
                  </span>
                  <span className={`px-2 py-1 rounded ${dataSummary.hasContactInfo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    Contact {dataSummary.hasContactInfo ? '✓' : '○'}
                  </span>
                  <span className={`px-2 py-1 rounded ${dataSummary.hasInterests ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    Interests {dataSummary.hasInterests ? '✓' : '○'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Onboarding Wizard */}
          <OnboardingWizard />
        </div>
      </div>
    </div>
  );
}