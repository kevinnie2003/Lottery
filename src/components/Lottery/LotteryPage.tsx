import { useCallback, useRef, useEffect } from 'react';
import { useLotteryStore } from '../../hooks/useLotteryStore';
import { useSlotMachine } from '../../hooks/useSlotMachine';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { PRIZE_VISUAL } from '../../constants/prizes';
import { PrizeLevelSelector } from './PrizeLevelSelector';
import { SlotMachine } from './SlotMachine';
import { DrawButton } from './DrawButton';
import { WinnerReveal } from './WinnerReveal';
import { ConfettiEffect } from '../Effects/ConfettiEffect';
import { SpotlightEffect } from '../Effects/SpotlightEffect';
import { ScreenShake } from '../Effects/ScreenShake';
import type { Employee } from '../../types';

export function LotteryPage() {
  const currentLevel = useLotteryStore((s) => s.currentPrizeLevel);
  const drawPhase = useLotteryStore((s) => s.drawPhase);
  const setDrawPhase = useLotteryStore((s) => s.setDrawPhase);
  const completeDraw = useLotteryStore((s) => s.completeDraw);
  const undoLastDraw = useLotteryStore((s) => s.undoLastDraw);
  const getEligibleEmployees = useLotteryStore((s) => s.getEligibleEmployees);
  const currentDrawWinners = useLotteryStore((s) => s.currentDrawWinners);
  const isLevelComplete = useLotteryStore((s) => s.isLevelComplete);
  const isAllComplete = useLotteryStore((s) => s.isAllComplete);
  const prizeCounts = useLotteryStore((s) => s.prizeCounts);

  const eligible = getEligibleEmployees();
  const visual = PRIZE_VISUAL[currentLevel];

  const { startSpinSound, playTick, playFanfare } = useSoundEffects();

  const hasTriggeredFanfare = useRef(false);

  const onAllStopped = useCallback(
    (winners: Employee[]) => {
      completeDraw(winners);
      if (!hasTriggeredFanfare.current) {
        hasTriggeredFanfare.current = true;
        playFanfare(currentLevel);
      }
    },
    [completeDraw, playFanfare, currentLevel]
  );

  const { columns, start, reset } = useSlotMachine({
    eligible,
    prizeLevel: currentLevel,
    winnerCount: prizeCounts[currentLevel],
    onTick: playTick,
    onAllStopped,
  });

  // Reset slot machine when prize level changes
  const prevLevelRef = useRef(currentLevel);
  useEffect(() => {
    if (prevLevelRef.current !== currentLevel) {
      prevLevelRef.current = currentLevel;
      reset();
      setDrawPhase('idle');
    }
  }, [currentLevel, reset, setDrawPhase]);

  const handleDraw = useCallback(() => {
    if (eligible.length === 0 || isLevelComplete(currentLevel)) return;
    hasTriggeredFanfare.current = false;
    setDrawPhase('spinning');
    startSpinSound();
    start();
  }, [eligible, isLevelComplete, currentLevel, setDrawPhase, startSpinSound, start]);

  const handleContinue = useCallback(() => {
    reset();
    setDrawPhase('idle');
    useLotteryStore.setState({ currentDrawWinners: [] });
  }, [reset, setDrawPhase]);

  const handleUndo = useCallback(() => {
    undoLastDraw();
    reset();
  }, [undoLastDraw, reset]);

  const isRevealed = drawPhase === 'revealed';
  const isGrand = currentLevel === 'grand';
  const allDone = isAllComplete();

  return (
    <ScreenShake shake={isRevealed && isGrand}>
      <SpotlightEffect
        show={isRevealed}
        color={visual.color}
      />
      <ConfettiEffect level={currentLevel} trigger={isRevealed} />

      <div className="page" style={{ position: 'relative', zIndex: 10 }}>
        <h1
          className="page-title"
          style={{
            marginTop: '20px',
            color: visual.color,
          }}
        >
          {visual.label}
        </h1>

        <PrizeLevelSelector disabled={drawPhase !== 'idle'} />

        {allDone && drawPhase === 'idle' ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#127942;</div>
            <h2 style={{ color: 'var(--accent-gold)', fontSize: 'var(--font-size-xl)' }}>
              All Prizes Awarded!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Check the Winners Board for the full list
            </p>
          </div>
        ) : (
          <>
            <SlotMachine columns={columns} color={visual.color} />

            <div style={{ marginTop: '24px' }}>
              {drawPhase !== 'revealed' && (
                <DrawButton
                  phase={drawPhase}
                  onDraw={handleDraw}
                  disabled={eligible.length === 0 || isLevelComplete(currentLevel)}
                />
              )}
            </div>

            {isRevealed && currentDrawWinners.length > 0 && (
              <WinnerReveal
                winners={currentDrawWinners}
                prizeLevel={currentLevel}
                onContinue={handleContinue}
                onUndo={handleUndo}
              />
            )}
          </>
        )}
      </div>
    </ScreenShake>
  );
}
