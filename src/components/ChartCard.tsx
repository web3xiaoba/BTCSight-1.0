import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Interaction
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { SeriesData, ChartMode, ChartRange } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../hooks/useTheme';
import { generateSeries } from '../data/mockData';

// 深色模式十字线插件
const darkCrosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw: (chart: any, args: any, options: any) => {
    if (chart.tooltip?._active?.length) {
      const ctx = chart.ctx;
      const activePoint = chart.tooltip._active[0];
      const x = activePoint.element.x;
      const y = activePoint.element.y;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      const leftX = chart.scales.x.left;
      const rightX = chart.scales.x.right;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';  // 深色模式：半透明白色
      ctx.lineWidth = 1;
      
      // 垂直线
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      
      // 水平线
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      
      ctx.stroke();
      ctx.restore();
    }
  }
};

// 浅色模式十字线插件
const lightCrosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw: (chart: any, args: any, options: any) => {
    if (chart.tooltip?._active?.length) {
      const ctx = chart.ctx;
      const activePoint = chart.tooltip._active[0];
      const x = activePoint.element.x;
      const y = activePoint.element.y;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      const leftX = chart.scales.x.left;
      const rightX = chart.scales.x.right;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';  // 浅色模式：半透明黑色
      ctx.lineWidth = 1;
      
      // 垂直线
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      
      // 水平线
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      
      ctx.stroke();
      ctx.restore();
    }
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  seriesNet: SeriesData[];
  seriesTotal: SeriesData[];
  mode: ChartMode;
  range: ChartRange;
  onModeChange: (mode: ChartMode) => void;
  onRangeChange: (range: ChartRange) => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  seriesNet,
  seriesTotal,
  mode,
  range,
  onModeChange,
  onRangeChange,
}) => {
  const { t } = useTranslation();
  const { unit } = useCurrency();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = React.useState(false);
  const [localSeriesNet, setLocalSeriesNet] = React.useState<SeriesData[]>(seriesNet);
  const [localSeriesTotal, setLocalSeriesTotal] = React.useState<SeriesData[]>(seriesTotal);
  const [chartRef, setChartRef] = React.useState<any>(null);
  const [hoveredDataIndex, setHoveredDataIndex] = React.useState<number | null>(null);
  const [chartKey, setChartKey] = React.useState(0);

  // 根据主题选择合适的十字线插件
  const crosshairPlugin = React.useMemo(() => {
    return theme === 'dark' ? darkCrosshairPlugin : lightCrosshairPlugin;
  }, [theme]);

  // 当主题切换时，强制重新渲染图表
  React.useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [theme]);

  // 当范围变化时，生成新的图表数据（不刷新整个页面）
  React.useEffect(() => {
    console.log('📊 ChartCard: useEffect 触发，范围:', range);
    console.log('📊 ChartCard: 当前 seriesNet 长度:', seriesNet.length);
    console.log('📊 ChartCard: 当前 seriesTotal 长度:', seriesTotal.length);
    
    // 立即生成新数据，无需等待API
    const days = getDaysFromRange(range);
    const newNetData = generateSeries(days, 'netflow', range);
    const newTotalData = generateSeries(days, 'total', range);
    
    // 添加时间变化因子，让数据更真实
    const timeVariation = Math.sin(Date.now() / 100000) * 0.1;
    const enhancedNetData = newNetData.map(d => ({
      ...d,
      value: d.value + timeVariation * (Math.random() - 0.5) * 2
    }));
    const enhancedTotalData = newTotalData.map(d => ({
      ...d,
      value: d.value + timeVariation * 10
    }));
    
    setLocalSeriesNet(enhancedNetData);
    setLocalSeriesTotal(enhancedTotalData);
    setHoveredDataIndex(null); // 重置悬停状态
    
    console.log('✅ ChartCard: 图表数据已更新，净流数据点:', enhancedNetData.length, '总量数据点:', enhancedTotalData.length);
    console.log('📈 ChartCard: 净流数据示例:', enhancedNetData.slice(0, 3));
    console.log('📈 ChartCard: 总量数据示例:', enhancedTotalData.slice(0, 3));
  }, [range]);

  // 当外部数据更新时，同步到本地状态
  React.useEffect(() => {
    console.log('📊 ChartCard: 外部 seriesNet 数据更新:', seriesNet.length, '个数据点');
    setLocalSeriesNet(seriesNet);
  }, [seriesNet]);

  React.useEffect(() => {
    console.log('📊 ChartCard: 外部 seriesTotal 数据更新:', seriesTotal.length, '个数据点');
    setLocalSeriesTotal(seriesTotal);
  }, [seriesTotal]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const data = mode === 'net' ? localSeriesNet : localSeriesTotal;
  const label = mode === 'net' ? `${t('netFlow')} (${unit})` : `${t('total')} (${unit})`;
  
  // Calculate current info based on hovered data index
  const currentInfo = React.useMemo(() => {
    if (hoveredDataIndex === null || !data[hoveredDataIndex]) return null;
    
    const dataPoint = data[hoveredDataIndex];
    return {
      date: new Date(dataPoint.ts).toLocaleDateString(),
      value: dataPoint.value
    };
  }, [hoveredDataIndex, data]);

  // Calculate display info for the tooltip
  const displayInfo = React.useMemo(() => {
    if (!currentInfo) return null;
    
    const value = currentInfo.value;
    let formattedValue: string;
    let label: string;
    
    if (mode === 'net') {
      label = value >= 0 ? '流入' : '流出';
      if (unit === 'USD') {
        formattedValue = '$' + Math.abs(value * 61500).toLocaleString();
      } else {
        formattedValue = Math.abs(value).toFixed(4) + ' BTC';
      }
    } else {
      label = '余额';
      if (unit === 'USD') {
        formattedValue = '$' + (value * 61500).toLocaleString();
      } else {
        formattedValue = value.toFixed(4) + ' BTC';
      }
    }
    
    return { label, value: formattedValue };
  }, [currentInfo, mode, unit]);

  console.log('📊 ChartCard: 渲染图表，模式:', mode, '数据点数量:', data.length);
  console.log('📊 ChartCard: 数据示例:', data.slice(0, 3));
  

  // For net flow, use different colors for positive and negative values
  // Create gradient for total mode
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(57, 97, 251, 0.6)');   // 顶部：60% 透明度
    gradient.addColorStop(0.2, 'rgba(57, 97, 251, 0.4)'); // 上部：40% 透明度
    gradient.addColorStop(0.6, 'rgba(57, 97, 251, 0.15)'); // 中部：15% 透明度
    gradient.addColorStop(1, 'rgba(57, 97, 251, 0)');      // 底部：完全透明
    return gradient;
  };

  const getBarColors = () => {
    if (mode === 'net') {
      return data.map(d => d.value >= 0 
        ? 'rgba(34,197,94,0.9)'  // Green for positive (inflow)
        : 'rgba(239,68,68,0.9)'  // Red for negative (outflow)
      );
    }
    // For total mode, we'll use gradient in the chart data
    return 'rgba(57,97,251,0.9)'; // Blue for total
  };
  
  const getBorderColors = () => {
    if (mode === 'net') {
      return data.map(d => d.value >= 0 
        ? 'rgba(34,197,94,1)'    // Green border for positive
        : 'rgba(239,68,68,1)'    // Red border for negative
      );
    }
    return 'rgba(57,97,251,1)'; // Blue border for total
  };

  const chartData = {
    labels: data.map(d => d.ts),
    datasets: [{
      label,
      data: data.map(d => {
        // Convert BTC to USD if needed
        if (unit === 'USD' && mode === 'net') {
          return +(d.value * 61500).toFixed(0); // Convert BTC to USD
        } else if (unit === 'USD' && mode === 'total') {
          return +(d.value * 61500).toFixed(0); // Convert BTC to USD
        }
        return d.value;
      }),
      backgroundColor: function(context: any) {
        if (mode === 'net') {
          return getBarColors();
        } else {
          // 为总量模式创建渐变
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          
          if (!chartArea) {
            return 'rgba(57, 97, 251, 0.3)';
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(57, 97, 251, 0.6)');
          gradient.addColorStop(0.3, 'rgba(57, 97, 251, 0.4)');
          gradient.addColorStop(0.7, 'rgba(57, 97, 251, 0.1)');
          gradient.addColorStop(1, 'rgba(57, 97, 251, 0)');
          
          return gradient;
        }
      },
      borderColor: mode === 'net' ? getBorderColors() : 'rgba(57, 97, 251, 1)',
      borderWidth: 2,
      tension: 0.4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' 
          ? 'rgba(14, 17, 22, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#ffffff' : '#1f2937',
        bodyColor: theme === 'dark' ? '#ffffff' : '#1f2937',
        borderColor: theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        cornerRadius: 16,
        displayColors: false,
        padding: 20,
        titleFont: {
          size: 13,
          weight: '600',
          family: 'system-ui, -apple-system, sans-serif'
        },
        bodyFont: {
          size: 15,
          weight: '700',
          family: 'system-ui, -apple-system, sans-serif'
        },
        titleMarginBottom: 12,
        xAlign: 'center',
        yAlign: 'top',
        caretSize: 6,
        caretPadding: 10,
        // 添加阴影效果
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 12,
        shadowColor: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.4)' 
          : 'rgba(0, 0, 0, 0.1)',
        callbacks: {
          title: function(context: any) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\//g, '/');
          },
          label: function(context: any) {
            const value = context.raw;
            let dataColor = '';
            
            if (mode === 'net') {
              if (unit === 'USD') {
                dataColor = value >= 0 ? '#22c55e' : '#ef4444';
                return `流入: $${Math.abs(value).toLocaleString()}`;
              } else {
                dataColor = value >= 0 ? '#22c55e' : '#ef4444';
                return `${value >= 0 ? '流入' : '流出'}: ${Math.abs(value).toFixed(4)} BTC`;
              }
            } else {
              if (unit === 'USD') {
                dataColor = '#3b82f6';
                return `余额: $${value.toLocaleString()}`;
              } else {
                dataColor = '#3b82f6';
                return `余额: ${value.toFixed(4)} BTC`;
              }
            }
          },
          labelColor: function(context: any) {
            const value = context.raw;
            if (mode === 'net') {
              if (value >= 0) {
                // 流入 - 绿色
                return {
                  borderColor: 'rgba(34, 197, 94, 0.8)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  borderWidth: 2,
                  borderRadius: 4
                };
              } else {
                // 流出 - 红色
                return {
                  borderColor: 'rgba(239, 68, 68, 0.8)',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  borderWidth: 2,
                  borderRadius: 4
                };
              }
            } else {
              // 总量 - 蓝色
              return {
                borderColor: 'rgba(59, 130, 246, 0.8)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                borderRadius: 4
              };
            }
          },
          labelTextColor: function(context: any) {
            const value = context.raw;
            if (mode === 'net') {
              return value >= 0 ? '#22c55e' : '#ef4444';
            } else {
              return '#3b82f6';
            }
          },
          labelTextColor: function(context: any) {
            const value = context.raw;
            if (mode === 'net') {
              return value >= 0 ? '#22c55e' : '#ef4444';
            } else {
              return '#3b82f6';
            }
          },
          multiKeyBackground: 'transparent'
        }
      }
    },
    onHover: (event: any, elements: any[]) => {
      // 更改鼠标样式
      if (event.native && event.native.target) {
        event.native.target.style.cursor = elements.length > 0 ? 'crosshair' : 'default';
      }
      if (elements.length > 0) {
        setHoveredDataIndex(elements[0].index);
      } else {
        setHoveredDataIndex(null);
      }
    },
    elements: {
      point: {
        radius: mode === 'total' ? 0 : 0,
        hoverRadius: mode === 'total' ? 6 : 0,
      },
      line: {
        tension: 0.4,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      x: {
        ticks: { 
          color: '#9ca3af',
          font: { size: isMobile ? 10 : 12 },
          maxRotation: isMobile ? 45 : 0,
          maxTicksLimit: isMobile ? 6 : 12,
        },
        grid: { 
          color: 'rgba(255,255,255,0.06)',
          lineWidth: 0.5,
        }
      },
      y: {
        grid: { 
          display: true, // 净流和总量模式都显示横向辅助线
          color: 'rgba(255,255,255,0.1)',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: isMobile ? 10 : 12 },
          maxTicksLimit: isMobile ? 5 : 8,
          callback: function(value: any) {
            if (unit === 'USD') {
              const num = Number(value);
              if (isMobile && Math.abs(num) >= 1000000) {
                return '$' + (num / 1000000).toFixed(1) + 'M';
              } else if (isMobile && Math.abs(num) >= 1000) {
                return '$' + (num / 1000).toFixed(1) + 'K';
              }
              return '$' + num.toLocaleString();
            }
            const num = Number(value);
            if (isMobile && Math.abs(num) >= 1000) {
              return num.toFixed(1);
            }
            return num.toFixed(4);
          }
        }
      }
    }
  };

  const ranges: ChartRange[] = ['1h', '24h', '7d', '30d', '90d', '180d', '1Y', 'All'];

  return (
    <div className={`border rounded-xl p-4 ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      {/* Mobile Layout */}
      <div className="block md:hidden space-y-3 mb-4">
        {/* Time Range Selector - Mobile */}
        <div className="space-y-2">
          <div className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>{t('timeRange') || '时间范围'}</div>
          <div className={`grid grid-cols-4 gap-1 rounded-lg p-1 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
          }`}>
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                  range === r
                    ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white font-medium'
                    : theme === 'dark'
                      ? 'text-white/70 hover:bg-white/10'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart Mode Selector - Mobile */}
        <div className="space-y-2">
          <div className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
          }`}>{t('chartMode') || '图表模式'}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onModeChange('net')}
              className={`flex-1 py-2.5 px-4 text-sm rounded-lg transition-colors ${
                mode === 'net'
                  ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                  : theme === 'dark'
                    ? 'bg-white/6 border border-white/10 text-white/70'
                    : 'bg-gray-100 border border-gray-200 text-gray-600'
              }`}
            >
              {t('netFlow')}
            </button>
            <button
              onClick={() => onModeChange('total')}
              className={`flex-1 py-2.5 px-4 text-sm rounded-lg transition-colors ${
                mode === 'total'
                  ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                  : theme === 'dark'
                    ? 'bg-white/6 border border-white/10 text-white/70'
                    : 'bg-gray-100 border border-gray-200 text-gray-600'
              }`}
            >
              {t('total')}
            </button>
          </div>
        </div>
        
        {/* On-chain Link - Mobile */}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block mb-4">
        {/* 控制选项 */}
        <div className="flex items-center justify-between mb-4">
          {/* 图表模式选择器 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onModeChange('net')}
              className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                mode === 'net'
                  ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                  : theme === 'dark'
                    ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                    : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('netFlow')}
            </button>
            <button
              onClick={() => onModeChange('total')}
              className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                mode === 'total'
                  ? 'bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white'
                  : theme === 'dark'
                    ? 'bg-white/6 border border-white/10 text-white/70 hover:bg-white/10'
                    : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('total')}
            </button>
          </div>
          
          {/* 时间范围选择器 - 分两行显示 */}
          <div className={`rounded-lg overflow-hidden flex ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
          }`}>
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-2.5 py-1.5 text-sm transition-colors whitespace-nowrap ${
                  range === r
                    ? theme === 'dark'
                      ? 'font-semibold bg-white/10 text-white'
                      : 'font-semibold bg-white text-gray-900'
                    : theme === 'dark'
                      ? 'text-white/70 hover:bg-white/10'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative">
        
        {/* 图表区域 */}
        <div className="h-48 sm:h-56 md:h-64 lg:h-72 relative" style={{ cursor: 'default' }}>
          {mode === 'net' ? (
            <Bar 
              key={`bar-${chartKey}`}
              ref={setChartRef}
              data={chartData} 
              options={options}
              plugins={[crosshairPlugin]}
            />
          ) : (
            <Line 
              key={`line-${chartKey}`}
              ref={setChartRef}
              data={chartData} 
              options={options}
              plugins={[crosshairPlugin]}
            />
          )}
          
          {/* Logo水印 - 调整到更合适的位置 */}
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#3961FB] via-[#6344FF] to-[#8B5CF6]">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z" />
                  <path d="M12 7C10.34 7 9 8.34 9 10S10.34 13 12 13S15 11.66 15 10S13.66 7 12 7Z" fill="white" opacity="0.8" />
                </svg>
              </div>
              <span className={`text-sm font-bold tracking-wide ${
                theme === 'dark' ? 'text-white/40' : 'text-gray-400'
              }`}>
                BTCSight
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// 工具函数
function getDaysFromRange(range: ChartRange): number {
  switch (range) {
    case '1h': return 1;
    case '24h': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '180d': return 180;
    case '1Y': return 365;
    case 'All': return 730;
    default: return 7;
  }
}