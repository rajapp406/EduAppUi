'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  size = 'md',
  showLabel = false,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const progressBarClasses = `${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out`;

  return (
    <div className="w-full">
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        {!isClient ? (
          <div
            className={progressBarClasses}
            style={{ width: `${progress}%` }}
          />
        ) : (
          <motion.div
            className={progressBarClasses}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;