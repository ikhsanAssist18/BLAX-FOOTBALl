import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };
  
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
}