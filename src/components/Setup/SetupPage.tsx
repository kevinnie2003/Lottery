import { FileUploader } from './FileUploader';
import { EmployeeTable } from './EmployeeTable';
import { useLotteryStore } from '../../hooks/useLotteryStore';
import { TOTAL_WINNERS } from '../../constants/prizes';
import type { Employee } from '../../types';

export function SetupPage() {
  const employees = useLotteryStore((s) => s.employees);
  const setEmployees = useLotteryStore((s) => s.setEmployees);
  const clearEmployees = useLotteryStore((s) => s.clearEmployees);
  const setPage = useLotteryStore((s) => s.setPage);

  const handleUpload = (emps: Employee[]) => {
    // Don't navigate yet, let them review
    useLotteryStore.setState({ employees: emps });
  };

  const handleProceed = () => {
    setEmployees(employees);
    setPage('lottery');
  };

  const hasEnough = employees.length >= TOTAL_WINNERS;

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginTop: '60px' }}>
        Annual Meeting Lottery
      </h1>
      <p className="page-subtitle">
        Upload your employee list to get started
      </p>

      {employees.length === 0 ? (
        <FileUploader onUpload={handleUpload} />
      ) : (
        <>
          <EmployeeTable employees={employees} />

          {!hasEnough && (
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
              {TOTAL_WINNERS} to fill all prize slots (1 Grand + 3 Second + 5 Third).
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
