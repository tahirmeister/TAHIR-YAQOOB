import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore,
  isAfter,
  startOfToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CalendarProps {
  mode?: 'single' | 'range';
  selected?: Date | { from: Date; to?: Date };
  onSelect?: (date: any) => void;
  numberOfMonths?: number;
}

export const Calendar = ({ 
  mode = 'single', 
  selected, 
  onSelect, 
  numberOfMonths = 1 
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const renderHeader = (month: Date, showLeft: boolean, showRight: boolean) => {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          {showLeft && (
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-brand-gold/10 text-brand-gold transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold">
          {format(month, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-4">
          {showRight && (
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-brand-gold/10 text-brand-gold transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[8px] font-bold text-white/30 uppercase py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = mode === 'single' 
          ? isSameDay(day, selected as Date)
          : (selected as any)?.from && (
              isSameDay(day, (selected as any).from) || 
              ((selected as any).to && isSameDay(day, (selected as any).to))
            );
        
        const isInRange = mode === 'range' && (selected as any)?.from && (selected as any)?.to && 
          isAfter(day, (selected as any).from) && isBefore(day, (selected as any).to);

        const isPast = isBefore(day, today) && !isSameDay(day, today);

        days.push(
          <button
            key={day.toString()}
            disabled={isPast}
            className={cn(
              "h-10 w-full flex items-center justify-center text-[10px] transition-all relative text-white",
              !isSameMonth(day, monthStart) && "text-white/10",
              isSameMonth(day, monthStart) && !isSelected && !isPast && "hover:bg-brand-gold/10",
              isSelected && "gold-gradient text-black font-bold z-10",
              isInRange && "bg-brand-gold/10",
              isPast && "text-white/10 cursor-not-allowed"
            )}
            onClick={() => onSelect?.(cloneDay)}
          >
            {format(day, 'd')}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className="flex flex-col md:flex-row bg-brand-white border border-white/5 shadow-2xl">
      {Array.from({ length: numberOfMonths }).map((_, i) => {
        const month = addMonths(currentMonth, i);
        return (
          <div key={i} className={cn("w-72", i > 0 && "border-l border-white/5")}>
            {renderHeader(month, i === 0, i === numberOfMonths - 1)}
            <div className="p-4">
              {renderDays()}
              {renderCells(month)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
