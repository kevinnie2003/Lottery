import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Employee } from '../types';

const NAME_ALIASES = ['name', 'employee name', 'full name', 'fullname', '姓名', '名字'];
const DEPT_ALIASES = ['department', 'dept', 'team', 'group', '部门', '团队'];
const ID_ALIASES = ['employee id', 'employeeid', 'id', 'emp_id', 'employee_id', 'staff id', '工号', '员工编号'];

function matchColumn(header: string, aliases: string[]): boolean {
  const normalized = header.trim().toLowerCase();
  return aliases.some(alias => normalized === alias || normalized.includes(alias));
}

interface ParseResult {
  employees: Employee[];
  errors: string[];
}

function mapRowsToEmployees(rows: Record<string, string>[]): ParseResult {
  if (rows.length === 0) return { employees: [], errors: ['File contains no data rows'] };

  const headers = Object.keys(rows[0]);
  const nameCol = headers.find(h => matchColumn(h, NAME_ALIASES));
  const deptCol = headers.find(h => matchColumn(h, DEPT_ALIASES));
  const idCol = headers.find(h => matchColumn(h, ID_ALIASES));

  const errors: string[] = [];

  if (!nameCol) errors.push('Could not find a "Name" column. Expected headers: name, employee name, fullname, 姓名');
  if (!idCol) errors.push('Could not find an "Employee ID" column. Expected headers: id, employee id, emp_id, 工号');

  if (!nameCol || !idCol) return { employees: [], errors };

  const employees: Employee[] = [];
  const seenIds = new Set<string>();

  rows.forEach((row, index) => {
    const name = (row[nameCol] || '').trim();
    const id = String(row[idCol] || '').trim();
    const department = deptCol ? (row[deptCol] || '').trim() : '';

    if (!name || !id) {
      errors.push(`Row ${index + 2}: Missing name or employee ID`);
      return;
    }

    if (seenIds.has(id)) {
      errors.push(`Row ${index + 2}: Duplicate employee ID "${id}"`);
      return;
    }

    seenIds.add(id);
    employees.push({ id, name, department });
  });

  return { employees, errors };
}

export async function parseFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return parseCsv(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  }

  return { employees: [], errors: [`Unsupported file type: .${extension}`] };
}

function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        resolve(mapRowsToEmployees(rows));
      },
      error: (error: Error) => {
        resolve({ employees: [], errors: [`CSV parse error: ${error.message}`] });
      },
    });
  });
}

async function parseExcel(file: File): Promise<ParseResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { defval: '' });
    return mapRowsToEmployees(rows.map(row => {
      const mapped: Record<string, string> = {};
      for (const [key, val] of Object.entries(row)) {
        mapped[key] = String(val);
      }
      return mapped;
    }));
  } catch {
    return { employees: [], errors: ['Failed to parse Excel file'] };
  }
}
