export type PrizeLevel = 'grand' | 'second' | 'third';

export type Page = 'setup' | 'lottery' | 'winners';

export type DrawPhase = 'idle' | 'spinning' | 'decelerating' | 'revealed';

export interface Employee {
  id: string;
  name: string;
  department: string;
}

export interface Winner {
  employee: Employee;
  prizeLevel: PrizeLevel;
  drawnAt: number;
}

export interface DrawHistoryEntry {
  winners: Winner[];
  prizeLevel: PrizeLevel;
  timestamp: number;
}

export interface PrizeConfig {
  label: string;
  count: number;
  color: string;
  dimColor: string;
  spinDuration: number;
  decelDuration: number;
}
