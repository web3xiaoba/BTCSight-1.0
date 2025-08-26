import React, { useState, useMemo } from 'react';
import { Search, Download, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { AddressRow } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

interface AddressTableProps {
  addresses: AddressRow[];
}

export const AddressTable: React.FC<AddressTableProps> = ({ addresses }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredAddresses = useMemo(() => {
    if (!searchQuery) return addresses;
    
    const query = searchQuery.toLowerCase();
    return addresses.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [addresses, searchQuery]);

  const exportCSV = () => {
    const headers = ['Label', 'Chain', 'Address', 'Last Active', 'In BTC', 'Out BTC', 'Note', 'Proofs'];
    const csvContent = [
      headers.join(','),
      ...addresses.map(row =>
        [
          row.label,
          row.chain,
          row.address,
          row.last_active,
          row.in_sum_btc,
          row.out_sum_btc,
          row.note,
          `"${row.proofs.map(p => `${p.type}:${p.url}`).join('|')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'address_clusters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }
    return address;
  };

  const getChainBadgeColor = (chain: string) => {
    switch (chain.toLowerCase()) {
      case 'btc':
        return theme === 'dark' 
          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
          : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'icp':
        return theme === 'dark' 
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
          : 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return theme === 'dark' 
          ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' 
          : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div id="addresses" className={`border rounded-2xl overflow-hidden ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{t('addressClusters')}</h3>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}>
              共 {filteredAddresses.length} 个地址簇
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-white/40' : 'text-gray-400'
              }`} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all duration-200 w-64 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:bg-white/8'
                    : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white shadow-sm'
                }`}
                placeholder={t('search')}
              />
            </div>
            <button
              onClick={exportCSV}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-white/6 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  : 'bg-white/60 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('exportCsv')}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {filteredAddresses.map((row, index) => (
            <div key={index} className={`border-b last:border-b-0 transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-white/5 hover:bg-white/3' 
                : 'border-gray-100 hover:bg-gray-50/50'
            }`}>
              <div className="p-6">
                {/* Mobile Layout */}
                <div className="block lg:hidden space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{row.label}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getChainBadgeColor(row.chain)}`}>
                          {row.chain}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                      }`}>{row.note}</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>地址</span>
                      <button
                        onClick={() => copyToClipboard(row.address)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                        }`}
                      >
                        {copiedAddress === row.address ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className={`font-mono text-sm break-all ${
                      theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                    }`}>{row.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>流入 (BTC)</span>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>{row.in_sum_btc}</p>
                    </div>
                    <div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>流出 (BTC)</span>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>{row.out_sum_btc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                      }`}>最后活跃</span>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>{row.last_active}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {row.proofs.map((proof, i) => (
                        <a
                          key={i}
                          href={proof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                            theme === 'dark'
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {proof.type.toUpperCase()}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-8 lg:gap-6 lg:items-center">
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{row.label}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getChainBadgeColor(row.chain)}`}>
                      {row.chain}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm truncate ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-800'
                      }`}>
                        {formatAddress(row.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(row.address)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                        }`}
                        title="复制地址"
                      >
                        {copiedAddress === row.address ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>+{row.in_sum_btc}</div>
                      <div className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>-{row.out_sum_btc}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                    }`}>{row.last_active}</span>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                    }`}>{row.note}</span>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      {row.proofs.map((proof, i) => (
                        <a
                          key={i}
                          href={proof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                            theme === 'dark'
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {proof.type.toUpperCase()}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredAddresses.length === 0 && (
        <div className="p-12 text-center">
          <div className={`text-6xl mb-4 ${
            theme === 'dark' ? 'text-white/20' : 'text-gray-300'
          }`}>🔍</div>
          <p className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>未找到匹配的地址</p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white/40' : 'text-gray-500'
          }`}>尝试调整搜索条件</p>
        </div>
      )}
    </div>
  );
};