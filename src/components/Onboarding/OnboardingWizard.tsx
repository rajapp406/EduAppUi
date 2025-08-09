"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  nextStep,
  previousStep,
  updateOnboardingData,
  submitOnboardingAsync,
  resetOnboarding,
  loadFromStorage,
} from "@/store/slices/onboardingSlice";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AcademicInfoStep } from "./steps/AcademicInfoStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { InterestsStep } from "./steps/InterestsStep";
import { ProgressBar } from "./ProgressBar";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { OnboardingData } from "@/models/user";
import { OnboardingStorage } from "@/utils/onboardingStorage";

export const OnboardingWizard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentStep, totalSteps, data, isLoading, error } = useAppSelector(
    (state) => state.onboarding
  );

  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  const [hasRestoredData, setHasRestoredData] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const hasExistingData = OnboardingStorage.hasData();
    if (hasExistingData) {
      setHasRestoredData(true);
      // Hide the notification after 3 seconds
      setTimeout(() => setHasRestoredData(false), 3000);
    }
    dispatch(loadFromStorage());
  }, [dispatch]);

  const validateStep = (step: number): boolean => {
    const errors: Record<number, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!data.grade) errors[1] = "Please select your grade";
        else if (!data.board) errors[1] = "Please select your board";
        break;
      case 2: // Academic Info
      console.log("data", data);
        if (!data.schoolId?.trim()) errors[2] = "Please enter your school name sds";
        else if (!data.cityId?.trim()) errors[2] = "Please select your city sdsd";
        break;
      case 3: // Contact Info (optional step)
        // All fields are optional in this step
        break;
      case 4: // Interests (optional step)
        // All fields are optional in this step
        break;
    }

    setStepErrors(errors);
    return !errors[step];
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        dispatch(nextStep());
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    dispatch(previousStep());
    setStepErrors({});
  };

  const handleSubmit = async () => {
    try {
      console.log("Final onboarding data before submission:", data);
      await dispatch(submitOnboardingAsync(data as OnboardingData)).unwrap();
      // On successful submission, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding submission failed:", error);
      // Error will be displayed via the error state from Redux
    }
  };

  const handleStepUpdate = (stepData: Partial<OnboardingData>) => {
    console.log(`Step ${currentStep} data update:`, stepData);
    dispatch(updateOnboardingData(stepData));
    // Clear errors for current step when data is updated
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={data}
            onUpdate={handleStepUpdate}
            error={stepErrors[1]}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            data={data}
            onUpdate={handleStepUpdate}
            error={stepErrors[2]}
          />
        );
      case 3:
        return (
          <ContactInfoStep
            data={data}
            onUpdate={handleStepUpdate}
            error={stepErrors[3]}
          />
        );
      case 4:
        return (
          <InterestsStep
            data={data}
            onUpdate={handleStepUpdate}
            error={stepErrors[4]}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Academic Details";
      case 3:
        return "Contact Information";
      case 4:
        return "Your Interests";
      default:
        return "";
    }
  };

  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {/* Restored Data Notification */}
      {hasRestoredData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm font-medium">
              Your progress has been restored! You can continue from where you left off.
            </p>
          </div>
        </div>
      )}

      {/* Step Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getStepTitle()}
        </h2>
        <p className="text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <div className="flex justify-between items-start mb-2">
            <strong>Debug - Current Data:</strong>
            <button
              onClick={() => {
                dispatch(resetOnboarding());
                setHasRestoredData(false);
              }}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Clear Progress
            </button>
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div className="mt-2 text-xs text-gray-600">
            <strong>Data Summary:</strong> {JSON.stringify(OnboardingStorage.getDataSummary(), null, 2)}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isLoading}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${
              currentStep === 1 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-0.5"
            }
          `}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          {currentStep > 2 && <span>Optional steps - you can skip these</span>}
        </div>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="
            flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 
            hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 
            disabled:cursor-not-allowed disabled:hover:transform-none
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isLastStep ? "Completing..." : "Processing..."}
            </>
          ) : isLastStep ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Complete Setup
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Skip Option for Optional Steps */}
      {currentStep > 2 && !isLastStep && (
        <div className="text-center mt-4">
          <button
            onClick={() => dispatch(nextStep())}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip this step
          </button>
        </div>
      )}
    </div>
  );
};
