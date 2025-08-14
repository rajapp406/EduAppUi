'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  Menu, 
  X, 
  Home,
  BookOpen,
  Brain,
  Trophy,
  User,
  Settings,
  LogOut,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SimpleThemeToggle } from './ThemeToggle';

interface MobileMenuProps {
  onLogout?: () => void;
}

export function MobileMenu({ onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { actualTheme } = useTheme();
  const router = useRouter();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: BookOpen,
      label: 'Subjects',
      path: '/subjects'
    },
    {
      icon: Brain,
      label: 'Quiz',
      path: '/quiz'
    },
    {
      icon: Trophy,
      label: 'Olympiad',
      path: '/olympiad'
    }
  ];

  const userMenuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile'
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
      badge: 3
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      path: '/help'
    }
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card border-l border-border
        transform transition-transform duration-300 ease-in-out z-50 md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Free Plan
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation Items */}
          {isAuthenticated && (
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </h3>
              </div>
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* User Menu Items */}
          {isAuthenticated && (
            <div className="py-2 border-t border-border">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
              </div>
              {userMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Theme Toggle */}
          <div className="py-2 border-t border-border">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Appearance
              </h3>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <SimpleThemeToggle />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-border">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-4 text-left hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            ) : (
              <div className="p-4 space-y-2">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full border border-border text-foreground py-2 px-4 rounded-lg font-medium text-sm hover:bg-accent transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;