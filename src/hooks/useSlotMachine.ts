import { useState, useRef, useCallback } from 'react';
import type { Employee, PrizeLevel } from '../types';
import { PRIZE_CONFIG } from '../constants/prizes';
import { selectRandomWinners, getRandomEmployee } from '../utils/random';

export interface ColumnState {
  displayedName: string;
  displayedDept: string;
  phase: 'idle' | 'spinning' | 'decelerating' | 'stopped';
  tick: number;
}

interface UseSlotMachineOptions {
  eligible: Employee[];
  prizeLevel: PrizeLevel;
  onTick?: () => void;
  onColumnStop?: (index: number) => void;
  onAllStopped?: (winners: Employee[]) => void;
}

export function useSlotMachine({
  eligible,
  prizeLevel,
  onTick,
  onColumnStop,
  onAllStopped,
}: UseSlotMachineOptions) {
  const config = PRIZE_CONFIG[prizeLevel];
  const count = Math.min(config.count, eligible.length);

  const tickCounter = useRef(0);

  const [columns, setColumns] = useState<ColumnState[]>(() =>
    Array.from({ length: count }, () => ({
      displayedName: '',
      displayedDept: '',
      phase: 'idle' as const,
      tick: 0,
    }))
  );

  const winnersRef = useRef<Employee[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isRunningRef = useRef(false);

  const cleanup = useCallback(() => {
    intervalsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    isRunningRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current || eligible.length === 0) return;
    isRunningRef.current = true;

    const winners = selectRandomWinners(eligible, count);
    winnersRef.current = winners;

    // Initialize all columns to spinning
    setColumns(
      Array.from({ length: count }, () => ({
        displayedName: '',
        displayedDept: '',
        phase: 'spinning' as const,
        tick: ++tickCounter.current,
      }))
    );

    const { spinDuration, decelDuration } = config;
    const stagger = 800;

    // For each column, run the spin + decel sequence
    for (let col = 0; col < count; col++) {
      const colSpinEnd = spinDuration + col * stagger;
      const colTotalEnd = colSpinEnd + decelDuration;

      // Spin phase: rapid name changes
      let spinInterval = 60;
      let spinElapsed = 0;

      const doSpin = () => {
        if (!isRunningRef.current) return;
        if (spinElapsed >= colSpinEnd) {
          // Start deceleration
          startDecel(col, colSpinEnd, colTotalEnd);
          return;
        }

        const randomEmp = getRandomEmployee(eligible);
        setColumns((prev) => {
          const next = [...prev];
          next[col] = {
            ...next[col],
            displayedName: randomEmp.name,
            displayedDept: randomEmp.department,
            phase: 'spinning',
            tick: ++tickCounter.current,
          };
          return next;
        });
        onTick?.();
        spinElapsed += spinInterval;
        const id = setTimeout(doSpin, spinInterval);
        intervalsRef.current.push(id);
      };

      const id = setTimeout(doSpin, col * 30);
      intervalsRef.current.push(id);
    }

    function startDecel(col: number, _spinEnd: number, totalEnd: number) {
      setColumns((prev) => {
        const next = [...prev];
        next[col] = { ...next[col], phase: 'decelerating' };
        return next;
      });

      let interval = 80;
      let elapsed = 0;
      const decelTime = totalEnd - _spinEnd;

      // Include the winner in the last few swaps
      const doDecel = () => {
        if (!isRunningRef.current) return;

        if (elapsed >= decelTime || interval > 800) {
          // Stop on winner
          setColumns((prev) => {
            const next = [...prev];
            next[col] = {
              displayedName: winners[col].name,
              displayedDept: winners[col].department,
              phase: 'stopped',
              tick: ++tickCounter.current,
            };
            return next;
          });
          onColumnStop?.(col);

          // Check if all columns stopped
          setTimeout(() => {
            setColumns((prev) => {
              const allStopped = prev.every((c) => c.phase === 'stopped');
              if (allStopped && isRunningRef.current) {
                isRunningRef.current = false;
                onAllStopped?.(winnersRef.current);
              }
              return prev;
            });
          }, 100);
          return;
        }

        // Show a mix: mostly random but occasionally the winner near the end
        const showWinner = elapsed > decelTime * 0.7 && Math.random() > 0.5;
        const emp = showWinner ? winners[col] : getRandomEmployee(eligible);

        setColumns((prev) => {
          const next = [...prev];
          next[col] = {
            ...next[col],
            displayedName: emp.name,
            displayedDept: emp.department,
            tick: ++tickCounter.current,
          };
          return next;
        });
        onTick?.();

        elapsed += interval;
        interval = Math.min(interval * 1.25, 1000);
        const id = setTimeout(doDecel, interval);
        intervalsRef.current.push(id);
      };

      doDecel();
    }
  }, [eligible, count, config, onTick, onColumnStop, onAllStopped]);

  const reset = useCallback(() => {
    cleanup();
    setColumns(
      Array.from({ length: count }, () => ({
        displayedName: '',
        displayedDept: '',
        phase: 'idle' as const,
        tick: 0,
      }))
    );
    winnersRef.current = [];
  }, [cleanup, count]);

  return { columns, start, reset, winners: winnersRef.current };
}
