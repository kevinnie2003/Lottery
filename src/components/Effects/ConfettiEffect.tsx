import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { PrizeLevel } from '../../types';

interface ConfettiEffectProps {
  level: PrizeLevel;
  trigger: boolean;
}

export function ConfettiEffect({ level, trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    if (level === 'third') {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#CD7F32', '#FFD700', '#FFA500'],
      });
    } else if (level === 'second') {
      // First burst
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C0C0C0', '#E8E8E8', '#A0A0A0', '#FFD700'],
      });
      // Second burst delayed
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          colors: ['#C0C0C0', '#FFD700', '#FFFFFF'],
        });
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#C0C0C0', '#FFD700', '#FFFFFF'],
        });
      }, 500);
    } else if (level === 'grand') {
      // Grand prize: fireworks style
      const duration = 4000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF4500'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF4500'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big center bursts
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF'],
          startVelocity: 45,
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.4 },
          colors: ['#FFD700', '#FFA500', '#FF4500'],
          startVelocity: 50,
        });
      }, 1500);
    }
  }, [trigger, level]);

  return null;
}
