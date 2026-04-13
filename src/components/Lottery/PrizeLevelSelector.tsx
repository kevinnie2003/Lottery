import { motion } from 'motion/react';
import type { PrizeLevel } from '../../types';
import { PRIZE_CONFIG, PRIZE_ORDER } from '../../constants/prizes';
import { useLotteryStore } from '../../hooks/useLotteryStore';

interface PrizeLevelSelectorProps {
  disabled?: boolean;
}

export function PrizeLevelSelector({ disabled }: PrizeLevelSelectorProps) {
  const currentLevel = useLotteryStore((s) => s.currentPrizeLevel);
  const setLevel = useLotteryStore((s) => s.setCurrentPrizeLevel);
  const getRemainingSlots = useLotteryStore((s) => s.getRemainingSlots);
  const isLevelComplete = useLotteryStore((s) => s.isLevelComplete);

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
        const config = PRIZE_CONFIG[level];
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
              border: `2px solid ${isSelected ? config.color : complete ? 'var(--border)' : 'var(--border)'}`,
              background: isSelected
                ? `${config.color}20`
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
                color: isSelected ? config.color : complete ? 'var(--text-muted)' : 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              {config.label}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: complete ? 'var(--text-muted)' : 'var(--text-secondary)',
              }}
            >
              {complete ? 'Complete' : `${remaining} of ${config.count} remaining`}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
