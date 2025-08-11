import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const SimpleButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
});

SimpleButton.displayName = 'SimpleButton';

export default SimpleButton;