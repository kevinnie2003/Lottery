import { FileUploader } from './FileUploader';
import { EmployeeTable } from './EmployeeTable';
import { PrizeCountEditor } from './PrizeCountEditor';
import { useLotteryStore } from '../../hooks/useLotteryStore';
import type { Employee } from '../../types';

export function SetupPage() {
  const employees = useLotteryStore((s) => s.employees);
  const setEmployees = useLotteryStore((s) => s.setEmployees);
  const clearEmployees = useLotteryStore((s) => s.clearEmployees);
  const setPage = useLotteryStore((s) => s.setPage);
  const getTotalWinners = useLotteryStore((s) => s.getTotalWinners);

  const totalWinners = getTotalWinners();

  const handleUpload = (emps: Employee[]) => {
    useLotteryStore.setState({ employees: emps });
  };

  const handleProceed = () => {
    setEmployees(employees);
    setPage('lottery');
  };

  const hasEnough = employees.length >= totalWinners;

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginTop: '60px' }}>
        Annual Meeting Lottery
      </h1>
      <p className="page-subtitle">
        Upload your employee list to get started
      </p>

      {employees.length === 0 ? (
        <>
          <PrizeCountEditor />
          <div style={{ marginTop: '32px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <FileUploader onUpload={handleUpload} />
          </div>
        </>
      ) : (
        <>
          <PrizeCountEditor />
          <div style={{ marginTop: '24px' }}>
            <EmployeeTable employees={employees} />
          </div>

          {!hasEnough && totalWinners > 0 && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 20px',
                background: 'rgba(255, 170, 0, 0.1)',
                border: '1px solid rgba(255, 170, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#ffaa00',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Warning: You have {employees.length} employees but need at least{' '}
              {totalWinners} to fill all prize slots.
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={clearEmployees}>
              Clear & Re-upload
            </button>
            <button
              className="btn btn-gold btn-lg"
              onClick={handleProceed}
              disabled={employees.length === 0}
            >
              Proceed to Draw
            </button>
          </div>
        </>
      )}
    </div>
  );
}
