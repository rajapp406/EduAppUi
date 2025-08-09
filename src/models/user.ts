import { Board } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade?: number;
  board?: Board;
  schoolId?: string;
  cityId?: string;
  cityName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  parentEmail?: string;
  parentPhone?: string;
  interests?: string[];
  isOnboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  grade: number;
  board: Board;
  schoolId: string;
  cityId: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  parentEmail?: string;
  parentPhone?: string;
  interests?: string[];
}

export interface City {
  id: string;
  name: string;
  stateId: string;
}

export interface OnboardingApiPayload {
  userId: string;
  userType: 'STUDENT' | 'TEACHER';
  schoolId?: string;
  cityId: string;
  grade: number;
  board: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  parentEmail?: string;
  parentPhone?: string;
  interests?: string[];
}

export interface OnboardingState {
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
  data: Partial<OnboardingData>;
}

// Common options for dropdowns

export const SUBJECT_INTERESTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Studies', 'History', 'Geography',
  'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
  'Political Science', 'Psychology', 'Philosophy', 'Art', 'Music'
];

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];