import { useState, useCallback } from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';

// 创建全局状态
let globalLanguage: Language = 'zh';
let globalSetLanguage: ((lang: Language) => void) | null = null;
const subscribers: (() => void)[] = [];

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(globalLanguage);

  // 注册订阅者
  const forceUpdate = useCallback(() => {
    setLanguage(globalLanguage);
  }, []);

  // 订阅全局状态变化
  if (!subscribers.includes(forceUpdate)) {
    subscribers.push(forceUpdate);
  }

  // 设置全局状态更新函数
  if (!globalSetLanguage) {
    globalSetLanguage = (newLang: Language) => {
      globalLanguage = newLang;
      subscribers.forEach(callback => callback());
    };
  }

  const t = useCallback((key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string' && !Array.isArray(value)) {
      return key; // Return key if translation not found
    }
    
    // Handle array values (like onboardingItems)
    if (Array.isArray(value)) {
      return value;
    }
    
    // Replace parameters in translation
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, replacement]) => str.replace(`{${param}}`, replacement),
        value
      );
    }
    
    return value;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    if (globalSetLanguage) {
      globalSetLanguage(newLanguage);
    }
  }, [language]);

  return { language, t, toggleLanguage };
};