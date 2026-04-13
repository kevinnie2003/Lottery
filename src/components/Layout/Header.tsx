import { motion } from 'motion/react';
import type { Page } from '../../types';
import { useLotteryStore } from '../../hooks/useLotteryStore';
import { useFullscreen } from '../../hooks/useFullscreen';

const NAV_ITEMS: { page: Page; label: string }[] = [
  { page: 'setup', label: 'Setup' },
  { page: 'lottery', label: 'Lottery' },
  { page: 'winners', label: 'Winners' },
];

export function Header() {
  const currentPage = useLotteryStore((s) => s.currentPage);
  const setPage = useLotteryStore((s) => s.setPage);
  const employees = useLotteryStore((s) => s.employees);
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>&#127922;</span>
        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
          Lottery
        </span>
      </div>

      <nav style={{ display: 'flex', gap: '4px' }}>
        {NAV_ITEMS.map(({ page, label }) => {
          const isActive = currentPage === page;
          const isDisabled = page !== 'setup' && employees.length === 0;

          return (
            <motion.button
              key={page}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              onClick={() => !isDisabled && setPage(page)}
              disabled={isDisabled}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : isDisabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                border: 'none',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </motion.button>
          );
        })}
      </nav>

      <button
        onClick={toggle}
        style={{
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </header>
  );
}
