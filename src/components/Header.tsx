import React from 'react';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { ApiStatus } from './ApiStatus';
import { RealTimeToggle } from './RealTimeToggle';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../hooks/useTheme';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageToggle }) => {
  const { t, toggleLanguage } = useTranslation();
  const { unit, setUnit } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showOdinfunDropdown, setShowOdinfunDropdown] = React.useState(false);

  // 点击定位功能
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 70; // 导航栏高度 + 小间隙
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setShowOdinfunDropdown(false);
      setIsMobileMenuOpen(false);
    }
  };

  // 关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.odinfun-dropdown')) {
        setShowOdinfunDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 backdrop-blur border-b z-40 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0a0f16]/70 border-white/10' 
        : 'bg-white/80 border-slate-200/60 shadow-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="h-14 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#3961FB] via-[#6344FF] to-[#8B5CF6] shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z" />
                <path d="M12 7C10.34 7 9 8.34 9 10S10.34 13 12 13S15 11.66 15 10S13.66 7 12 7Z" fill="white" opacity="0.8" />
                <path d="M12 13C10.34 13 9 14.34 9 16S10.34 19 12 19S15 17.66 15 16S13.66 13 12 13Z" fill="white" opacity="0.6" />
              </svg>
            </div>
            <span className={`font-bold tracking-wide text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>BTCSight</span>
            <span className={`hidden sm:block px-2 py-0.5 rounded-full text-xs ${
              theme === 'dark' 
                ? 'bg-white/8 border border-white/20 text-white' 
                : 'bg-slate-100/80 border border-slate-200 text-slate-600 shadow-sm'
            }`}>
              v1.0
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Navigation Menu */}
            <div className="flex items-center gap-1">
              <div className="relative odinfun-dropdown">
                <button
                  onClick={() => setShowOdinfunDropdown(!showOdinfunDropdown)}
                  className="px-4 py-2 text-sm rounded-xl transition-colors bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white flex items-center gap-2 hover:opacity-90"
                >
                  Odinfun
                  <ChevronDown className={`w-4 h-4 transition-transform ${showOdinfunDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showOdinfunDropdown && (
                  <div className={`absolute top-full left-0 mt-2 border rounded-xl shadow-lg z-50 whitespace-nowrap ${
                    theme === 'dark'
                      ? 'bg-[#0e1116] border-white/10'
                      : 'bg-white border-gray-200 shadow-xl'
                  }`}>
                    <div className="py-2">
                      <button
                        onClick={() => scrollToSection('kpi-grid')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        数据概览
                      </button>
                      <button
                        onClick={() => scrollToSection('chart-section')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        资金流向
                      </button>
                      <button
                        onClick={() => scrollToSection('leaderboard')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        排行榜单
                      </button>
                      <button
                        onClick={() => scrollToSection('transactions')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        交易记录
                      </button>
                      <button
                        onClick={() => scrollToSection('ecosystem')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        生态项目
                      </button>
                      <button
                        onClick={() => scrollToSection('faq')}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3961FB] to-[#6344FF]"></div>
                        常见问题
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className={`px-4 py-2 text-sm rounded-xl transition-colors relative ${
                theme === 'dark'
                  ? 'bg-white/6 border border-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
                BRC-2.0
                <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-xs rounded-full ${
                  theme === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                }`}>
                  Soon
                </span>
              </button>
            </div>
            
            <ApiStatus />
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white shadow-sm hover:shadow-md'
              }`}
              title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setUnit('BTC')}
                className={`py-1.5 px-3 text-sm rounded-lg transition-colors ${
                  unit === 'BTC'
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                    : theme === 'dark'
                      ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                BTC
              </button>
              <button
                onClick={() => setUnit('USD')}
                className={`py-1.5 px-3 text-sm rounded-lg transition-colors ${
                  unit === 'USD'
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                    : theme === 'dark'
                      ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                USD
              </button>
            </div>
            <button
              onClick={onLanguageToggle}
              className={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                theme === 'dark'
                  ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white shadow-sm hover:shadow-md'
              }`}
            >
              {t('language')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

          
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t py-4 space-y-3 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            {/* API Status - Mobile */}
            <div className="flex justify-center">
              <ApiStatus />
            </div>
            
            {/* Currency Toggle */}
            <div className="space-y-2">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>{t('unit')}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setUnit('BTC');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm rounded-lg transition-colors ${
                    unit === 'BTC'
                      ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                      : theme === 'dark'
                        ? 'bg-white/6 border border-white/10 text-white/70'
                        : 'bg-gray-100 border border-gray-200 text-gray-600'
                  }`}
                >
                  BTC
                </button>
                <button
                  onClick={() => {
                    setUnit('USD');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm rounded-lg transition-colors ${
                    unit === 'USD'
                      ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                      : theme === 'dark'
                        ? 'bg-white/6 border border-white/10 text-white/70'
                        : 'bg-gray-100 border border-gray-200 text-gray-600'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="space-y-2">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>{t('language')}</div>
              <button
                onClick={() => {
                  onLanguageToggle();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-colors text-left ${
                  theme === 'dark'
                    ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'zh' ? '切换到 English' : 'Switch to 中文'}
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>{t('theme')}</div>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-colors text-left flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? t('lightMode') : t('darkMode')}
              </button>
            </div>

            {/* Version Badge for Mobile */}
            <div className="space-y-2">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>产品导航</div>
              <div className="space-y-2">
                <button className={`w-full py-2.5 px-4 rounded-lg text-sm transition-colors text-left bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white`}>
                  Odinfun
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => scrollToSection('kpi-grid')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      数据概览
                    </button>
                    <button
                      onClick={() => scrollToSection('chart-section')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      资金流向
                    </button>
                    <button
                      onClick={() => scrollToSection('leaderboard')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      用户排行榜
                    </button>
                    <button
                      onClick={() => scrollToSection('transactions')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      交易记录
                    </button>
                    <button
                      onClick={() => scrollToSection('ecosystem')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      生态项目
                    </button>
                    <button
                      onClick={() => scrollToSection('faq')}
                      className="w-full text-left px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      常见问题
                    </button>
                  </div>
                </button>
                <button className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-colors text-left relative ${
                  theme === 'dark'
                    ? 'bg-white/6 border-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}>
                  BRC-2.0
                  <span className={`absolute top-1 right-2 px-1.5 py-0.5 text-xs rounded-full ${
                    theme === 'dark'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                  }`}>
                    Soon
                  </span>
                </button>
              </div>
            </div>

            <div className={`pt-2 border-t ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                theme === 'dark'
                  ? 'bg-white/8 border border-white/20 text-white/70'
                  : 'bg-gray-100 border border-gray-300 text-gray-600'
              }`}>
                BTCSight v1.0
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};