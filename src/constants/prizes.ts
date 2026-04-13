import type { PrizeLevel } from '../types';

export interface PrizeVisualConfig {
  label: string;
  color: string;
  dimColor: string;
  spinDuration: number;
  decelDuration: number;
}

export const PRIZE_VISUAL: Record<PrizeLevel, PrizeVisualConfig> = {
  grand: {
    label: 'Grand Prize',
    color: '#FFD700',
    dimColor: 'rgba(255, 215, 0, 0.15)',
    spinDuration: 3000,
    decelDuration: 4000,
  },
  second: {
    label: 'Second Prize',
    color: '#C0C0C0',
    dimColor: 'rgba(192, 192, 192, 0.15)',
    spinDuration: 2500,
    decelDuration: 3000,
  },
  third: {
    label: 'Third Prize',
    color: '#CD7F32',
    dimColor: 'rgba(205, 127, 50, 0.15)',
    spinDuration: 2000,
    decelDuration: 2000,
  },
};

export const DEFAULT_PRIZE_COUNTS: Record<PrizeLevel, number> = {
  grand: 1,
  second: 3,
  third: 5,
};

export const PRIZE_ORDER: PrizeLevel[] = ['third', 'second', 'grand'];
