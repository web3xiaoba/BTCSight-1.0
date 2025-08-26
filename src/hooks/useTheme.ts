import { useState, useCallback } from 'react';

export type Theme = 'dark' | 'light';

// 创建全局状态
let globalTheme: Theme = 'dark';
let globalSetTheme: ((theme: Theme) => void) | null = null;
const subscribers: (() => void)[] = [];

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(globalTheme);

  // 注册订阅者
  const forceUpdate = useCallback(() => {
    setTheme(globalTheme);
  }, []);

  // 订阅全局状态变化
  if (!subscribers.includes(forceUpdate)) {
    subscribers.push(forceUpdate);
  }

  // 设置全局状态更新函数
  if (!globalSetTheme) {
    globalSetTheme = (newTheme: Theme) => {
      globalTheme = newTheme;
      subscribers.forEach(callback => callback());
    };
  }

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    if (globalSetTheme) {
      globalSetTheme(newTheme);
    }
  }, [theme]);

  return { theme, toggleTheme };
};