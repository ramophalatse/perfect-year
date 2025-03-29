import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  featured?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  interactive = false,
  featured = false,
}: CardProps) {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200';
  
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1'
    : '';
  
  const featuredClasses = featured
    ? 'border-t-4 border-t-primary dark:border-t-primary-light'
    : '';
    
  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${featuredClasses} ${className}`}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
} 