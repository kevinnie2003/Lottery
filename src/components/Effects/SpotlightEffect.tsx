import { motion, AnimatePresence } from 'motion/react';

interface SpotlightEffectProps {
  show: boolean;
  color?: string;
}

export function SpotlightEffect({ show, color = '#FFD700' }: SpotlightEffectProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5,
            background: `radial-gradient(ellipse 50% 60% at 50% 45%, transparent 0%, ${color}08 30%, rgba(0,0,0,0.7) 100%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}
