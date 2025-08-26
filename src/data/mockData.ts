import { Summary, SeriesData, AddressRow, RawAddressRow, TransactionRow, Language } from '../types';

export const mockSummary: Summary = {
  total_btc: 1247.8932,
  total_usd: 76543210.88,
  netflow_24h_btc: 8.7654,
  netflow_7d_btc: -23.4567,
  coverage_pct: 82,
  unknown_pct: 18,
  updated_at: new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit', 
    hour: '2-digit',
    minute: '2-digit'
  }),
  proof: {
    ckbtc_explorer: "https://dashboard.internetcomputer.org/bitcoin",
    btc_browser: "https://mempool.space/",
    address_clusters: "#addresses"
  }
};

// 动态生成演示数据的函数
export function generateDynamicSummary(): Summary {
  const now = new Date();
  const timeVariation = Math.sin(now.getTime() / 100000) * 0.1;
  
  return {
    total_btc: 1247.8932 + timeVariation * 10,
    total_usd: (1247.8932 + timeVariation * 10) * 61500,
    netflow_24h_btc: 8.7654 + Math.sin(now.getTime() / 50000) * 5,
    netflow_7d_btc: -23.4567 + Math.cos(now.getTime() / 80000) * 8,
    coverage_pct: 82,
    unknown_pct: 18,
    updated_at: now.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit', 
      hour: '2-digit',
      minute: '2-digit'
    }),
    proof: {
      ckbtc_explorer: "https://dashboard.internetcomputer.org/bitcoin",
      btc_browser: "https://mempool.space/",
      address_clusters: "#addresses"
    }
  };
}

export function generateSeries(days = 7, kind: 'netflow' | 'total' = 'netflow', range: string = '7d'): SeriesData[] {
  const arr: SeriesData[] = [];
  
  // Determine time interval based on range
  const getTimeInterval = (range: string) => {
    switch (range) {
      case '1h': return 5 * 60 * 1000; // 5 minutes
      case '24h': return 60 * 60 * 1000; // 1 hour
      case '7d': return 24 * 60 * 60 * 1000; // 1 day
      case '30d': return 24 * 60 * 60 * 1000; // 1 day
      default: return 24 * 60 * 60 * 1000;
    }
  };
  
  const getDataPoints = (range: string) => {
    switch (range) {
      case '1h': return 12; // 12 points (5-minute intervals)
      case '24h': return 24; // 24 points (hourly)
      case '7d': return 7; // 7 points (daily)
      case '30d': return 30; // 30 points (daily)
      case '90d': return 90; // 90 points (daily)
      case '180d': return 180; // 180 points (daily)
      case '1Y': return 365; // 365 points (daily)
      case 'All': return 730; // 730 points (daily, ~2 years)
      default: return days;
    }
  };
  
  const interval = getTimeInterval(range);
  const dataPoints = getDataPoints(range);
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = Date.now() - i * interval;
    const ts = range === '1h' || range === '24h' 
      ? new Date(timestamp).toISOString().slice(11, 16) // HH:MM format
      : new Date(timestamp).toISOString().slice(0, 10); // YYYY-MM-DD format
    const base = kind === 'netflow' ? (Math.sin(i / 3) * 8 - 1) : 1200 + Math.sin(i / 3) * 80;
    const noise = (Math.random() - 0.5) * (kind === 'netflow' ? 2 : 1);
    arr.push({
      ts,
      value: +(base + noise).toFixed(4),
      coverage_pct: 82 - Math.floor(Math.random() * 4)
    });
  }
  return arr;
}

const rawAddressRows: RawAddressRow[] = [
  {
    label: "Treasury",
    chain: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    last_active: new Date().toISOString().slice(0, 10),
    in_sum_btc: 856.7234,
    out_sum_btc: 123.4567,
    note: {
      zh: "官方多签（示例）",
      en: "Official multisig (demo)"
    },
    proofs: [
      { type: "tx", url: "https://mempool.space/" }
    ]
  },
  {
    label: "Pool",
    chain: "ICP",
    address: "principal-abcde-odin-pool-01",
    last_active: new Date().toISOString().slice(0, 10),
    in_sum_btc: 234.5678,
    out_sum_btc: 89.1234,
    note: {
      zh: "合约池（示例）",
      en: "Contract pool (demo)"
    },
    proofs: [
      { type: "ckbtc", url: "https://dashboard.internetcomputer.org/bitcoin" }
    ]
  },
  {
    label: "External",
    chain: "BTC",
    address: "bc1qexampleexternaladdr0000000009xk",
    last_active: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    in_sum_btc: 156.7890,
    out_sum_btc: 67.8901,
    note: {
      zh: "外部地址（示例）",
      en: "External address (demo)"
    },
    proofs: [
      { type: "tx", url: "https://mempool.space/" }
    ]
  }
];

export function getMockAddressRows(language: Language = 'zh'): AddressRow[] {
  return rawAddressRows.map(row => ({
    ...row,
    note: row.note[language]
  }));
}

// 生成模拟交易数据
export function generateMockTransactions(count: number = 50): TransactionRow[] {
  const transactions: TransactionRow[] = [];
  const userIds = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008'];
  const statuses: ('pending' | 'confirmed' | 'failed')[] = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'pending', 'failed'];
  
  for (let i = 0; i < count; i++) {
    const isDeposit = Math.random() > 0.4; // 60% 存入，40% 提取
    const amount = +(Math.random() * 5 + 0.001).toFixed(8);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 过去30天内
    
    transactions.push({
      tx_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: timestamp.toISOString(),
      type: isDeposit ? 'deposit' : 'withdrawal',
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      amount_btc: amount,
      amount_usd: +(amount * 61500).toFixed(2),
      from_address: isDeposit 
        ? `bc1q${Math.random().toString(36).substr(2, 39)}`
        : 'platform_hot_wallet',
      to_address: isDeposit 
        ? 'platform_hot_wallet'
        : `bc1q${Math.random().toString(36).substr(2, 39)}`,
      status,
      confirmations: status === 'confirmed' ? Math.floor(Math.random() * 6) + 1 : 0,
      fee_btc: +(Math.random() * 0.001 + 0.00001).toFixed(8),
      note: isDeposit ? '用户存入BTC' : '用户提取BTC',
      proofs: [
        { type: 'btc', url: 'https://mempool.space/' },
        { type: 'platform', url: '#transaction-details' }
      ]
    });
  }
  
  // 按时间倒序排列
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}