export interface Summary {
  total_btc: number;
  total_usd: number;
  netflow_24h_btc: number;
  netflow_7d_btc: number;
  coverage_pct: number;
  unknown_pct: number;
  updated_at: string;
  proof: {
    ckbtc_explorer: string;
    btc_browser: string;
    address_clusters: string;
  };
}

export interface SeriesData {
  ts: string;
  value: number;
  coverage_pct: number;
}

export interface AddressRow {
  label: string;
  chain: string;
  address: string;
  last_active: string;
  in_sum_btc: number;
  out_sum_btc: number;
  note: string;
  proofs: Array<{
    type: string;
    url: string;
  }>;
}

export interface TransactionRow {
  tx_hash: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal';
  user_id: string;
  amount_btc: number;
  amount_usd: number;
  from_address: string;
  to_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  fee_btc: number;
  note: string;
  proofs: Array<{
    type: string;
    url: string;
  }>;
}

export interface RawAddressNote {
  zh: string;
  en: string;
}

export interface RawAddressRow {
  label: string;
  chain: string;
  address: string;
  last_active: string;
  in_sum_btc: number;
  out_sum_btc: number;
  note: RawAddressNote;
  proofs: Array<{
    type: string;
    url: string;
  }>;
}

export type ChartMode = 'net' | 'total';
export type ChartRange = '1h' | '24h' | '7d' | '30d' | '90d' | '180d' | '1Y' | 'All';
export type Unit = 'BTC' | 'USD';
export type Language = 'zh' | 'en';