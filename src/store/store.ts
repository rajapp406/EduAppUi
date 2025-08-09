import { configureStore, combineReducers, AnyAction, ThunkDispatch, Action } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { subjectApi } from '@/services/subjectApi';
import authSlice from './slices/authSlice';
import quizSlice from './slices/quiz/quizSlice';
import lessonSlice from './slices/lessonSlice';
import creditSlice from './slices/creditSlice';
import subjectSlice from './slices/subjectSlice';
import chapterSlice from './slices/chapter/chapterSlice';
import questionSlice from './slices/questionSlice';
import onboardingSlice from './slices/onboardingSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  quiz: quizSlice,
  lessons: lessonSlice,
  credits: creditSlice,
  subjects: subjectSlice,
  chapters: chapterSlice,
  questions: questionSlice,
  onboarding: onboardingSlice,
  [subjectApi.reducerPath]: subjectApi.reducer
});

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// Create a reducer with hydration handling
const reducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    } as RootState;
    
    // Preserve client-side state for certain slices if needed
    if (state?.auth) {
      nextState.auth = state.auth;
    }
    
    return nextState;
  }
  return rootReducer(state, action) as RootState;
};

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Create the store with the persisted reducer
const makeStore = () => {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: return a simple store without persistence
    return configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production',
    });
  }
  
  // Client-side: create store with persistence
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(subjectApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Initialize the store with the persisted state
  const persistor = persistStore(store);

  return { ...store, persistor };
};

// Export the store types
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = RootState;
export type AppDispatch = AppStore['dispatch'] & ThunkDispatch<RootState, unknown, AnyAction>;

// Export hooks that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Create the wrapper with debug mode in development
export const wrapper = createWrapper<AppStore>(makeStore, { 
  debug: process.env.NODE_ENV !== 'production',
});

// Create the store instance for direct imports
export const store = makeStore();

export default store;