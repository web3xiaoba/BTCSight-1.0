import React from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Droplets, Users, DollarSign, Coins, BarChart3, Activity, Hash, Zap } from 'lucide-react';
import { UnknownDataModal } from './UnknownDataModal';
import { Summary } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../hooks/useTheme';

interface KPIGridProps {
  summary: Summary;
  loading?: boolean;
  onRefresh?: () => void;
  onScrollToAddresses?: () => void;
}

const KPICard: React.FC<{
  title: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  tooltip?: string;
  theme: 'dark' | 'light';
}> = ({ title, value, suffix, icon, onClick, clickable = false, tooltip, theme }) => (
  <div className={`border rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] ${
    theme === 'dark'
      ? 'bg-[#0e1116] border-white/10'
      : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <span className={`text-sm ${
        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
      }`}>{title}</span>
      <div className={`relative ${clickable ? 'cursor-pointer' : ''} transition-all duration-200 ${
        clickable ? 'hover:scale-110' : ''
      }`} onClick={onClick} title={tooltip}>
        {icon}
        {clickable && (
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse ${
            theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
        )}
      </div>
    </div>
    <div className={`text-2xl font-bold tracking-tight ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>
      {value}
      {suffix && <span className={`text-lg ml-1 font-medium ${
        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
      }`}>{suffix}</span>}
    </div>
  </div>
);

const SkeletonCard: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => (
  <div className={`border rounded-2xl h-24 animate-pulse ${
    theme === 'dark'
      ? 'bg-[#0e1116] border-white/10'
      : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
  }`}></div>
);

export const KPIGrid: React.FC<KPIGridProps> = ({ summary, loading, onRefresh, onScrollToAddresses }) => {
  const { t } = useTranslation();
  const { unit } = useCurrency();
  const { theme } = useTheme();
  const [showUnknownModal, setShowUnknownModal] = React.useState(false);
  const [realtimeData, setRealtimeData] = React.useState({
    totalUsers: 234567,
    totalMarketCap: unit === 'BTC' ? 45892.34 : 2821456789,
    totalLiquidity: unit === 'BTC' ? 15247.89 : 936543210,
    totalTokens: 8934567,
    totalFees: unit === 'BTC' ? 124.56 : 7650432,
    totalTransactions: 1234567,
    totalVolume: unit === 'BTC' ? 98765.43 : 6071234567,
  });
  
  // BTC to USD conversion rate (example: 1 BTC = $61,500)
  const btcToUsd = 61500;

  // 实时更新数据
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 20) - 5, // 用户数缓慢增长
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 100) - 50,
        totalMarketCap: unit === 'BTC' 
          ? prev.totalMarketCap + (Math.random() - 0.5) * 100
          : prev.totalMarketCap + (Math.random() - 0.5) * 1000000,
        totalLiquidity: unit === 'BTC'
          ? prev.totalLiquidity + (Math.random() - 0.5) * 50
          : prev.totalLiquidity + (Math.random() - 0.5) * 500000,
        totalFees: unit === 'BTC'
          ? prev.totalFees + (Math.random() - 0.5) * 5
          : prev.totalFees + (Math.random() - 0.5) * 50000,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50) - 20,
        totalVolume: unit === 'BTC'
          ? prev.totalVolume + (Math.random() - 0.5) * 200
          : prev.totalVolume + (Math.random() - 0.5) * 2000000,
      }));
    }, 3000); // 每3秒更新一次

    return () => clearInterval(interval);
  }, [unit]);

  // 单位切换时重新计算数据
  React.useEffect(() => {
    setRealtimeData(prev => ({
      ...prev,
      totalUsers: 234567, // 用户数不受单位影响
      totalMarketCap: unit === 'BTC' ? 45892.34 : 2821456789,
      totalLiquidity: unit === 'BTC' ? 15247.89 : 936543210,
      totalFees: unit === 'BTC' ? 124.56 : 7650432,
      totalTransactions: 1234567,
      totalVolume: unit === 'BTC' ? 98765.43 : 6071234567,
    }));
  }, [unit]);

  const handleCoverageClick = () => {
    if (onScrollToAddresses) {
      onScrollToAddresses();
    }
  };

  const handleUnknownClick = () => {
    setShowUnknownModal(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} theme={theme} />
        ))}
      </div>
    );
  }

  const totalValue = unit === 'BTC' 
    ? summary.total_btc.toFixed(4) 
    : Math.round(summary.total_usd).toLocaleString();

  // 格式化实时数据
  const formatNumber = (num: number, decimals: number = 0) => {
    return decimals > 0 ? num.toFixed(decimals) : Math.round(num).toLocaleString();
  };

  const totalUsers = formatNumber(realtimeData.totalUsers);
  const totalTokens = formatNumber(realtimeData.totalTokens);
  const totalMarketCap = formatNumber(realtimeData.totalMarketCap, unit === 'BTC' ? 2 : 0);
  const totalLiquidity = formatNumber(realtimeData.totalLiquidity, unit === 'BTC' ? 2 : 0);
  const totalFees = formatNumber(realtimeData.totalFees, unit === 'BTC' ? 2 : 0);
  const totalTransactions = formatNumber(realtimeData.totalTransactions);
  const totalVolume = formatNumber(realtimeData.totalVolume, unit === 'BTC' ? 2 : 0);

  const getNetFlowTooltip = (period: string, value: string) => {
    const direction = parseFloat(value.replace(/,/g, '')) >= 0 ? t('inflow') : t('outflow');
    return `${period} ${direction}: ${value} ${unit}`;
  };

  // 根据净流值选择图标
  const getNetFlowIcon = (value: number, is24h: boolean = false) => {
    const iconClass = "w-4 h-4";
    
    if (value >= 0) {
      return is24h ? (
        <div className="relative">
          <ArrowUpRight className={`${iconClass} text-green-500`} />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <TrendingUp className={`${iconClass} text-emerald-500`} />
      );
    } else {
      return is24h ? (
        <div className="relative">
          <ArrowDownRight className={`${iconClass} text-red-500`} />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <TrendingDown className={`${iconClass} text-orange-500`} />
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* 第一行：包含总存量的指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KPICard
          title={t('totalReserve')}
          value={totalValue}
          suffix={unit}
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          tooltip={`${t('totalReserve')}: ${totalValue} ${unit}`}
          theme={theme}
        />
        
        <KPICard
          title="总交易数"
          value={totalTransactions}
          suffix="笔"
          icon={<Hash className="w-6 h-6 text-blue-500" />}
          tooltip={`总交易数: ${totalTransactions} 笔`}
          theme={theme}
        />
        
        <KPICard
          title="总交易量"
          value={totalVolume}
          suffix={unit}
          icon={<Zap className="w-6 h-6 text-purple-500" />}
          tooltip={`总交易量: ${totalVolume} ${unit}`}
          theme={theme}
        />
        
        <KPICard
          title="总代币数"
          value={totalTokens}
          suffix=""
          icon={<Coins className="w-6 h-6 text-amber-500" />}
          tooltip={`总代币数: ${totalTokens}`}
          theme={theme}
        />
      </div>
      
      {/* 第二行：其他指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KPICard
          title="总市值"
          value={totalMarketCap}
          suffix={unit}
          icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
          tooltip={`总市值: ${totalMarketCap} ${unit}`}
          theme={theme}
        />
        
        <KPICard
          title="总用户数"
          value={totalUsers}
          suffix=""
          icon={<Users className="w-6 h-6 text-purple-500" />}
          tooltip={`总用户数: ${totalUsers}`}
          theme={theme}
        />
        
        <KPICard
          title="总流动性"
          value={totalLiquidity}
          suffix={unit}
          icon={<Droplets className="w-6 h-6 text-cyan-500" />}
          tooltip={`总流动性: ${totalLiquidity} ${unit}`}
          theme={theme}
        />
        
        <KPICard
          title="总手续费"
          value={totalFees}
          suffix={unit}
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          tooltip={`总手续费: ${totalFees} ${unit}`}
          theme={theme}
        />
      </div>
      
      <UnknownDataModal
        isOpen={showUnknownModal}
        onClose={() => setShowUnknownModal(false)}
        unknownPct={summary.unknown_pct}
      />
    </div>
  );
};