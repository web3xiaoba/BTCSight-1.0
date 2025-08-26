import React from 'react';
import { X, AlertTriangle, Eye, Shield, Clock, HelpCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

interface UnknownDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  unknownPct: number;
}

export const UnknownDataModal: React.FC<UnknownDataModalProps> = ({
  isOpen,
  onClose,
  unknownPct
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`border rounded-2xl max-w-md w-full shadow-2xl ${
        theme === 'dark'
          ? 'bg-[#0e1116] border-white/20'
          : 'bg-white border-gray-300'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{t('unknownDataTitle')}</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-600'
              }`}>{unknownPct}% {t('ofTotalReserve')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-500'
            }`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className={`leading-relaxed ${
            theme === 'dark' ? 'text-white/80' : 'text-gray-700'
          }`}>
            {t('unknownDataDescription')}
          </p>

          <div className="space-y-3">
            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <Eye className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{t('newAddresses')}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                }`}>{t('newAddressesDesc')}</div>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{t('thirdPartyCustody')}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                }`}>{t('thirdPartyCustodyDesc')}</div>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{t('temporaryAddresses')}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                }`}>{t('temporaryAddressesDesc')}</div>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            theme === 'dark'
              ? 'bg-blue-500/10 border-blue-500/20'
              : 'bg-blue-50/80 border-blue-200/60 shadow-sm backdrop-blur-sm'
          }`}>
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className={`font-medium text-sm mb-1 ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>{t('improvingCoverage')}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-blue-200/80' : 'text-blue-600'
                }`}>{t('improvingCoverageDesc')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            {t('understood')}
          </button>
        </div>
      </div>
    </div>
  );
};