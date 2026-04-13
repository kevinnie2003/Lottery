import { useRef, useCallback } from 'react';
import { Howl } from 'howler';
import type { PrizeLevel } from '../types';

export function useSoundEffects() {
  const drumrollRef = useRef<Howl | null>(null);
  const tickRef = useRef<Howl | null>(null);
  const fanfareRefs = useRef<Record<PrizeLevel, Howl | null>>({
    third: null,
    second: null,
    grand: null,
  });

  const getDrumroll = useCallback(() => {
    if (!drumrollRef.current) {
      drumrollRef.current = new Howl({
        src: ['/sounds/drumroll.mp3'],
        loop: true,
        volume: 0.6,
      });
    }
    return drumrollRef.current;
  }, []);

  const getTick = useCallback(() => {
    if (!tickRef.current) {
      tickRef.current = new Howl({
        src: ['/sounds/tick.mp3'],
        volume: 0.3,
      });
    }
    return tickRef.current;
  }, []);

  const getFanfare = useCallback((level: PrizeLevel) => {
    if (!fanfareRefs.current[level]) {
      const volumeMap: Record<PrizeLevel, number> = {
        third: 0.6,
        second: 0.7,
        grand: 0.8,
      };
      fanfareRefs.current[level] = new Howl({
        src: [`/sounds/fanfare-${level}.mp3`],
        volume: volumeMap[level],
      });
    }
    return fanfareRefs.current[level]!;
  }, []);

  const startSpinSound = useCallback(() => {
    getDrumroll().play();
  }, [getDrumroll]);

  const stopSpinSound = useCallback(() => {
    getDrumroll().stop();
  }, [getDrumroll]);

  const playTick = useCallback(() => {
    getTick().play();
  }, [getTick]);

  const playFanfare = useCallback((level: PrizeLevel) => {
    getDrumroll().stop();
    getFanfare(level).play();
  }, [getDrumroll, getFanfare]);

  return { startSpinSound, stopSpinSound, playTick, playFanfare };
}
