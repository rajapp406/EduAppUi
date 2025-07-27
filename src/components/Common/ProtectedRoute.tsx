import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/',
  children,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Only redirect if we're not already on the login page to prevent loops
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    return null;
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
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the public content
  return <>{children}</>;
};