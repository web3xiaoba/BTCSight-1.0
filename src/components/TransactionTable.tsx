import React, { useState, useMemo } from 'react';
import { Search, Download, ExternalLink, Copy, CheckCircle2, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionRow } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useCurrency } from '../hooks/useCurrency';
import { generateMockTransactions } from '../data/mockData';

interface TransactionTableProps {
  transactions?: TransactionRow[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions: propTransactions }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { unit } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 使用传入的交易数据或生成模拟数据
  const allTransactions = useMemo(() => {
    return propTransactions || generateMockTransactions(50);
  }, [propTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // 类型筛选
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.tx_hash.toLowerCase().includes(query) ||
        tx.user_id.toLowerCase().includes(query) ||
        tx.from_address.toLowerCase().includes(query) ||
        tx.to_address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allTransactions, searchQuery, statusFilter, typeFilter]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // 当筛选条件变化时重置到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, itemsPerPage]);

  const exportCSV = () => {
    const headers = ['交易哈希', '时间', '类型', '用户ID', '金额(BTC)', '金额(USD)', '发送地址', '接收地址', '状态', '确认数', '手续费', '备注'];
    const csvContent = [
      headers.join(','),
      ...currentTransactions.map(tx =>
        [
          tx.tx_hash,
          tx.timestamp,
          tx.type === 'deposit' ? '存入' : '提取',
          tx.user_id,
          tx.amount_btc,
          tx.amount_usd,
          tx.from_address,
          tx.to_address,
          tx.status === 'confirmed' ? '已确认' : tx.status === 'pending' ? '待确认' : '失败',
          tx.confirmations,
          tx.fee_btc,
          tx.note
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatAmount = (amountBtc: number, amountUsd: number) => {
    if (unit === 'USD') {
      return `$${amountUsd.toLocaleString()}`;
    }
    return `${amountBtc.toFixed(8)} BTC`;
  };

  const formatAddress = (address: string) => {
    if (address === 'platform_hot_wallet') {
      return '平台热钱包';
    }
    if (address.length > 20) {
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }
    return address;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '已确认';
      case 'pending':
        return '待确认';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'deposit' 
      ? <ArrowDownLeft className="w-4 h-4 text-green-500" />
      : <ArrowUpRight className="w-4 h-4 text-blue-500" />;
  };

  const getTypeText = (type: string) => {
    return type === 'deposit' ? '存入' : '提取';
  };

  return (
    <div id="transactions" className={`border rounded-2xl overflow-hidden ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-[#F0B90B] to-[#F8D12F] ${
              theme === 'dark' ? 'shadow-lg shadow-[#F0B90B]/20' : 'shadow-md shadow-[#F0B90B]/30'
            }`}></div>
            <h2 className={`text-3xl font-bold tracking-tight bg-gradient-to-r from-[#F0B90B] via-[#F8D12F] to-[#F0B90B] bg-clip-text text-transparent ${
              theme === 'dark' ? 'drop-shadow-lg' : 'drop-shadow-md'
            }`}>交易记录</h2>
            <div className={`flex-1 h-px ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            } ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#F0B90B]/30 via-[#F8D12F]/20 to-transparent' 
                : 'bg-gradient-to-r from-[#F0B90B]/40 via-[#F8D12F]/30 to-transparent'
            }`}></div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-white/40' : 'text-gray-400'
            }`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all duration-200 w-full ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:bg-white/8'
                  : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white shadow-sm'
              }`}
              placeholder="搜索交易哈希、用户ID或地址..."
            />
          </div>
            <div className={`flex-1 h-px ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-white/20 to-transparent' 
                : 'bg-gradient-to-r from-gray-300 to-transparent'
            }`}></div>
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>
            共 {filteredTransactions.length} 笔交易
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-white/40' : 'text-gray-400'
            }`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all duration-200 w-full ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:bg-white/8'
                  : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white shadow-sm'
              }`}
              placeholder="搜索交易哈希、用户ID或地址..."
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`px-3 py-2.5 rounded-xl border outline-none transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                  : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
              }`}
            >
              <option value="all">全部状态</option>
              <option value="confirmed">已确认</option>
              <option value="pending">待确认</option>
              <option value="failed">失败</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className={`px-3 py-2.5 rounded-xl border outline-none transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                  : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
              }`}
            >
              <option value="all">全部类型</option>
              <option value="deposit">存入</option>
              <option value="withdrawal">提取</option>
            </select>
            
            <button
              onClick={exportCSV}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-white/6 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  : 'bg-white/60 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">导出</span>
            </button>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>每页显示</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className={`px-3 py-2.5 rounded-xl border outline-none transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white focus:border-white/20'
                  : 'bg-white/60 border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
              }`}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>条</span>
          </div>
        </div>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {currentTransactions.map((tx, index) => (
            <div key={tx.tx_hash} className={`border-b last:border-b-0 transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-white/5 hover:bg-white/3' 
                : 'border-gray-100 hover:bg-gray-50/50'
            }`}>
              <div className="p-4">
                {/* Mobile Layout */}
                <div className="block lg:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{getTypeText(tx.type)}</span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                      }`}>#{tx.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className={`text-sm ${
                        tx.status === 'confirmed' ? 'text-green-500' :
                        tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{getStatusText(tx.status)}</span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>交易哈希</span>
                      <button
                        onClick={() => copyToClipboard(tx.tx_hash)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                        }`}
                      >
                        {copiedHash === tx.tx_hash ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className={`font-mono text-sm break-all ${
                      theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                    }`}>{tx.tx_hash}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>金额</span>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{formatAmount(tx.amount_btc, tx.amount_usd)}</p>
                    </div>
                    <div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>手续费</span>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>{tx.fee_btc.toFixed(8)} BTC</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                    }`}>时间</span>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                    }`}>{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-8 lg:gap-4 lg:items-center">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-sm ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                      }`}>
                        {formatHash(tx.tx_hash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.tx_hash)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                        }`}
                        title="复制交易哈希"
                      >
                        {copiedHash === tx.tx_hash ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                    }`}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                      }`}>{getTypeText(tx.type)}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                    }`}>{tx.user_id}</span>
                  </div>
                  
                  <div className="col-span-1">
                    <div className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatAmount(tx.amount_btc, tx.amount_usd)}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                    }`}>
                      手续费: {tx.fee_btc.toFixed(8)} BTC
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                    }`}>
                      <div>从: {formatAddress(tx.from_address)}</div>
                      <div>到: {formatAddress(tx.to_address)}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className={`text-sm ${
                        tx.status === 'confirmed' ? 'text-green-500' :
                        tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{getStatusText(tx.status)}</span>
                    </div>
                    {tx.status === 'confirmed' && (
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>
                        {tx.confirmations} 确认
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`p-4 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>
            共 {filteredTransactions.length} 条记录
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
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
                );
              })}
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
      )}
      
      {currentTransactions.length === 0 && (
        <div className="p-12 text-center">
          <div className={`text-6xl mb-4 ${
            theme === 'dark' ? 'text-white/20' : 'text-gray-300'
          }`}>📋</div>
          <p className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>未找到匹配的交易</p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/40' : 'text-gray-500'
          }`}>尝试调整搜索条件或筛选器</p>
        </div>
      )}
    </div>
  );
};