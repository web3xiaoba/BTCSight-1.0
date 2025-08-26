import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { realApiClient } from '../services/realApi';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useApiData } from '../hooks/useApi';

export const ApiStatus: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { apiStatus } = useApiData();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [isRealApiEnabled] = useState(import.meta.env.VITE_USE_REAL_API === 'true');

  const checkApiStatus = async () => {
    try {
      if (isRealApiEnabled) {
        console.log('🔍 检查真实API状态...');
        const workingApi = await realApiClient.findWorkingApi();
        console.log(workingApi ? `✅ API在线 (${workingApi.name})` : '❌ API离线');
      } else {
        console.log('🎭 演示模式');
      }
    } catch {
      console.warn('⚠️ API检查失败');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
    
    // 每30秒检查一次API状态
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    if (!isRealApiEnabled) {
      return {
        icon: <Zap className="w-4 h-4" />,
        text: '演示模式',
        color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
      };
    }

    switch (apiStatus) {
      case 'online':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'API在线',
          color: theme === 'dark' ? 'text-green-400' : 'text-green-600',
          bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: '使用演示数据',
          color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
          bg: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
        };
      default:
        return {
          icon: <Wifi className="w-4 h-4 animate-pulse" />,
          text: '检查API...',
          color: theme === 'dark' ? 'text-white/60' : 'text-gray-600',
          bg: theme === 'dark' ? 'bg-white/10' : 'bg-gray-100',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${config.bg} ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};