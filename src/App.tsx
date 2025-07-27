import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { RootState } from './store/store';
import { checkAuth } from './store/slices/authSlice';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import { ProtectedRoute, PublicRoute } from './components/Common/ProtectedRoute';
import QuizList from './components/Quiz/QuizList';
import QuizTaking from './components/Quiz/QuizTaking';

// Wrapper component to handle auth initialization
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check authentication status when the app loads
    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    initAuth();
  }, [dispatch]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// Define types for Vite environment variables
interface ImportMetaEnv {
  VITE_GOOGLE_CLIENT_ID: string;
}

const AppContent: React.FC = () => {
  return (
    <Router>
      <AuthInitializer>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
                      {/* Login form or content will go here */}
                    </div>
                  </div>
                </PublicRoute>
              } />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<QuizList onStartQuiz={()=>{}}/>} />
                <Route path="/lessons" element={<div>Lessons Page</div>} />
                <Route path="/progress" element={<div>Progress Page</div>} />
                <Route path="/start-quiz/:quizId" element={<QuizTaking onQuizComplete={() => <Navigate to="/dashboard"/>}/>}/>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthInitializer>
    </Router>
  );
};

const App: React.FC = () => {
  // Get Google Client ID from Vite environment variables
 const YOUR_GOOGLE_CLIENT_ID = "135905102569-1raritt3b47q7hdkinrr9q5p84mev4ll.apps.googleusercontent.com"
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || YOUR_GOOGLE_CLIENT_ID;
  console.log(googleClientId);
  if (!googleClientId) {
    console.error('VITE_GOOGLE_CLIENT_ID is not properly configured');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">Google OAuth client ID is not properly configured.</p>
          <p className="text-sm text-gray-500">Please set VITE_GOOGLE_CLIENT_ID in your environment variables.</p>
        </div>
      </div>
    );  }

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppContent />
      </GoogleOAuthProvider>
    </Provider>
  );
};

export default App;