'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cardClasses = `bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200' : ''} ${className}`;

  // Render regular div on server-side
  if (!isClient) {
    return (
      <div className={cardClasses} onClick={onClick}>
        {children}
      </div>
    );
  }

  // Render motion div on client-side
  return (
    <motion.div
      className={cardClasses}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;