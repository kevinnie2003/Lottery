import { useRef, useCallback } from 'react';
import type { PrizeLevel } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, volume = 0.15) {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.Q.setValueAtTime(0.5, ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + duration);
}

export function useSoundEffects() {
  const drumrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSpinSound = useCallback(() => {
    // Simulate drumroll with rapid noise bursts
    if (drumrollInterval.current) return;
    drumrollInterval.current = setInterval(() => {
      playNoise(0.08, 0.12);
    }, 60);
  }, []);

  const stopSpinSound = useCallback(() => {
    if (drumrollInterval.current) {
      clearInterval(drumrollInterval.current);
      drumrollInterval.current = null;
    }
  }, []);

  const playTick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.08);
  }, []);

  const playFanfare = useCallback((level: PrizeLevel) => {
    stopSpinSound();

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (level === 'third') {
      // Short ascending arpeggio
      playTone(523, 0.3, 'triangle', 0.25); // C5
      setTimeout(() => playTone(659, 0.3, 'triangle', 0.25), 150); // E5
      setTimeout(() => playTone(784, 0.5, 'triangle', 0.3), 300); // G5
    } else if (level === 'second') {
      // Fuller chord progression
      playTone(523, 0.3, 'triangle', 0.2); // C5
      setTimeout(() => playTone(659, 0.3, 'triangle', 0.2), 120); // E5
      setTimeout(() => playTone(784, 0.3, 'triangle', 0.2), 240); // G5
      setTimeout(() => {
        playTone(523, 0.6, 'triangle', 0.25);
        playTone(659, 0.6, 'triangle', 0.2);
        playTone(784, 0.6, 'triangle', 0.2);
        playTone(1047, 0.6, 'triangle', 0.3); // C6
      }, 400);
    } else {
      // Grand: dramatic rising fanfare with harmonics
      const notes = [
        { freq: 392, delay: 0 },     // G4
        { freq: 494, delay: 120 },    // B4
        { freq: 587, delay: 240 },    // D5
        { freq: 784, delay: 400 },    // G5
      ];
      notes.forEach(({ freq, delay }) => {
        setTimeout(() => playTone(freq, 0.4, 'triangle', 0.2), delay);
      });
      // Big chord at the end
      setTimeout(() => {
        playTone(784, 1.0, 'triangle', 0.25);  // G5
        playTone(988, 1.0, 'triangle', 0.2);   // B5
        playTone(1175, 1.0, 'triangle', 0.2);  // D6
        playTone(1568, 1.0, 'sine', 0.15);     // G6
        // Shimmer
        const shimmer = getAudioContext();
        const osc = shimmer.createOscillator();
        const gain = shimmer.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(4000, now + 1.5);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        osc.connect(gain);
        gain.connect(shimmer.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      }, 600);
    }
  }, [stopSpinSound]);

  return { startSpinSound, stopSpinSound, playTick, playFanfare };
}
