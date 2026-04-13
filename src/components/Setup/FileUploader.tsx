import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseFile } from '../../utils/csvParser';
import type { Employee } from '../../types';

interface FileUploaderProps {
  onUpload: (employees: Employee[]) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsLoading(true);
      setErrors([]);

      const file = acceptedFiles[0];
      const result = await parseFile(file);

      setIsLoading(false);

      if (result.errors.length > 0) {
        setErrors(result.errors);
      }

      if (result.employees.length > 0) {
        onUpload(result.employees);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--accent-blue)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '60px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: isDragActive ? 'rgba(74, 158, 255, 0.05)' : 'var(--bg-secondary)',
        }}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Parsing file...
          </p>
        ) : isDragActive ? (
          <p style={{ color: 'var(--accent-blue)', fontSize: 'var(--font-size-lg)' }}>
            Drop the file here
          </p>
        ) : (
          <>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>
              <span role="img" aria-label="upload">&#128194;</span>
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>
              Drag & drop your employee list here
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              or click to browse. Supports CSV, XLSX, XLS
            </p>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(255, 74, 106, 0.1)',
            border: '1px solid rgba(255, 74, 106, 0.3)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p style={{ color: 'var(--accent-red)', fontWeight: 600, marginBottom: '8px' }}>
            Issues found:
          </p>
          {errors.map((err, i) => (
            <p key={i} style={{ color: 'var(--accent-red)', fontSize: 'var(--font-size-sm)' }}>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
