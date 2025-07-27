import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { GraduationCap, User, LogOut, Coins } from 'lucide-react';
import Button from '../ui/Button';
import LoginModal from '../Auth/LoginModal';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }));
  const { totalCredits = 0, usedCredits = 0 } = useSelector((state: RootState) => state.credits);
  const remainingCredits = totalCredits - usedCredits;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {remainingCredits} credits
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    {user.provider && (
                      <span className="text-xs text-gray-500 capitalize">
                        via {user.provider}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setShowLoginModal(true)}
                className="ml-4"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;