import { useLotteryStore } from '../../hooks/useLotteryStore';
import { PRIZE_CONFIG } from '../../constants/prizes';
import { WinnerCard } from './WinnerCard';
import type { PrizeLevel } from '../../types';

const DISPLAY_ORDER: PrizeLevel[] = ['grand', 'second', 'third'];

export function WinnersPage() {
  const getWinnersByLevel = useLotteryStore((s) => s.getWinnersByLevel);

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginTop: '20px' }}>
        Winners Board
      </h1>
      <p className="page-subtitle">All prize winners from tonight</p>

      <div style={{ width: '100%', maxWidth: '900px' }}>
        {DISPLAY_ORDER.map((level) => {
          const config = PRIZE_CONFIG[level];
          const winners = getWinnersByLevel(level);

          return (
            <div
              key={level}
              style={{
                marginBottom: '32px',
                padding: '24px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${config.color}30`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: config.color,
                    boxShadow: `0 0 10px ${config.color}60`,
                  }}
                />
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: config.color,
                    margin: 0,
                  }}
                >
                  {config.label}
                </h2>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  ({winners.length} / {config.count})
                </span>
              </div>

              {winners.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    border: `1px dashed ${config.color}20`,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  Not yet drawn
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  {winners.map((w, i) => (
                    <WinnerCard key={w.employee.id} winner={w} index={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
