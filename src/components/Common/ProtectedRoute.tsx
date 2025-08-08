import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
  children,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Mark initialization as complete after first render
    setIsInitialized(true);
  }, []);

  // Don't render anything until after first render to avoid hydration mismatches
  if (!isInitialized) {
    return null;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated and not on the login page, redirect to login
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  // If we have children, render them, otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, redirect to the home page or the page they were trying to access
  if (isAuthenticated) {
    return <Navigate to='lessons' replace />;
  }

  // If not authenticated, render the public content
  return <>{children}</>;
};