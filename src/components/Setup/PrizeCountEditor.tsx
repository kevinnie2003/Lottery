import type { PrizeLevel } from '../../types';
import { PRIZE_VISUAL, PRIZE_ORDER } from '../../constants/prizes';
import { useLotteryStore } from '../../hooks/useLotteryStore';

export function PrizeCountEditor() {
  const prizeCounts = useLotteryStore((s) => s.prizeCounts);
  const setPrizeCount = useLotteryStore((s) => s.setPrizeCount);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        padding: '24px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
        Prize Configuration
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {([...PRIZE_ORDER].reverse() as PrizeLevel[]).map((level) => {
          const visual = PRIZE_VISUAL[level];
          const count = prizeCounts[level];

          return (
            <div
              key={level}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${visual.color}30`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: visual.color,
                  }}
                />
                <span style={{ fontWeight: 600, color: visual.color, fontSize: '15px' }}>
                  {visual.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '32px', height: '32px', padding: 0, fontSize: '18px' }}
                  onClick={() => setPrizeCount(level, count - 1)}
                  disabled={count <= 0}
                >
                  -
                </button>
                <span
                  style={{
                    width: '40px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {count}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '32px', height: '32px', padding: 0, fontSize: '18px' }}
                  onClick={() => setPrizeCount(level, count + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Total winners: {prizeCounts.grand + prizeCounts.second + prizeCounts.third}
      </p>
    </div>
  );
}
