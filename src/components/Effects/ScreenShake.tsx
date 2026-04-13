import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ScreenShakeProps {
  shake: boolean;
  children: ReactNode;
}

export function ScreenShake({ shake, children }: ScreenShakeProps) {
  return (
    <motion.div
      animate={
        shake
          ? {
              x: [0, -4, 4, -3, 3, -1, 1, 0],
              y: [0, 2, -2, 1, -1, 1, 0, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.6, repeat: shake ? 2 : 0 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}
