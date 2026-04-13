const STORAGE_KEY = 'lottery-storage';

export function getStorageSize(): number {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? new Blob([data]).size : 0;
}

export function exportState(): string {
  return localStorage.getItem(STORAGE_KEY) || '{}';
}

export function importState(json: string): void {
  localStorage.setItem(STORAGE_KEY, json);
  window.location.reload();
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
