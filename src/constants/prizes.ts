import type { PrizeConfig, PrizeLevel } from '../types';

export const PRIZE_CONFIG: Record<PrizeLevel, PrizeConfig> = {
  grand: {
    label: 'Grand Prize',
    count: 1,
    color: '#FFD700',
    dimColor: 'rgba(255, 215, 0, 0.15)',
    spinDuration: 3000,
    decelDuration: 4000,
  },
  second: {
    label: 'Second Prize',
    count: 3,
    color: '#C0C0C0',
    dimColor: 'rgba(192, 192, 192, 0.15)',
    spinDuration: 2500,
    decelDuration: 3000,
  },
  third: {
    label: 'Third Prize',
    count: 5,
    color: '#CD7F32',
    dimColor: 'rgba(205, 127, 50, 0.15)',
    spinDuration: 2000,
    decelDuration: 2000,
  },
} as const;

export const PRIZE_ORDER: PrizeLevel[] = ['third', 'second', 'grand'];

export const TOTAL_WINNERS = Object.values(PRIZE_CONFIG).reduce(
  (sum, cfg) => sum + cfg.count,
  0
);
