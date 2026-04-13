import { motion } from 'motion/react';
import type { Winner } from '../../types';
import { PRIZE_VISUAL } from '../../constants/prizes';

interface WinnerCardProps {
  winner: Winner;
  index: number;
}

export function WinnerCard({ winner, index }: WinnerCardProps) {
  const config = PRIZE_VISUAL[winner.prizeLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        padding: '16px 24px',
        background: `${config.color}10`,
        border: `1px solid ${config.color}40`,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `${config.color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: config.color,
          fontSize: '16px',
          flexShrink: 0,
        }}
      >
        {winner.employee.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px' }}>
          {winner.employee.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {winner.employee.department || winner.employee.id}
        </div>
      </div>
    </motion.div>
  );
}
