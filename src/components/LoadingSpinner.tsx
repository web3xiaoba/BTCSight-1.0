import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  fullScreen = false 
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className={`w-full h-full border-2 border-transparent rounded-full ${
          theme === 'dark' 
            ? 'border-t-white/60 border-r-white/60' 
            : 'border-t-gray-600 border-r-gray-600'
        }`}></div>
      </div>
      {text && (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${
        theme === 'dark' ? 'bg-[#0a0f16]' : 'bg-white'
      }`}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

// 骨架屏组件
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`animate-pulse ${
      theme === 'dark'
        ? 'bg-white/6 border-white/10'
        : 'bg-slate-100/60 border-slate-200/60'
    } border rounded-2xl ${className}`}>
      <div className="p-4 space-y-3">
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
        } w-1/3`}></div>
        <div className={`h-8 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
        } w-2/3`}></div>
      </div>
    </div>
  );
};

// 表格骨架屏
export const SkeletonTable: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          <div className={`h-4 rounded flex-1 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
          }`}></div>
          <div className={`h-4 rounded w-20 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
          }`}></div>
          <div className={`h-4 rounded w-32 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
          }`}></div>
        </div>
      ))}
    </div>
  );
};