import { useState, useEffect, useCallback, useRef } from 'react';
import { realApiClient } from '../services/realApi';
import { Summary, SeriesData, AddressRow, TransactionRow, ChartRange, Language } from '../types';
import { mockSummary, generateSeries, getMockAddressRows, generateDynamicSummary, generateMockTransactions } from '../data/mockData';

// API状态管理Hook
export const useApiData = () => {
  const [summary, setSummary] = useState<Summary>(mockSummary);
  const [seriesNet, setSeriesNet] = useState<SeriesData[]>(generateSeries(7, 'netflow', '7d'));
  const [seriesTotal, setSeriesTotal] = useState<SeriesData[]>(generateSeries(7, 'total', '7d'));
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const [reconnectCountdown, setReconnectCountdown] = useState<number>(0);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);

  // 使用 useRef 来避免循环依赖
  const checkApiHealthRef = useRef<() => Promise<boolean>>();

  // 获取总览数据
  const fetchSummary = useCallback(async () => {
    console.log('🔄 获取总览数据...');
    const data = await realApiClient.getSummary();
    
    if (data) {
      console.log('✅ 总览数据获取成功:', data);
      setSummary(data);
      setApiStatus('online');
      setError(null);
    } else {
      console.log('⚠️ 使用演示数据提供总览信息');
      // 使用动态演示数据
      setSummary(generateDynamicSummary());
      setApiStatus('offline');
      setError(null); // 不显示错误，因为这是正常的演示模式
    }
    setLastUpdated(new Date().toISOString());
  }, []);

  // 获取时间序列数据
  const fetchSeries = useCallback(async (range: ChartRange) => {
    console.log('🔄 useApi: fetchSeries 被调用，范围:', range);
    
    // 并行获取净流和总量数据
    const [netData, totalData] = await Promise.all([
      realApiClient.getSeries('netflow', range),
      realApiClient.getSeries('total', range)
    ]);
    
    if (netData || totalData) {
      if (netData) {
        console.log('✅ 净流数据获取成功');
        setSeriesNet(netData);
      }
      
      if (totalData) {
        console.log('✅ 总量数据获取成功');
        setSeriesTotal(totalData);
      }
      
      setApiStatus('online');
      setError(null);
    } else {
      console.log('⚠️ 使用演示数据提供时间序列信息');
      // 生成动态演示数据
      const days = getDaysFromRange(range);
      const netData = generateSeries(days, 'netflow', range);
      const totalData = generateSeries(days, 'total', range).map(d => ({ 
        ...d, 
        value: d.value + 250 + Math.sin(Date.now() / 100000) * 5 
      }));
      
      console.log('📊 生成的净流数据:', netData.length, '个数据点');
      console.log('📊 生成的总量数据:', totalData.length, '个数据点');
      console.log('📊 净流数据示例:', netData.slice(0, 3));
      console.log('📊 总量数据示例:', totalData.slice(0, 3));
      
      setSeriesNet(netData);
      setSeriesTotal(totalData);
      setApiStatus('offline');
    }
  }, []);

  // 获取地址数据
  const fetchAddresses = useCallback(async (language: Language, search?: string) => {
    console.log('🔄 获取地址数据...', language, search);
    const addresses = await realApiClient.getAddresses();
    
    if (addresses && addresses.length > 0) {
      console.log('✅ 地址数据获取成功:', addresses.length, '条');
      const transformedAddresses = addresses.map((addr: any) => ({
        ...addr,
        note: addr.note[language] || addr.note.zh || addr.note.en || ''
      }));
      setAddresses(transformedAddresses);
      setApiStatus('online');
      setError(null);
    } else {
      console.log('⚠️ 使用演示数据提供地址信息');
      let addressData = getMockAddressRows(language);
      
      // 模拟搜索功能
      if (search) {
        const query = search.toLowerCase();
        addressData = addressData.filter(addr =>
          Object.values(addr).some(value =>
            String(value).toLowerCase().includes(query)
          )
        );
      }
      
      setAddresses(addressData);
      setApiStatus('offline');
      setError('API不可用，显示演示数据');
    }
  }, []);

  // 获取交易数据
  const fetchTransactions = useCallback(async (search?: string) => {
    console.log('🔄 获取交易数据...', search);
    
    // 目前使用模拟数据，未来可以接入真实API
    let transactionData = generateMockTransactions(100);
    
    // 模拟搜索功能
    if (search) {
      const query = search.toLowerCase();
      transactionData = transactionData.filter(tx =>
        tx.tx_hash.toLowerCase().includes(query) ||
        tx.user_id.toLowerCase().includes(query) ||
        tx.from_address.toLowerCase().includes(query) ||
        tx.to_address.toLowerCase().includes(query)
      );
    }
    
    setTransactions(transactionData);
    console.log('✅ 交易数据获取成功:', transactionData.length, '条');
  }, []);

  // 刷新所有数据
  const refreshAllData = useCallback(async (range: ChartRange, language: Language) => {
    console.log('🔄 useApi: refreshAllData 被调用 - 这应该只在手动刷新时发生', { range, language });
    setLoading(true);
    setError(null);

    try {
      // 并行获取所有数据
      await Promise.all([
        fetchSummary(),
        fetchAddresses(language),
        fetchTransactions(),
      ]);
      console.log('✅ 所有数据刷新完成');
    } catch (err) {
      console.warn('⚠️ 数据刷新部分失败:', err);
      // 不设置错误，因为各个fetch函数会处理自己的错误
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, fetchAddresses, fetchTransactions]);

  // 启动重连倒计时 - 先定义这个函数
  const startReconnectCountdown = useCallback(() => {
    console.log('🕐 启动重连倒计时，设置初始值为30');
    
    // 清除现有定时器
    if (countdownTimer) {
      console.log('🧹 清除现有定时器:', countdownTimer);
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }
    
    // 立即设置初始值
    setReconnectCountdown(30);
    console.log('✅ 倒计时初始值已设置为30');
    
    // 创建新的定时器
    const timer = setInterval(() => {
      console.log('⏰ 定时器触发');
      setReconnectCountdown((prevCount) => {
        console.log('⏰ 倒计时更新:', prevCount, '->', prevCount - 1);
        const newCount = prevCount - 1;
        
        if (newCount <= 0) {
          console.log('🔄 倒计时结束，开始重连');
          if (timer) {
            clearInterval(timer);
            setCountdownTimer(null);
          }
          // 通过 ref 调用 checkApiHealth
          if (checkApiHealthRef.current) {
            checkApiHealthRef.current();
          }
          return 0;
        }
        
        return newCount;
      });
    }, 1000);
    
    console.log('⏰ 定时器已创建，ID:', timer);
    setCountdownTimer(timer);
  }, []); // 移除所有依赖，避免循环依赖

  // 健康检查
  const checkApiHealth = useCallback(async () => {
    try {
      console.log('🔄 检查API健康状态...');
      setApiStatus('checking');
      const workingApi = await realApiClient.findWorkingApi();
      const isHealthy = !!workingApi;
      console.log(isHealthy ? `✅ API健康 (${workingApi?.name})` : '❌ API不健康');
      
      // 如果API离线，启动重连倒计时
      if (!isHealthy) {
        setApiStatus('offline');
        console.log('🕐 启动重连倒计时');
        startReconnectCountdown();
      } else {
        setApiStatus('online');
        // API恢复在线时，清除倒计时
        setReconnectCountdown(0);
        if (countdownTimer) {
          clearInterval(countdownTimer);
          setCountdownTimer(null);
        }
      }
      
      return isHealthy;
    } catch (err) {
      console.warn('⚠️ 健康检查失败:', err);
      setApiStatus('offline');
      console.log('🕐 启动重连倒计时（异常情况）');
      startReconnectCountdown();
      return false;
    }
  }, [startReconnectCountdown]);

  // 更新 checkApiHealth 的引用
  useEffect(() => {
    checkApiHealthRef.current = checkApiHealth;
  }, [checkApiHealth]);

  // 初始化时检查API状态
  useEffect(() => {
    console.log('🚀 useApiData: 初始化API健康检查');
    checkApiHealth();
  }, [checkApiHealth]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (countdownTimer) {
        console.log('🧹 组件卸载，清理定时器:', countdownTimer);
        clearInterval(countdownTimer);
        setCountdownTimer(null);
      }
    };
  }, [countdownTimer]);

  return {
    summary,
    seriesNet,
    seriesTotal,
    addresses,
    transactions,
    loading,
    error,
    lastUpdated,
    apiStatus,
    reconnectCountdown,
    fetchSummary,
    fetchSeries,
    fetchAddresses,
    fetchTransactions,
    refreshAllData,
    checkApiHealth,
  };
};

// 数据缓存Hook
export const useDataCache = () => {
  const [cache, setCache] = useState<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  const getCachedData = useCallback((key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 使用缓存数据:', key);
      return cached.data;
    }
    return null;
  }, [cache]);

  const setCachedData = useCallback((key: string, data: any) => {
    console.log('💾 缓存数据:', key);
    setCache(prev => new Map(prev.set(key, { data, timestamp: Date.now() })));
  }, []);

  const clearCache = useCallback(() => {
    console.log('🗑️ 清空缓存');
    setCache(new Map());
  }, []);

  return {
    getCachedData,
    setCachedData,
    clearCache,
  };
};

// 实时数据Hook
export const useRealTimeData = () => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  
  // 添加调试日志
  useEffect(() => {
    console.log('🔄 useRealTimeData: isRealTimeEnabled 状态变化:', isRealTimeEnabled);
  }, [isRealTimeEnabled]);

  return {
    isRealTimeEnabled,
    setIsRealTimeEnabled,
  };
};