import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Winner, DrawHistoryEntry, PrizeLevel, Page, DrawPhase } from '../types';
import { PRIZE_CONFIG } from '../constants/prizes';

interface LotteryState {
  // Navigation
  currentPage: Page;
  setPage: (page: Page) => void;

  // Employee data
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  clearEmployees: () => void;

  // Winners
  winners: Winner[];
  drawHistory: DrawHistoryEntry[];

  // Draw state (transient)
  currentPrizeLevel: PrizeLevel;
  drawPhase: DrawPhase;
  currentDrawWinners: Employee[];

  // Actions
  setCurrentPrizeLevel: (level: PrizeLevel) => void;
  setDrawPhase: (phase: DrawPhase) => void;
  completeDraw: (drawnEmployees: Employee[]) => void;
  undoLastDraw: () => void;
  resetAll: () => void;

  // Selectors
  getEligibleEmployees: () => Employee[];
  getWinnersByLevel: (level: PrizeLevel) => Winner[];
  getRemainingSlots: (level: PrizeLevel) => number;
  isLevelComplete: (level: PrizeLevel) => boolean;
  isAllComplete: () => boolean;
}

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'setup',
      setPage: (page) => set({ currentPage: page }),

      // Employee data
      employees: [],
      setEmployees: (employees) => set({ employees, currentPage: 'lottery' }),
      clearEmployees: () => set({
        employees: [],
        winners: [],
        drawHistory: [],
        currentPage: 'setup',
        drawPhase: 'idle',
        currentDrawWinners: [],
      }),

      // Winners
      winners: [],
      drawHistory: [],

      // Draw state
      currentPrizeLevel: 'third',
      drawPhase: 'idle',
      currentDrawWinners: [],

      // Actions
      setCurrentPrizeLevel: (level) => set({ currentPrizeLevel: level }),
      setDrawPhase: (phase) => set({ drawPhase: phase }),

      completeDraw: (drawnEmployees) => {
        const state = get();
        const newWinners: Winner[] = drawnEmployees.map((emp) => ({
          employee: emp,
          prizeLevel: state.currentPrizeLevel,
          drawnAt: Date.now(),
        }));

        const entry: DrawHistoryEntry = {
          winners: newWinners,
          prizeLevel: state.currentPrizeLevel,
          timestamp: Date.now(),
        };

        set({
          winners: [...state.winners, ...newWinners],
          drawHistory: [...state.drawHistory, entry],
          drawPhase: 'revealed',
          currentDrawWinners: drawnEmployees,
        });
      },

      undoLastDraw: () => {
        const state = get();
        const history = [...state.drawHistory];
        const lastDraw = history.pop();
        if (!lastDraw) return;

        const removedIds = new Set(lastDraw.winners.map((w) => w.employee.id));
        set({
          winners: state.winners.filter((w) => !removedIds.has(w.employee.id)),
          drawHistory: history,
          drawPhase: 'idle',
          currentDrawWinners: [],
          currentPrizeLevel: lastDraw.prizeLevel,
        });
      },

      resetAll: () => set({
        employees: [],
        winners: [],
        drawHistory: [],
        currentPage: 'setup',
        currentPrizeLevel: 'third',
        drawPhase: 'idle',
        currentDrawWinners: [],
      }),

      // Selectors
      getEligibleEmployees: () => {
        const state = get();
        const winnerIds = new Set(state.winners.map((w) => w.employee.id));
        return state.employees.filter((e) => !winnerIds.has(e.id));
      },

      getWinnersByLevel: (level) => {
        return get().winners.filter((w) => w.prizeLevel === level);
      },

      getRemainingSlots: (level) => {
        const state = get();
        const drawn = state.winners.filter((w) => w.prizeLevel === level).length;
        return PRIZE_CONFIG[level].count - drawn;
      },

      isLevelComplete: (level) => {
        return get().getRemainingSlots(level) <= 0;
      },

      isAllComplete: () => {
        const state = get();
        return (
          state.isLevelComplete('grand') &&
          state.isLevelComplete('second') &&
          state.isLevelComplete('third')
        );
      },
    }),
    {
      name: 'lottery-storage',
      partialize: (state) => ({
        employees: state.employees,
        winners: state.winners,
        drawHistory: state.drawHistory,
        currentPrizeLevel: state.currentPrizeLevel,
        currentPage: state.currentPage,
      }),
    }
  )
);
