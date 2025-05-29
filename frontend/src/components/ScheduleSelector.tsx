import { FC } from 'react';
import { FiClock } from 'react-icons/fi';

interface ScheduleSelectorProps {
  schedules: { id: number; time: string }[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const ScheduleSelector: FC<ScheduleSelectorProps> = ({ schedules, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
      {schedules.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-center transition-colors ${
            selectedId === s.id
              ? 'bg-blue-100 text-blue-800 font-medium border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          <FiClock className="mr-2" /> {s.time}
        </div>
      ))}
    </div>
  );
};