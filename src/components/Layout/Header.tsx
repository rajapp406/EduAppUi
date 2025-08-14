'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { GraduationCap, Coins } from 'lucide-react';
import Button from '../ui/Button';
import LoginModal from '../Auth/LoginModal';
import Link from 'next/link';
import { UserMenu } from '../ui/UserMenu';
import { MobileMenu } from '../ui/MobileMenu';
import { SimpleThemeToggle } from '../ui/ThemeToggle';

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
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-theme-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  EduApp
                </Link>
              </h1>
            </div>

            {/* Navigation Links - Desktop Only */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link
                  href="/subjects"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                >
                  Subjects
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link
                  href="/quiz"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                >
                  Quiz
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link
                  href="/olympiad"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                >
                  Olympiad
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </nav>
            )}

            {/* Right Side Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* Credits Display - Desktop Only */}
                  <div className="hidden sm:flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {remainingCredits} credits
                    </span>
                  </div>

                  {/* Desktop Theme Toggle */}
                  <div className="hidden md:block">
                    <SimpleThemeToggle />
                  </div>
                  
                  {/* Desktop User Menu */}
                  <div className="hidden md:block">
                    <UserMenu onLogout={handleLogout} />
                  </div>
                  
                  {/* Mobile Menu */}
                  <MobileMenu onLogout={handleLogout} />
                </>
              ) : (
                <>
                  {/* Desktop Auth Buttons */}
                  <div className="hidden md:flex items-center space-x-2">
                    <SimpleThemeToggle />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Sign Up
                    </Button>
                  </div>
                  
                  {/* Mobile Menu for non-authenticated users */}
                  <MobileMenu onLogout={handleLogout} />
                </>
              )}
            </div>
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