import React from 'react';
import { Play, Pause, Zap } from 'lucide-react';
import { useRealTimeData, useApiData } from '../hooks/useApi';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export const RealTimeToggle: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isRealTimeEnabled, setIsRealTimeEnabled } = useRealTimeData();
  const { apiStatus } = useApiData();
  const [isRealApiEnabled] = React.useState(import.meta.env.VITE_USE_REAL_API === 'true');

  const getButtonText = () => {
    if (!isRealApiEnabled) {
      return isRealTimeEnabled ? '演示中' : '演示';
    }
    
    if (apiStatus === 'online') {
      return isRealTimeEnabled ? '实时中' : '实时';
    }
    
    return isRealTimeEnabled ? '演示中' : '演示';
  };

  return (
    <button
      onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-200 ${
        isRealTimeEnabled
          ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white border-transparent'
          : theme === 'dark'
            ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
            : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white shadow-sm hover:shadow-md'
      }`}
      title={isRealTimeEnabled ? '停止自动更新' : '开启自动更新'}
    >
      {isRealTimeEnabled ? (
        <>
          <Pause className="w-4 h-4" />
          <span className="hidden sm:inline">{getButtonText()}</span>
          <Zap className="w-3 h-3 animate-pulse" />
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">{getButtonText()}</span>
        </>
      )}
    </button>
  );
};