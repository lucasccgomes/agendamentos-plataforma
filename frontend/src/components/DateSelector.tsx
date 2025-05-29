interface Props {
  dates: string[];
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  formatarData: (d: string) => string;
}

export function DateSelector({ dates, selectedDate, onSelectDate, formatarData }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {dates.map((date) => (
        <div
          key={date}
          onClick={() => onSelectDate(date)}
          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            selectedDate === date
              ? 'bg-blue-100 text-blue-800 font-medium border-2 border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {formatarData(date)}
        </div>
      ))}
    </div>
  );
}
