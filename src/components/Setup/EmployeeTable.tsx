import type { Employee } from '../../types';

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div style={{ width: '100%', maxWidth: 700 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{employees.length}</strong> employees loaded
        </p>
      </div>

      <div
        style={{
          maxHeight: '400px',
          overflow: 'auto',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'var(--bg-secondary)',
                position: 'sticky',
                top: 0,
              }}
            >
              <th style={thStyle}>#</th>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr
                key={emp.id}
                style={{
                  borderTop: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}
              >
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{emp.id}</td>
                <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: 500 }}>
                  {emp.name}
                </td>
                <td style={tdStyle}>{emp.department || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  color: 'var(--text-muted)',
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  color: 'var(--text-secondary)',
};
