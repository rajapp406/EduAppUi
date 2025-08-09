import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { OnboardingState, OnboardingData, UserProfile } from '../../models/user';
import { OnboardingStorage } from '../../utils/onboardingStorage';

// Load initial state from localStorage if available
const loadInitialState = (): OnboardingState => {
  // Only access localStorage on client side
  if (typeof window === 'undefined') {
    return {
      isLoading: false,
      error: null,
      currentStep: 1,
      totalSteps: 4,
      data: {}
    };
  }

  try {
    const savedData = OnboardingStorage.getData();
    const savedStep = OnboardingStorage.getCurrentStep();
    
    return {
      isLoading: false,
      error: null,
      currentStep: savedStep,
      totalSteps: 4,
      data: savedData
    };
  } catch (error) {
    console.error('Error loading onboarding state from localStorage:', error);
    return {
      isLoading: false,
      error: null,
      currentStep: 1,
      totalSteps: 4,
      data: {}
    };
  }
};

const initialState: OnboardingState = loadInitialState();

// Async thunk to submit onboarding data
export const submitOnboardingAsync = createAsyncThunk(
  'onboarding/submit',
  async (data: OnboardingData, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get user ID from auth state
      const state = getState() as any;
      let userId = state.auth.user?.id;
      // leave it for now
      console.log("data", data);
      userId = "0016e789-b406-46a5-bf04-0cca30fea38e";
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Use the real API service
      const { OnboardingApiService } = await import('../../services/onboardingApi');
      const result = await OnboardingApiService.submitOnboarding(data, userId);
      
      // Update auth state to mark onboarding as complete
      const { completeOnboarding } = await import('./authSlice');
      dispatch(completeOnboarding());
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        OnboardingStorage.saveCurrentStep(action.payload);
      }
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
        // Save to localStorage
        if (typeof window !== 'undefined') {
          OnboardingStorage.saveCurrentStep(state.currentStep);
        }
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        // Save to localStorage
        if (typeof window !== 'undefined') {
          OnboardingStorage.saveCurrentStep(state.currentStep);
        }
      }
    },
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      console.log("updateOnboardingData", action.payload);
      state.data = { ...state.data, ...action.payload };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        OnboardingStorage.saveData(action.payload);
      }
    },
    resetOnboarding: (state) => {
      state.currentStep = 1;
      state.data = {};
      state.error = null;
      state.isLoading = false;
      // Clear localStorage
      if (typeof window !== 'undefined') {
        OnboardingStorage.clearData();
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log("setError", action.payload);
      state.error = action.payload;
    },
    // New action to load data from localStorage
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedData = OnboardingStorage.getData();
        const savedStep = OnboardingStorage.getCurrentStep();
        state.data = savedData;
        state.currentStep = savedStep;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOnboardingAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Reset onboarding state after successful submission
        state.currentStep = 1;
        state.data = {};
        // Clear localStorage after successful submission
        if (typeof window !== 'undefined') {
          OnboardingStorage.clearData();
        }
      })
      .addCase(submitOnboardingAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateOnboardingData, 
  resetOnboarding,
  setError,
  loadFromStorage
} = onboardingSlice.actions;

export default onboardingSlice.reducer;