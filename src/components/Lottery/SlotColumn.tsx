import { motion, AnimatePresence } from 'motion/react';
import type { ColumnState } from '../../hooks/useSlotMachine';

interface SlotColumnProps {
  column: ColumnState;
  color: string;
  width?: string;
}

export function SlotColumn({ column, color, width = '180px' }: SlotColumnProps) {
  const { displayedName, displayedDept, phase, tick } = column;

  const isActive = phase === 'spinning' || phase === 'decelerating';
  const isStopped = phase === 'stopped';

  return (
    <div
      style={{
        width,
        height: '120px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: `2px solid ${isStopped ? color : isActive ? 'var(--accent-blue)' : 'var(--border)'}`,
        background: isStopped
          ? `${color}15`
          : isActive
            ? 'rgba(74, 158, 255, 0.05)'
            : 'var(--bg-secondary)',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      {phase === 'idle' && (
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>---</span>
      )}

      <AnimatePresence mode="popLayout">
        {displayedName && (
          <motion.div
            key={isStopped ? `winner-${displayedName}` : `tick-${tick}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: isStopped ? [1, 1.08, 1] : 1,
            }}
            exit={{ y: -30, opacity: 0 }}
            transition={{
              duration: isStopped ? 0.4 : 0.06,
              scale: { duration: 0.5, delay: 0.1 },
            }}
            style={{
              textAlign: 'center',
              padding: '8px',
              position: 'absolute',
            }}
          >
            <div
              style={{
                fontSize: isStopped ? '20px' : '18px',
                fontWeight: isStopped ? 700 : 500,
                color: isStopped ? color : 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: `calc(${width} - 20px)`,
              }}
            >
              {displayedName}
            </div>
            {displayedDept && (
              <div
                style={{
                  fontSize: '12px',
                  color: isStopped ? color : 'var(--text-muted)',
                  marginTop: '4px',
                  opacity: isStopped ? 0.8 : 0.6,
                }}
              >
                {displayedDept}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning line effect during spin */}
      {isActive && (
        <motion.div
          animate={{ y: [-60, 60] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
