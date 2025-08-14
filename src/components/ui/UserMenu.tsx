'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Bell,
  HelpCircle,
  Shield,
  CreditCard
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface UserMenuProps {
  onLogout?: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    setShowSettings(false);
    router.push(path);
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

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => handleNavigation('/profile'),
      description: 'Manage your account'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => handleNavigation('/notifications'),
      description: 'View your notifications',
      badge: 3
    },
    {
      icon: CreditCard,
      label: 'Billing',
      action: () => handleNavigation('/billing'),
      description: 'Manage subscription'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => handleNavigation('/help'),
      description: 'Get help and support'
    },
    {
      icon: Shield,
      label: 'Privacy',
      action: () => handleNavigation('/privacy'),
      description: 'Privacy settings'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {getUserInitials()}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-foreground">
            {user?.name || 'User'}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email || 'user@example.com'}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-theme-lg z-50">
          {!showSettings ? (
            <>
              {/* User Info Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {user?.name || 'User Name'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email || 'user@example.com'}
                    </div>
                    <div className="text-xs text-primary mt-1">
                      Free Plan
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      Settings
                    </div>
                    <div className="text-xs text-muted-foreground">
                      App preferences and theme
                    </div>
                  </div>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
            </>
          ) : (
            /* Settings Panel */
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-accent rounded"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <h3 className="text-lg font-semibold text-foreground">Settings</h3>
              </div>

              <div className="space-y-4">
                {/* Theme Settings */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Theme
                  </label>
                  <ThemeToggle />
                </div>

                {/* Notifications */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border text-primary focus:ring-ring"
                      />
                      <span className="text-sm text-foreground">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border text-primary focus:ring-ring"
                      />
                      <span className="text-sm text-foreground">Push notifications</span>
                    </label>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Language
                  </label>
                  <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                {/* Auto-save */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-border text-primary focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">Auto-save progress</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserMenu;