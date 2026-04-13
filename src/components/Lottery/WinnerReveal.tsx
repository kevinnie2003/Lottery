import { useState } from 'react';
import { motion } from 'motion/react';
import type { Employee, PrizeLevel } from '../../types';
import { PRIZE_VISUAL } from '../../constants/prizes';

interface WinnerRevealProps {
  winners: Employee[];
  prizeLevel: PrizeLevel;
  onContinue: () => void;
  onUndo: () => void;
}

export function WinnerReveal({ winners, prizeLevel, onContinue, onUndo }: WinnerRevealProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const config = PRIZE_VISUAL[prizeLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: 'center',
        marginTop: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          fontSize: '18px',
          color: config.color,
          fontWeight: 700,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        {config.label} {winners.length > 1 ? 'Winners' : 'Winner'}!
      </motion.div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {winners.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
            style={{
              padding: '20px 28px',
              background: `${config.color}15`,
              border: `2px solid ${config.color}`,
              borderRadius: 'var(--radius-lg)',
              minWidth: '160px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 700, color: config.color }}>
              {w.name}
            </div>
            {w.department && (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {w.department}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {showConfirm ? (
          <>
            <button className="btn btn-danger btn-sm" onClick={onUndo}>
              Yes, Undo
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowConfirm(true)}
          >
            Undo Last Draw
          </button>
        )}
        <button className="btn btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </motion.div>
  );
}
