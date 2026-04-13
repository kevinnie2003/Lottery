import type { Employee } from '../types';

export function selectRandomWinners(
  eligible: Employee[],
  count: number
): Employee[] {
  if (eligible.length <= count) return [...eligible];

  const pool = [...eligible];
  const winners: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const index = array[0] % pool.length;
    winners.push(pool[index]);
    pool.splice(index, 1);
  }

  return winners;
}

export function getRandomEmployee(employees: Employee[]): Employee {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return employees[array[0] % employees.length];
}
