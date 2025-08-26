import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

export const FAQCard: React.FC = () => {
  const { t, language } = useTranslation();
  const { theme } = useTheme();

  const faqData = {
    zh: [
      {
        question: "什么是BTCSight？",
        answer: "BTCSight是一个比特币透明度仪表板，提供实时的BTC/ckBTC资金流向监控、地址簇分析和链上数据验证功能。"
      },
      {
        question: "如何理解\"总存量\"指标？",
        answer: "总存量显示所有已识别地址的BTC/ckBTC余额总和。您可以在BTC和USD之间切换显示单位，数据每小时更新一次。"
      },
      {
        question: "净流是什么意思？",
        answer: "净流 = 流入资金 - 流出资金。正值表示资金净流入，负值表示资金净流出。支持查看24小时和7天的净流数据。"
      },
      {
        question: "覆盖率不足100%是什么原因？",
        answer: "覆盖率反映已识别地址占总资金的比例。未覆盖部分可能包括：新出现的地址、第三方托管地址、临时中转地址等。我们持续更新地址库以提高覆盖率。"
      },
      {
        question: "如何验证数据的真实性？",
        answer: "每个关键指标都提供链上验证链接，包括ckBTC浏览器、BTC区块浏览器等。您可以点击验证链接直接查看原始链上数据。"
      },
      {
        question: "地址簇是如何分类的？",
        answer: "地址簇按功能和归属进行分类，如官方多签、合约池、交易所地址等。每个地址都标注了最后活跃时间、流入流出金额和相关证明链接。"
      }
    ],
    en: [
      {
        question: "What is BTCSight?",
        answer: "BTCSight is a Bitcoin transparency dashboard that provides real-time BTC/ckBTC fund flow monitoring, address cluster analysis, and on-chain data verification."
      },
      {
        question: "How to understand the 'Total Reserve' metric?",
        answer: "Total Reserve shows the sum of BTC/ckBTC balances across all identified addresses. You can switch between BTC and USD units, with data updated hourly."
      },
      {
        question: "What does Net Flow mean?",
        answer: "Net Flow = Inflow - Outflow. Positive values indicate net inflow, negative values indicate net outflow. Supports viewing 24-hour and 7-day net flow data."
      },
      {
        question: "Why is coverage less than 100%?",
        answer: "Coverage reflects the proportion of total funds in identified addresses. Uncovered portions may include: newly appeared addresses, third-party custody addresses, temporary transit addresses, etc. We continuously update our address database to improve coverage."
      },
      {
        question: "How to verify data authenticity?",
        answer: "Each key metric provides on-chain verification links, including ckBTC explorer, BTC block explorer, etc. You can click verification links to directly view raw on-chain data."
      },
      {
        question: "How are address clusters classified?",
        answer: "Address clusters are classified by function and ownership, such as official multisig, contract pools, exchange addresses, etc. Each address is labeled with last active time, inflow/outflow amounts, and related proof links."
      }
    ]
  };

  const currentFAQ = faqData[language] || faqData.zh;

  return (
    <div className={`border rounded-2xl p-6 ${
      theme === 'dark'
        ? 'bg-[#0e1116] border-white/10'
        : 'bg-white/80 border-slate-200/60 shadow-lg backdrop-blur-sm'
    }`}>
      <div className="text-center mb-6">
        <div className="relative">
          {/* 主题色渐变背景线 */}
          <div className={`h-px w-full ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent'
          }`}></div>
          
          {/* 标题容器 */}
          <div className="relative -mt-3 flex justify-center">
            <div className={`px-6 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#0e1116] border-[#10B981]/20'
                : 'bg-white border-[#10B981]/15'
            }`}>
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>常见问题</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {currentFAQ.map((item, index) => (
          <div key={index} className={`border rounded-xl p-4 transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                Q{index + 1}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{item.question}</h4>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                }`}>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-6 p-4 rounded-xl border ${
        theme === 'dark'
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50/80 border-blue-200/60 shadow-sm backdrop-blur-sm'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg ${
            theme === 'dark' ? 'bg-blue-400/20' : 'bg-blue-100'
          }`}>
            <HelpCircle className={`w-4 h-4 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>需要更多帮助？</p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
            }`}>
              如有其他问题，请通过验证链接查看详细的链上数据，或联系技术支持团队。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};