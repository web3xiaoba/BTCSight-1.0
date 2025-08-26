import React from 'react';
import { ExternalLink, Shield, Globe, Database, Code, Github, Twitter, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

interface ProofLinksProps {
  proof?: {
    ckbtc_explorer: string;
    btc_browser: string;
    address_clusters: string;
  };
}

interface EcosystemProject {
  name: string;
  description: string;
  category: 'defi' | 'infrastructure' | 'tools' | 'social';
  status: 'live' | 'beta' | 'coming-soon';
  links: {
    website?: string;
    github?: string;
    twitter?: string;
    telegram?: string;
  };
  logo?: string;
}

export const ProofLinks: React.FC<ProofLinksProps> = ({ proof }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const ecosystemProjects: EcosystemProject[] = [
    {
      name: 'ckBTC Bridge',
      description: '官方比特币跨链桥，实现BTC与ICP网络的无缝连接',
      category: 'infrastructure',
      status: 'live',
      links: {
        website: 'https://dashboard.internetcomputer.org/bitcoin',
        github: 'https://github.com/dfinity/ic',
        twitter: 'https://twitter.com/dfinity'
      }
    },
    {
      name: 'IC Lighthouse',
      description: '去中心化数据分析平台，提供链上数据洞察',
      category: 'tools',
      status: 'live',
      links: {
        website: 'https://ic-lighthouse.com',
        github: 'https://github.com/ic-lighthouse',
        twitter: 'https://twitter.com/ic_lighthouse'
      }
    },
    {
      name: 'Sonic DEX',
      description: '基于ICP的去中心化交易所，支持ckBTC交易',
      category: 'defi',
      status: 'live',
      links: {
        website: 'https://sonic.ooo',
        twitter: 'https://twitter.com/sonic_ooo',
        telegram: 'https://t.me/sonic_ooo'
      }
    },
    {
      name: 'ICPSwap',
      description: '多功能DeFi协议，提供流动性挖矿和收益农场',
      category: 'defi',
      status: 'live',
      links: {
        website: 'https://icpswap.com',
        twitter: 'https://twitter.com/ICPSwap',
        telegram: 'https://t.me/ICPSwap'
      }
    },
    {
      name: 'NFID Wallet',
      description: '用户友好的ICP钱包，支持ckBTC存储和转账',
      category: 'tools',
      status: 'live',
      links: {
        website: 'https://nfid.one',
        github: 'https://github.com/internet-identity-labs',
        twitter: 'https://twitter.com/nfidapp'
      }
    },
    {
      name: 'OpenChat',
      description: '去中心化社交平台，集成ckBTC支付功能',
      category: 'social',
      status: 'beta',
      links: {
        website: 'https://oc.app',
        github: 'https://github.com/open-chat-labs',
        twitter: 'https://twitter.com/OpenChat'
      }
    },
    {
      name: 'Bitfinity EVM',
      description: '兼容以太坊的执行层，支持ckBTC作为Gas费',
      category: 'infrastructure',
      status: 'beta',
      links: {
        website: 'https://bitfinity.network',
        github: 'https://github.com/bitfinity-network',
        twitter: 'https://twitter.com/bitfinity_evm'
      }
    },
    {
      name: 'Catalyze',
      description: '去中心化众筹平台，使用ckBTC进行项目资助',
      category: 'defi',
      status: 'coming-soon',
      links: {
        website: 'https://catalyze.one',
        twitter: 'https://twitter.com/catalyze_one'
      }
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'defi':
        return <Database className="w-4 h-4" />;
      case 'infrastructure':
        return <Shield className="w-4 h-4" />;
      case 'tools':
        return <Code className="w-4 h-4" />;
      case 'social':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defi':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'infrastructure':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'tools':
        return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
      case 'social':
        return theme === 'dark' ? 'text-pink-400' : 'text-pink-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Live' },
      beta: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Beta' },
      'coming-soon': { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', text: 'Soon' }
    };
    
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
        theme === 'dark' ? badge.color : badge.color.replace('300', '700').replace('500/20', '100').replace('500/30', '200')
      }`}>
        {badge.text}
      </span>
    );
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'website':
        return <Globe className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'telegram':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className={`border rounded-2xl p-6 ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-[#F0B90B] to-[#F8D12F] ${
            theme === 'dark' ? 'shadow-lg shadow-[#F0B90B]/20' : 'shadow-md shadow-[#F0B90B]/30'
          }`}></div>
          <h2 className={`text-2xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>生态项目</h2>
          <div className={`flex-1 h-px ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-white/20 to-transparent' 
              : 'bg-gradient-to-r from-gray-300 to-transparent'
          }`}></div>
        </div>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          基于ICP网络的ckBTC生态系统项目
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {ecosystemProjects.map((project, index) => (
          <div key={index} className={`border rounded-xl p-4 transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(project.category)} bg-opacity-20`}>
                  {getCategoryIcon(project.category)}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{project.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs capitalize ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>
                </div>
              </div>
            </div>
            
            <p className={`text-sm mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
            }`}>
              {project.description}
            </p>
            
            <div className="flex items-center gap-2">
              {Object.entries(project.links).map(([type, url]) => (
                <a
                  key={type}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                  title={type}
                >
                  {getLinkIcon(type)}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Links */}
      <div className={`p-4 rounded-xl border ${
        theme === 'dark'
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50/80 border-blue-200/60 shadow-sm backdrop-blur-sm'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg ${
            theme === 'dark' ? 'bg-blue-400/20' : 'bg-blue-100'
          }`}>
            <Shield className={`w-4 h-4 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>验证链接</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={proof?.ckbtc_explorer || 'https://dashboard.internetcomputer.org/bitcoin'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Database className="w-3 h-3" />
                ckBTC浏览器
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={proof?.btc_browser || 'https://mempool.space/'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Globe className="w-3 h-3" />
                BTC浏览器
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
            }`}>
              所有数据均可通过链上验证，确保透明度和可信度
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};