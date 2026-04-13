import { motion } from 'motion/react';
import type { PrizeLevel } from '../../types';
import { PRIZE_VISUAL, PRIZE_ORDER } from '../../constants/prizes';
import { useLotteryStore } from '../../hooks/useLotteryStore';

interface PrizeLevelSelectorProps {
  disabled?: boolean;
}

export function PrizeLevelSelector({ disabled }: PrizeLevelSelectorProps) {
  const currentLevel = useLotteryStore((s) => s.currentPrizeLevel);
  const setLevel = useLotteryStore((s) => s.setCurrentPrizeLevel);
  const getRemainingSlots = useLotteryStore((s) => s.getRemainingSlots);
  const isLevelComplete = useLotteryStore((s) => s.isLevelComplete);
  const prizeCounts = useLotteryStore((s) => s.prizeCounts);

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {PRIZE_ORDER.map((level: PrizeLevel) => {
        const visual = PRIZE_VISUAL[level];
        const count = prizeCounts[level];
        const remaining = getRemainingSlots(level);
        const complete = isLevelComplete(level);
        const isSelected = currentLevel === level;

        return (
          <motion.button
            key={level}
            whileHover={!disabled && !complete ? { scale: 1.03 } : {}}
            whileTap={!disabled && !complete ? { scale: 0.97 } : {}}
            onClick={() => !disabled && !complete && setLevel(level)}
            disabled={disabled || complete}
            style={{
              padding: '16px 28px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${isSelected ? visual.color : 'var(--border)'}`,
              background: isSelected
                ? `${visual.color}20`
                : complete
                  ? 'var(--bg-secondary)'
                  : 'var(--bg-card)',
              cursor: disabled || complete ? 'default' : 'pointer',
              opacity: complete ? 0.5 : 1,
              transition: 'all 0.2s',
              minWidth: '160px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: isSelected ? visual.color : complete ? 'var(--text-muted)' : 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              {visual.label}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: complete ? 'var(--text-muted)' : 'var(--text-secondary)',
              }}
            >
              {complete ? 'Complete' : `${remaining} of ${count} remaining`}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
