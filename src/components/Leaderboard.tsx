import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Crown, Star, Zap, ArrowUpRight, ArrowDownLeft, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  totalVolume?: number;
  totalTransactions?: number;
  inviteCount?: number;
  inviteCommission?: number;
  depositAmount?: number;
  withdrawalAmount?: number;
  buyVolume?: number;
  sellVolume?: number;
  joinDate: string;
  status: 'active' | 'vip' | 'premium';
  avatar?: string;
}

type LeaderboardTab = 'trading' | 'invite' | 'deposit';
type TradingFilter = 'all' | 'buy' | 'sell';
type InviteFilter = 'count' | 'commission';
type DepositFilter = 'all' | 'deposit' | 'withdrawal';
type TimeRange = '24h' | '7d' | '30d' | '90d' | '180d' | '1y' | 'all';

export const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { unit } = useCurrency();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('trading');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [tradingFilter, setTradingFilter] = useState<TradingFilter>('all');
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>('count');
  const [depositFilter, setDepositFilter] = useState<DepositFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalUsers = 50;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // 生成不同类型的排行榜数据
  useEffect(() => {
    const generateUsers = (type: LeaderboardTab): LeaderboardUser[] => {
      const usernames = [
        'BitcoinWhale', 'CryptoKing', 'DiamondHands', 'MoonLambo', 'HODLer2024',
        'SatoshiFan', 'BlockchainPro', 'CryptoNinja', 'BTCMaster', 'DigitalGold',
        'CoinCollector', 'TradingBot', 'CryptoSage', 'BitMiner', 'ChainLink',
        'TokenHunter', 'CryptoGuru', 'BitBull', 'CoinWizard', 'BlockMaster',
        'CryptoLord', 'BitTrader', 'CoinMaster', 'BlockHunter', 'CryptoElite',
        'BitcoinPro', 'CoinGuru', 'CryptoWiz', 'BitLord', 'CoinKing',
        'CryptoHero', 'BitMagic', 'CoinStar', 'CryptoAce', 'BitGenius',
        'CoinLegend', 'CryptoChamp', 'BitExpert', 'CoinPro', 'CryptoMaster',
        'BitcoinSage', 'CoinWizard', 'CryptoGiant', 'BitTitan', 'CoinElite',
        'CryptoLegend', 'BitHero', 'CoinChamp', 'CryptoExpert', 'BitMaster'
      ];
      
      return usernames.map((username, index) => {
        const baseUser = {
          rank: index + 1,
          userId: `user_${String(index + 1).padStart(3, '0')}`,
          username,
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          status: (index < 3 ? 'premium' : index < 10 ? 'vip' : 'active') as 'active' | 'vip' | 'premium'
        };

        switch (type) {
          case 'trading':
            const buyVol = Math.random() * 500 + 25;
            const sellVol = Math.random() * 500 + 25;
            return {
              ...baseUser,
              totalVolume: buyVol + sellVol,
              buyVolume: buyVol,
              sellVolume: sellVol,
              totalTransactions: Math.floor(Math.random() * 500) + 10,
            };
          case 'invite':
            return {
              ...baseUser,
              inviteCount: Math.floor(Math.random() * 100) + 1,
              inviteCommission: Math.random() * 50 + 5,
              totalVolume: Math.random() * 500 + 20,
            };
          case 'deposit':
            return {
              ...baseUser,
              depositAmount: Math.random() * 800 + 100,
              withdrawalAmount: Math.random() * 600 + 50,
            };
          default:
            return baseUser;
        }
      });
    };

    setUsers(generateUsers(activeTab));
    setCurrentPage(1); // 切换标签时重置到第一页
  }, [activeTab, timeRange, tradingFilter, inviteFilter, depositFilter]);

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

  const getTabConfig = (tab: LeaderboardTab) => {
    switch (tab) {
      case 'trading':
        return {
          title: '交易排行榜',
          icon: <TrendingUp className="w-4 h-4" />,
          description: '按交易量和交易次数排名'
        };
      case 'invite':
        return {
          title: '邀请排行榜',
          icon: <UserPlus className="w-4 h-4" />,
          description: '按邀请用户数量和佣金排名'
        };
      case 'deposit':
        return {
          title: '存取排行榜',
          icon: <ArrowUpRight className="w-4 h-4" />,
          description: '按存取金额排名'
        };
    }
  };

  const getFilteredUsers = () => {
    let filteredUsers = [...users];
    
    // 根据不同标签页应用筛选
    switch (activeTab) {
      case 'trading':
        if (tradingFilter === 'buy') {
          filteredUsers.sort((a, b) => (b.buyVolume || 0) - (a.buyVolume || 0));
        } else if (tradingFilter === 'sell') {
          filteredUsers.sort((a, b) => (b.sellVolume || 0) - (a.sellVolume || 0));
        }
        break;
      case 'invite':
        if (inviteFilter === 'commission') {
          filteredUsers.sort((a, b) => (b.inviteCommission || 0) - (a.inviteCommission || 0));
        }
        break;
      case 'deposit':
        if (depositFilter === 'deposit') {
          filteredUsers.sort((a, b) => (b.depositAmount || 0) - (a.depositAmount || 0));
        } else if (depositFilter === 'withdrawal') {
          filteredUsers.sort((a, b) => (b.withdrawalAmount || 0) - (a.withdrawalAmount || 0));
        }
        break;
    }
    
    return filteredUsers;
  };

  const renderUserStats = (user: LeaderboardUser) => {
    switch (activeTab) {
      case 'trading':
        if (tradingFilter === 'buy') {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {formatVolume(user.buyVolume || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                买入量
              </div>
            </div>
          );
        } else if (tradingFilter === 'sell') {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                {formatVolume(user.sellVolume || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                卖出量
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatVolume(user.totalVolume || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                {user.totalTransactions} 笔交易
              </div>
            </div>
          );
        }
      case 'invite':
        if (inviteFilter === 'commission') {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {formatVolume(user.inviteCommission || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                佣金收入
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.inviteCount} 人
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                邀请人数
              </div>
            </div>
          );
        }
      case 'deposit':
        if (depositFilter === 'deposit') {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {formatVolume(user.depositAmount || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                存入金额
              </div>
            </div>
          );
        } else if (depositFilter === 'withdrawal') {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatVolume(user.withdrawalAmount || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                提取金额
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-right">
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatVolume(user.depositAmount || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                存入 {formatVolume(user.withdrawalAmount || 0)} 提取
              </div>
            </div>
          );
        }
    }
  };

  const renderSpecificFilter = () => {
    switch (activeTab) {
      case 'trading':
        return (
          <select
            value={tradingFilter}
            onChange={(e) => setTradingFilter(e.target.value as TradingFilter)}
            className={`px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
            }`}
          >
            <option value="all">全部交易</option>
            <option value="buy">买入排行</option>
            <option value="sell">卖出排行</option>
          </select>
        );
      case 'invite':
        return (
          <select
            value={inviteFilter}
            onChange={(e) => setInviteFilter(e.target.value as InviteFilter)}
            className={`px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
            }`}
          >
            <option value="count">按人数排行</option>
            <option value="commission">按佣金排行</option>
          </select>
        );
      case 'deposit':
        return (
          <select
            value={depositFilter}
            onChange={(e) => setDepositFilter(e.target.value as DepositFilter)}
            className={`px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
            }`}
          >
            <option value="all">全部</option>
            <option value="deposit">存入排行</option>
            <option value="withdrawal">提取排行</option>
          </select>
        );
    }
  };

  const currentTabConfig = getTabConfig(activeTab);
  const filteredUsers = getFilteredUsers();
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
    { value: '180d', label: '半年' },
    { value: '1y', label: '1年' },
    { value: 'all', label: '全部' }
  ];

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
          <div className="flex items-center gap-2">
            {currentTabConfig.icon}
            <h2 className={`text-2xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{currentTabConfig.title}</h2>
          </div>
          <div className={`flex-1 h-px ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-white/20 to-transparent' 
              : 'bg-gradient-to-r from-gray-300 to-transparent'
          }`}></div>
        </div>
        
        <p className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          {currentTabConfig.description}
        </p>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mb-4">
          {(['trading', 'invite', 'deposit'] as const).map((tab) => {
            const config = getTabConfig(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                    : theme === 'dark'
                      ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.icon}
                {config.title}
              </button>
            );
          })}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Specific Filter */}
          {renderSpecificFilter()}
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className={`px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
            }`}
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3 mb-6">
        {currentUsers.map((user) => (
          <div key={user.userId} className={`border rounded-xl p-4 transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(startIndex + currentUsers.indexOf(user) + 1)}
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
                    加入于 {user.joinDate}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              {renderUserStats(user)}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          显示 {startIndex + 1}-{Math.min(endIndex, totalUsers)} 共 {totalUsers} 人
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? theme === 'dark'
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                    : theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? theme === 'dark'
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};