import { motion } from 'motion/react';
import type { DrawPhase } from '../../types';

interface DrawButtonProps {
  phase: DrawPhase;
  onDraw: () => void;
  disabled?: boolean;
}

export function DrawButton({ phase, onDraw, disabled }: DrawButtonProps) {
  if (phase === 'revealed') return null;

  const isSpinning = phase === 'spinning' || phase === 'decelerating';

  return (
    <motion.button
      whileHover={!isSpinning && !disabled ? { scale: 1.05 } : {}}
      whileTap={!isSpinning && !disabled ? { scale: 0.95 } : {}}
      onClick={onDraw}
      disabled={isSpinning || disabled}
      className="btn btn-gold btn-lg"
      style={{
        minWidth: '220px',
        fontSize: '22px',
        padding: '18px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isSpinning ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block' }}
          >
            &#9733;
          </motion.span>
          Drawing...
        </span>
      ) : (
        'Start Draw'
      )}
    </motion.button>
  );
}
