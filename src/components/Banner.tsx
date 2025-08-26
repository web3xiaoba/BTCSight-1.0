import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

interface BannerProps {
  coveragePct: number;
  updatedAt: string;
  apiStatus: 'online' | 'offline' | 'checking';
  reconnectCountdown?: number;
}

export const Banner: React.FC<BannerProps> = ({ 
  coveragePct, 
  updatedAt, 
  apiStatus,
  reconnectCountdown
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isRealApiEnabled] = React.useState(import.meta.env.VITE_USE_REAL_API === 'true');

  // 添加调试日志
  React.useEffect(() => {
    console.log('🎯 Banner: reconnectCountdown prop 变化:', reconnectCountdown, '类型:', typeof reconnectCountdown);
    console.log('🎯 Banner: 当前渲染状态 - apiStatus:', apiStatus, 'isRealApiEnabled:', isRealApiEnabled);
  }, [reconnectCountdown]);

  // 添加强制重新渲染的调试
  const [renderCount, setRenderCount] = React.useState(0);
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🎯 Banner: 组件重新渲染次数:', renderCount + 1);
  }, [reconnectCountdown, apiStatus]);

  // 根据API状态显示不同的横幅
  if (!isRealApiEnabled || apiStatus === 'offline') {
    return (
      <div className={`border rounded-2xl p-4 ${
        theme === 'dark'
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50/80 border-blue-200/60 shadow-sm backdrop-blur-sm'
      }`}>
        <div className="flex items-center gap-3">
          <Database className={`w-5 h-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div className={`${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'} text-sm`}>
            {!isRealApiEnabled 
              ? '演示模式：展示完整功能，所有数据为模拟数据'
              : apiStatus === 'offline'
                ? 'API连接中断，当前显示演示数据'
                : 'API检查中...'
            }
          </div>
          {apiStatus === 'offline' && isRealApiEnabled && (
            <div className={`text-xs ${theme === 'dark' ? 'text-blue-300/70' : 'text-blue-600/70'}`}>
              系统正在自动尝试重新连接API，请稍后……
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-4 border ${
      theme === 'dark'
        ? 'bg-gradient-to-r from-[#0e1116] to-[#1a1f2e] border-white/10'
        : 'bg-gradient-to-r from-white/80 to-slate-50/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className={`w-5 h-5 ${
              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
            }`} />
            <span className={`font-medium ${
              theme === 'dark' ? 'text-white/90' : 'text-gray-900'
            }`}>{t('coverage')}: {coveragePct}%</span>
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>
            {t('lastUpdated')}: {updatedAt}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'dark'
              ? (apiStatus === 'online' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300')
              : (apiStatus === 'online' ? 'bg-green-100/80 text-green-700 shadow-sm' : 'bg-blue-100/80 text-blue-700 shadow-sm')
          }`}>
            {apiStatus === 'online' ? '真实数据' : '演示数据'}
          </span>
          <a
            className="px-3 py-2 text-sm rounded-xl bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white hover:opacity-90 transition-opacity"
            href="https://dashboard.internetcomputer.org/bitcoin"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('viewOnChain')}
          </a>
        </div>
      </div>
      
      {coveragePct < 90 && (
        <div className={`mt-3 border rounded-lg p-3 ${
          theme === 'dark'
            ? 'bg-yellow-500/10 border-yellow-500/20'
            : 'bg-amber-50/80 border-amber-200/60 shadow-sm backdrop-blur-sm'
        }`}>
          <div className={`flex items-center gap-2 text-sm ${
            theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            <span>{t('unknown')}: {100 - coveragePct}%</span>
          </div>
        </div>
      )}
    </div>
  );
};