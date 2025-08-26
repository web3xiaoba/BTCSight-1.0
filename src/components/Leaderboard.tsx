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
type TradingFilter = 'buy' | 'sell';
type InviteFilter = 'count' | 'commission';
type DepositFilter = 'deposit' | 'withdrawal';
type TimeRange = '24h' | '7d' | '30d' | '90d' | '180d' | '1y' | 'all';

export const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { unit } = useCurrency();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('trading');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [tradingFilter, setTradingFilter] = useState<TradingFilter>('buy');
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>('count');
  const [depositFilter, setDepositFilter] = useState<DepositFilter>('deposit');
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
          status: 'active' as 'active' | 'vip' | 'premium'
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
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        theme === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
      }`}>
        活跃
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
        if (tradingFilter === 'sell') {
          filteredUsers.sort((a, b) => (b.sellVolume || 0) - (a.sellVolume || 0));
        } else {
          filteredUsers.sort((a, b) => (b.buyVolume || 0) - (a.buyVolume || 0));
        }
        break;
      case 'invite':
        if (inviteFilter === 'commission') {
          filteredUsers.sort((a, b) => (b.inviteCommission || 0) - (a.inviteCommission || 0));
        }
        break;
      case 'deposit':
        if (depositFilter === 'withdrawal') {
          filteredUsers.sort((a, b) => (b.withdrawalAmount || 0) - (a.withdrawalAmount || 0));
        } else {
          filteredUsers.sort((a, b) => (b.depositAmount || 0) - (a.depositAmount || 0));
        }
        break;
    }
    
    return filteredUsers;
  };

  const renderUserStats = (user: LeaderboardUser) => {
    switch (activeTab) {
      case 'trading':
        if (tradingFilter === 'sell') {
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
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {formatVolume(user.buyVolume || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                买入量
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
        if (depositFilter === 'withdrawal') {
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
              <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {formatVolume(user.depositAmount || 0)}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                存入金额
              </div>
            </div>
          );
        }
    }
  };

  const renderSpecificFilter = () => {
    switch (activeTab) {
      case 'trading':
        const tradingColors = {
          buy: theme === 'dark' 
            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
            : 'bg-green-100 text-green-700 border-green-200',
          sell: theme === 'dark' 
            ? 'bg-red-500/20 text-red-300 border-red-500/30' 
            : 'bg-red-100 text-red-700 border-red-200'
        };
        return (
          <div className={`flex rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-white/5' : 'bg-white/60 shadow-sm'
          }`}>
            <button
              onClick={() => setTradingFilter('buy')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                tradingFilter === 'buy'
                  ? tradingColors.buy
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              买入排行
            </button>
            <button
              onClick={() => setTradingFilter('sell')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                tradingFilter === 'sell'
                  ? tradingColors.sell
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              卖出排行
            </button>
          </div>
        );
      case 'invite':
        const inviteColors = {
          count: theme === 'dark' 
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
            : 'bg-purple-100 text-purple-700 border-purple-200',
          commission: theme === 'dark' 
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        return (
          <div className={`flex rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-white/5' : 'bg-white/60 shadow-sm'
          }`}>
            <button
              onClick={() => setInviteFilter('count')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                inviteFilter === 'count'
                  ? inviteColors.count
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              邀请人数
            </button>
            <button
              onClick={() => setInviteFilter('commission')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                inviteFilter === 'commission'
                  ? inviteColors.commission
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              邀请佣金
            </button>
          </div>
        );
      case 'deposit':
        const depositColors = {
          deposit: theme === 'dark' 
            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
            : 'bg-blue-100 text-blue-700 border-blue-200',
          withdrawal: theme === 'dark' 
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
            : 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return (
          <div className={`flex rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-white/5' : 'bg-white/60 shadow-sm'
          }`}>
            <button
              onClick={() => setDepositFilter('deposit')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                depositFilter === 'deposit'
                  ? depositColors.deposit
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              存入排行
            </button>
            <button
              onClick={() => setDepositFilter('withdrawal')}
              className={`px-4 py-2.5 text-sm transition-colors border ${
                depositFilter === 'withdrawal'
                  ? depositColors.withdrawal
                  : theme === 'dark'
                    ? 'text-white/70 hover:bg-white/10 border-white/10'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              取出排行
            </button>
          </div>
        );
    }
  };

  const renderTimeRangeSelector = () => {
    return (
      <div className={`flex rounded-xl border overflow-hidden ${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200 shadow-sm'
      }`}>
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`px-3 py-2.5 text-sm transition-colors whitespace-nowrap ${
              timeRange === option.value
                ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                : theme === 'dark'
                  ? 'text-white/70 hover:bg-white/10'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  const renderMobileSpecificFilter = () => {
    switch (activeTab) {
      case 'trading':
        return (
          <select
            value={tradingFilter}
            onChange={(e) => setTradingFilter(e.target.value as TradingFilter)}
            className={`px-3 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:bg-white/8'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 focus:bg-white shadow-sm'
            }`}
          >
            <option value="buy">买入排行</option>
            <option value="sell">卖出排行</option>
          </select>
        );
      case 'invite':
        return (
          <select
            value={inviteFilter}
            onChange={(e) => setInviteFilter(e.target.value as InviteFilter)}
            className={`px-3 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:bg-white/8'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 focus:bg-white shadow-sm'
            }`}
          >
            <option value="count">邀请人数</option>
            <option value="commission">邀请佣金</option>
          </select>
        );
      case 'deposit':
        return (
          <select
            value={depositFilter}
            onChange={(e) => setDepositFilter(e.target.value as DepositFilter)}
            className={`px-3 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:bg-white/8'
                : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 focus:bg-white shadow-sm'
            }`}
          >
            <option value="deposit">存入排行</option>
            <option value="withdrawal">取出排行</option>
          </select>
        );
    }
  };

  const renderMobileTimeRangeSelector = () => {
    return (
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
        className={`px-3 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:bg-white/8'
            : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 focus:bg-white shadow-sm'
        }`}
      >
        {timeRangeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
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
        <div className="text-center mb-6">
          <div className="relative">
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-[#F0B90B] to-[#F8D12F] ${
                theme === 'dark' ? 'shadow-lg shadow-[#F0B90B]/20' : 'shadow-md shadow-[#F0B90B]/30'
              }`}></div>
              <h2 className={`text-3xl font-bold tracking-tight bg-gradient-to-r from-[#F0B90B] via-[#F8D12F] to-[#F0B90B] bg-clip-text text-transparent ${
                theme === 'dark' ? 'drop-shadow-lg' : 'drop-shadow-md'
              }`}>用户排行榜</h2>
              <div className={`flex-1 h-px ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              } ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-[#F0B90B]/30 via-[#F8D12F]/20 to-transparent' 
                  : 'bg-gradient-to-r from-[#F0B90B]/40 via-[#F8D12F]/30 to-transparent'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className={`flex justify-between items-center p-1 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100/80 border border-gray-200'
        }`}>
          {(['trading', 'invite', 'deposit'] as const).map((tab) => {
            const config = getTabConfig(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white shadow-lg'
                    : theme === 'dark'
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                {config.icon}
                <span className="hidden sm:inline">{config.title}</span>
                <span className="sm:hidden">{config.title.replace('排行榜', '')}</span>
              </button>
            );
          })}
        </div>
        
        {/* Filters */}
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Specific Filter */}
              {renderSpecificFilter()}
              
              {/* Time Range Selector */}
              {renderTimeRangeSelector()}
            </div>
            
            {/* Total Count */}
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white/70' : 'text-gray-700'
            }`}>
              共 {totalUsers} 人
            </div>
          </div>
        </div>
        
        {/* Mobile Filters */}
        <div className="md:hidden space-y-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>筛选条件</span>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/70' : 'text-gray-700'
              }`}>
                共 {totalUsers} 人
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderMobileSpecificFilter()}
              {renderMobileTimeRangeSelector()}
            </div>
          </div>
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
                    <div className="md:block hidden">
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                  }`}>
                    <span className="md:inline hidden">加入于 </span>{user.joinDate}
                  </div>
                  <div className="md:hidden block mt-1">
                    {getStatusBadge(user.status)}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-right">
                {renderUserStats(user)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6">
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