export const translations = {
  zh: {
    // Header
    help: '帮助',
    language: '中文',
    theme: '主题',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    
    // Banner
    coverage: '覆盖率',
    lastUpdated: '最后更新',
    onChainVerifiable: '可链上核验',
    dataSourceUnavailable: '数据源暂不可达，请稍后重试。',
    
    // KPIs
    totalReserve: '总存量',
    netFlow24h: '净流 24h',
    netFlow7d: '净流 7d',
    coverageLabel: '覆盖率',
    unknown: '未知',
    updated: '更新时间',
    unit: '单位',
    
    // Chart
    netFlow: '净流',
    total: '总量',
    viewOnChain: '链上查看',
    timeRange: '时间范围',
    chartMode: '图表模式',
    
    // Proof Links
    proofLinks: '验证链接',
    ckbtcExplorer: 'ckBTC 浏览器',
    btcBrowser: 'BTC 浏览器',
    addressClusters: '地址簇',
    proofDescription: '所有关键数值均应提供链上或账本查询入口（此处为演示链接）。',
    
    // Onboarding
    howToRead: '如何阅读这个看板？',
    onboardingItems: [
      '<strong>总存量</strong>显示 odin.fun 相关地址聚合的 BTC/ckBTC 余额；单位可切换 BTC/USD。',
      '<strong>净流</strong>是入金减出金；区间可选 1h/24h/7d/30d。',
      '每个关键数值旁提供<strong>链上核验</strong>链接，点击即可验证。',
      '当覆盖率不足时，会显示<strong>Unknown%</strong> 与黄色提示条。'
    ],
    
    // Address Table
    search: '搜索…',
    exportCsv: '导出 CSV',
    
    // Transaction Table
    transactions: '交易记录',
    txHash: '交易哈希',
    txType: '类型',
    userId: '用户ID',
    amount: '金额',
    fromAddress: '发送地址',
    toAddress: '接收地址',
    status: '状态',
    confirmations: '确认数',
    fee: '手续费',
    deposit: '存入',
    withdrawal: '提取',
    pending: '待确认',
    confirmed: '已确认',
    failed: '失败',
    viewTransaction: '查看交易',
    
    // Legacy Address Table (keeping for compatibility)
    label: '标签',
    chain: '链',
    address: '地址 / Principal',
    lastActive: '最后活跃',
    inBtc: '流入 (BTC)',
    outBtc: '流出 (BTC)',
    note: '备注',
    proof: '证明',
    
    // Address data
    treasury: '官方多签（示例）',
    pool: '合约池（示例）',
    external: '外部地址（示例）',
    
    // Footer
    footer: '© 2025 BTCSight · Bitcoin透明度仪表板演示版。当前显示模拟数据用于界面预览。',
    
    // Alerts
    helpAlert: '这是演示版本，展示完整的数据透明度仪表板功能。所有数据为模拟数据，用于展示界面效果。',
    languageAlert: '语言已切换为中文。',
    refreshAlert: '数据已刷新。',
    rangeChangeAlert: '区间切换为 {range}（演示）。正式版将按区间拉取真实数据。',
    unknownDataExplanation: '未知数据是指无法归类到已知地址簇的资金。这可能包括：\n• 新的未识别地址\n• 第三方托管地址\n• 临时中转地址\n\n我们持续更新地址簇以提高覆盖率。',
    
    // Tooltips
    inflow: '流入',
    outflow: '流出',
    clickToViewAddresses: '点击查看交易记录',
    clickForDetails: '点击查看详情',
    clickToRefresh: '点击刷新数据',
    
    // Unknown Data Modal
    unknownDataTitle: '未知数据说明',
    ofTotalReserve: '占总存量',
    unknownDataDescription: '未知数据是指无法归类到已知地址簇的资金。这些资金仍然是安全的，只是我们暂时无法确定其具体归属。',
    newAddresses: '新识别地址',
    newAddressesDesc: '最近出现的新地址，尚未被分类到现有地址簇中',
    thirdPartyCustody: '第三方托管',
    thirdPartyCustodyDesc: '由交易所或其他第三方服务商托管的地址',
    temporaryAddresses: '临时中转地址',
    temporaryAddressesDesc: '用于资金转移的临时地址，通常很快会被清空',
    improvingCoverage: '持续改进覆盖率',
    improvingCoverageDesc: '我们的团队持续监控和分析新地址，定期更新地址簇以提高透明度。',
    understood: '我知道了'
  },
  en: {
    // Header
    help: 'Help',
    language: 'English',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // Banner
    coverage: 'Coverage',
    lastUpdated: 'Last Updated',
    onChainVerifiable: 'On-chain Verifiable',
    dataSourceUnavailable: 'Data source temporarily unavailable, please try again later.',
    
    // KPIs
    totalReserve: 'Total Reserve',
    netFlow24h: 'Net Flow 24h',
    netFlow7d: 'Net Flow 7d',
    coverageLabel: 'Coverage',
    unknown: 'Unknown',
    updated: 'Updated',
    unit: 'Unit',
    
    // Chart
    netFlow: 'Net Flow',
    total: 'Total',
    viewOnChain: 'View on-chain',
    timeRange: 'Time Range',
    chartMode: 'Chart Mode',
    
    // Proof Links
    proofLinks: 'Proof Links',
    ckbtcExplorer: 'ckBTC Explorer',
    btcBrowser: 'BTC Browser',
    addressClusters: 'Address Clusters',
    proofDescription: 'All key metrics should provide on-chain or ledger query links (demo links shown here).',
    
    // Onboarding
    howToRead: 'How to read this dashboard?',
    onboardingItems: [
      '<strong>Total Reserve</strong> shows aggregated BTC/ckBTC balance from odin.fun related addresses; unit can be switched between BTC/USD.',
      '<strong>Net Flow</strong> is inflow minus outflow; time range options: 1h/24h/7d/30d.',
      'Each key metric provides <strong>on-chain verification</strong> links for validation.',
      'When coverage is insufficient, <strong>Unknown%</strong> and yellow warning bar will be displayed.'
    ],
    
    // Address Table
    search: 'Search…',
    exportCsv: 'Export CSV',
    
    // Transaction Table
    transactions: 'Transactions',
    txHash: 'Tx Hash',
    txType: 'Type',
    userId: 'User ID',
    amount: 'Amount',
    fromAddress: 'From Address',
    toAddress: 'To Address',
    status: 'Status',
    confirmations: 'Confirmations',
    fee: 'Fee',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
    viewTransaction: 'View Transaction',
    
    // Legacy Address Table (keeping for compatibility)
    label: 'Label',
    chain: 'Chain',
    address: 'Address / Principal',
    lastActive: 'Last Active',
    inBtc: 'In (BTC)',
    outBtc: 'Out (BTC)',
    note: 'Note',
    proof: 'Proof',
    
    // Address data
    treasury: 'Official Multisig (Demo)',
    pool: 'Contract Pool (Demo)',
    external: 'External Address (Demo)',
    
    // Footer
    footer: '© 2025 BTCSight · Bitcoin Transparency Dashboard. All data are mock for UI preview.',
    
    // Alerts
    helpAlert: 'This is a demo version: showing total reserves, net flow, coverage and address clusters with on-chain verification links. Real backend API integration coming next.',
    languageAlert: 'Language switched to English.',
    refreshAlert: 'Data refreshed.',
    rangeChangeAlert: 'Time range switched to {range} (demo). Production version will fetch real data by range.',
    unknownDataExplanation: 'Unknown data refers to funds that cannot be categorized into known address clusters. This may include:\n• New unidentified addresses\n• Third-party custody addresses\n• Temporary transit addresses\n\nWe continuously update address clusters to improve coverage.',
    
    // Tooltips
    inflow: 'Inflow',
    outflow: 'Outflow',
    clickToViewAddresses: 'Click to view transactions',
    clickForDetails: 'Click for details',
    clickToRefresh: 'Click to refresh data',
    
    // Unknown Data Modal
    unknownDataTitle: 'Unknown Data Explanation',
    ofTotalReserve: 'of total reserve',
    unknownDataDescription: 'Unknown data refers to funds that cannot be categorized into known address clusters. These funds are still secure, we just cannot determine their specific attribution temporarily.',
    newAddresses: 'New Addresses',
    newAddressesDesc: 'Recently appeared addresses that have not yet been classified into existing clusters',
    thirdPartyCustody: 'Third-party Custody',
    thirdPartyCustodyDesc: 'Addresses held by exchanges or other third-party service providers',
    temporaryAddresses: 'Temporary Addresses',
    temporaryAddressesDesc: 'Temporary addresses used for fund transfers, usually emptied quickly',
    improvingCoverage: 'Continuously Improving Coverage',
    improvingCoverageDesc: 'Our team continuously monitors and analyzes new addresses, regularly updating address clusters to improve transparency.',
    understood: 'Got it'
  }
};