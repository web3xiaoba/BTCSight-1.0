import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Crown, Star, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  totalVolume: number;
  totalTransactions: number;
  joinDate: string;
  status: 'active' | 'vip' | 'premium';
  avatar?: string;
}

export const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { unit } = useCurrency();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('30d');

  // 生成模拟排行榜数据
  useEffect(() => {
    const generateUsers = (): LeaderboardUser[] => {
      const usernames = [
        'BitcoinWhale', 'CryptoKing', 'DiamondHands', 'MoonLambo', 'HODLer2024',
        'SatoshiFan', 'BlockchainPro', 'CryptoNinja', 'BTCMaster', 'DigitalGold',
        'CoinCollector', 'TradingBot', 'CryptoSage', 'BitMiner', 'ChainLink',
        'TokenHunter', 'CryptoGuru', 'BitBull', 'CoinWizard', 'BlockMaster'
      ];
      
      return usernames.map((username, index) => ({
        rank: index + 1,
        userId: `user_${String(index + 1).padStart(3, '0')}`,
        username,
        totalVolume: Math.random() * 1000 + 50,
        totalTransactions: Math.floor(Math.random() * 500) + 10,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: index < 3 ? 'premium' : index < 10 ? 'vip' : 'active'
      }));
    };

    setUsers(generateUsers());
  }, [timeRange]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>#{rank}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      premium: { color: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'Premium', icon: <Star className="w-3 h-3" /> },
      vip: { color: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'VIP', icon: <Zap className="w-3 h-3" /> },
      active: { color: theme === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700', text: 'Active', icon: null }
    };
    
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const formatVolume = (volume: number) => {
    if (unit === 'USD') {
      return '$' + (volume * 61500).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return volume.toFixed(4) + ' BTC';
  };

  return (
    <div className={`border rounded-2xl p-6 ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-[#F0B90B] to-[#F8D12F] ${
            theme === 'dark' ? 'shadow-lg shadow-[#F0B90B]/20' : 'shadow-md shadow-[#F0B90B]/30'
          }`}></div>
          <h2 className={`text-2xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>用户排行榜</h2>
          <div className={`flex-1 h-px ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-white/20 to-transparent' 
              : 'bg-gradient-to-r from-gray-300 to-transparent'
          }`}></div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                  : theme === 'dark'
                    ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                    : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? '全部' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.slice(0, 10).map((user) => (
          <div key={user.userId} className={`border rounded-xl p-4 transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(user.rank)}
                </div>
                
                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{user.username}</span>
                    {getStatusBadge(user.status)}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                  }`}>
                    {user.totalTransactions} 笔交易 · 加入于 {user.joinDate}
                  </div>
                </div>
              </div>
              
              {/* Volume */}
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatVolume(user.totalVolume)}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                }`}>
                  总交易量
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className={`mt-6 p-4 rounded-xl border ${
        theme === 'dark'
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50/80 border-blue-200/60 shadow-sm backdrop-blur-sm'
      }`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {users.length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
            }`}>
              活跃用户
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {users.reduce((sum, user) => sum + user.totalTransactions, 0).toLocaleString()}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
            }`}>
              总交易数
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {formatVolume(users.reduce((sum, user) => sum + user.totalVolume, 0))}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
            }`}>
              总交易量
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};