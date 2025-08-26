import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { KPIGrid } from './components/KPIGrid';
import { ChartCard } from './components/ChartCard';
import { ProofLinks } from './components/ProofLinks';
import { FAQCard } from './components/FAQCard';
import { TransactionTable } from './components/TransactionTable';
import { Leaderboard } from './components/Leaderboard';
import { useApiData } from './hooks/useApi';
import { ChartMode, ChartRange, Unit } from './types';
import { useTranslation } from './hooks/useTranslation';
import { useCurrency } from './hooks/useCurrency';
import { useTheme } from './hooks/useTheme';

function App() {
  const { language, t, toggleLanguage } = useTranslation();
  const { unit, setUnit } = useCurrency();
  const { theme } = useTheme();
  const [initialLoading, setInitialLoading] = useState(true);
  const [chartMode, setChartMode] = useState<ChartMode>('net');
  
  // 从本地存储读取图表范围，默认为30d
  const [chartRange, setChartRange] = useState<ChartRange>(() => {
    try {
      const savedRange = localStorage.getItem('chartRange');
      return (savedRange as ChartRange) || '30d';
    } catch {
      return '30d';
    }
  });
  
  // 使用API数据管理
  const {
    summary,
    seriesNet,
    seriesTotal,
    addresses,
    transactions,
    loading,
    error,
    apiStatus,
    reconnectCountdown,
    fetchSummary,
    fetchSeries,
    fetchAddresses,
    fetchTransactions,
    refreshAllData,
  } = useApiData();

  // 添加调试日志来检查状态传递
  useEffect(() => {
    console.log('🔄 App: reconnectCountdown 状态变化:', reconnectCountdown, '类型:', typeof reconnectCountdown);
  }, [reconnectCountdown]);
  useEffect(() => {
    // 初始化数据加载
    const initializeData = async () => {
      console.log('🚀 App: 开始初始化数据加载');
      setInitialLoading(true);
      
      try {
        await Promise.all([
          fetchSummary(),
          fetchAddresses(language),
          fetchTransactions(),
        ]);
        // 单独初始化图表数据
        console.log('📊 App: 初始化图表数据');
        await fetchSeries('7d');
        console.log('✅ App: 初始化数据加载完成');
      } catch (err) {
        console.warn('⚠️ App: 初始化数据加载失败:', err);
      } finally {
        setInitialLoading(false);
        console.log('🏁 App: initialLoading 设置为 false');
      }
    };

    initializeData();
  }, [fetchSummary, fetchAddresses, fetchTransactions, fetchSeries, language]);

  // 语言变化时更新地址数据
  useEffect(() => {
    fetchAddresses(language);
    fetchTransactions();
  }, [language, fetchAddresses]);

  // 图表范围变化时更新数据
  useEffect(() => {
    // 图表范围变化时，完全不做任何操作
    // ChartCard组件会自己处理数据更新，无需App层面干预
    console.log('📊 App: chartRange 变化为', chartRange, '- 不执行任何操作');
  }, [chartRange]);

  const handleRefresh = () => {
    console.log('🔄 App: 手动刷新触发');
    refreshAllData(chartRange, language);
  };

  const handleRangeChange = (range: ChartRange) => {
    console.log('🎯 App: handleRangeChange 被调用，范围:', range);
    setChartRange(range);
    
    // 保存到本地存储
    try {
      localStorage.setItem('chartRange', range);
      console.log('💾 App: 图表范围已保存到本地存储:', range);
    } catch (error) {
      console.warn('⚠️ App: 保存图表范围到本地存储失败:', error);
    }
    
    console.log('✅ App: chartRange 状态已更新，不调用任何数据获取函数');
  };

  const handleScrollToAddresses = () => {
    const transactionSection = document.getElementById('transactions');
    if (transactionSection) {
      transactionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 显示初始加载状态
  if (initialLoading) {
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0a0f16] text-white' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900'
      }`}>
        <Header 
          language={language} 
          onLanguageToggle={toggleLanguage}
          unit={unit}
          onUnitChange={setUnit}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="正在加载数据..." />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0a0f16] text-white' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900'
      }`}>
        <Header 
          language={language} 
          onLanguageToggle={toggleLanguage}
          unit={unit}
          onUnitChange={setUnit}
        />
        
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          <Banner
            coveragePct={summary.coverage_pct}
            updatedAt={summary.updated_at}
            apiStatus={apiStatus}
            reconnectCountdown={reconnectCountdown}
          />

          <div id="kpi-grid">
            <KPIGrid
            loading={loading}
            summary={summary}
            onRefresh={handleRefresh}
            onScrollToAddresses={handleScrollToAddresses}
            />
          </div>

          <div id="chart-section">
            <ChartCard
            seriesNet={seriesNet}
            seriesTotal={seriesTotal}
            mode={chartMode}
            range={chartRange}
            onModeChange={setChartMode}
            onRangeChange={handleRangeChange}
            />
          </div>

          <div id="leaderboard">
            <Leaderboard />
          </div>

          <TransactionTable transactions={transactions} />

          <div id="ecosystem">
            <ProofLinks proof={summary.proof} />
          </div>

          <div id="faq">
            <FAQCard />
          </div>
        </main>

        <footer className={`max-w-6xl mx-auto px-4 py-8 text-center text-xs ${
          theme === 'dark' ? 'text-white/40' : 'text-gray-500'
        }`}>
          {t('footer')}
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;