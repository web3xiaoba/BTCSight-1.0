import { useState, useCallback } from 'react';
import { Unit } from '../types';

// 创建全局状态
let globalUnit: Unit = 'BTC';
let globalSetUnit: ((unit: Unit) => void) | null = null;
const subscribers: (() => void)[] = [];

export const useCurrency = () => {
  const [unit, setUnit] = useState<Unit>(globalUnit);

  // 注册订阅者
  const forceUpdate = useCallback(() => {
    setUnit(globalUnit);
  }, []);

  // 订阅全局状态变化
  if (!subscribers.includes(forceUpdate)) {
    subscribers.push(forceUpdate);
  }

  // 设置全局状态更新函数
  if (!globalSetUnit) {
    globalSetUnit = (newUnit: Unit) => {
      globalUnit = newUnit;
      subscribers.forEach(callback => callback());
    };
  }

  const setGlobalUnit = useCallback((newUnit: Unit) => {
    if (globalSetUnit) {
      globalSetUnit(newUnit);
    }
  }, []);

  return { unit, setUnit: setGlobalUnit };
};