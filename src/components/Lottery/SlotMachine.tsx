import { SlotColumn } from './SlotColumn';
import type { ColumnState } from '../../hooks/useSlotMachine';

interface SlotMachineProps {
  columns: ColumnState[];
  color: string;
}

export function SlotMachine({ columns, color }: SlotMachineProps) {
  const count = columns.length;

  // Adjust column width based on count
  const columnWidth = count <= 1 ? '280px' : count <= 3 ? '200px' : '160px';

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '24px',
        minHeight: '180px',
      }}
    >
      {columns.map((col, i) => (
        <SlotColumn key={i} column={col} color={color} width={columnWidth} />
      ))}
    </div>
  );
}
