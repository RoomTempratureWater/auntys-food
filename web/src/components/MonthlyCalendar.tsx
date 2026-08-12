'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';

interface DayData {
  lunch: number;
  dinner: number;
}

interface MonthlyCalendarProps {
  bookingData: Record<string, DayData>; // key: "YYYY-MM-DD"
  initialYear: number;
  initialMonth: number; // 0-indexed
}

export default function MonthlyCalendar({ bookingData, initialYear, initialMonth }: MonthlyCalendarProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function goToPrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  function goToToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Fill remaining cells for complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Monthly Bookings</h3>
          <button
            onClick={goToToday}
            className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white min-w-[160px] text-center">
            {monthName}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-orange-500" /> Lunch</span>
        <span className="flex items-center gap-1"><Moon className="w-3 h-3 text-indigo-500" /> Dinner</span>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
        {dayNames.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square border-b border-r border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/30" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = bookingData[dateStr];
          const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          const hasBookings = data && (data.lunch > 0 || data.dinner > 0);

          return (
            <div
              key={dateStr}
              className={`aspect-square border-b border-r border-zinc-100 dark:border-zinc-800/50 p-1.5 flex flex-col transition-colors ${
                isToday
                  ? 'bg-orange-50 dark:bg-orange-500/5 ring-2 ring-inset ring-orange-400 dark:ring-orange-500/40'
                  : hasBookings
                    ? 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    : 'bg-white dark:bg-zinc-900'
              }`}
            >
              <span className={`text-xs font-medium leading-none ${
                isToday
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-500'
              }`}>
                {day}
              </span>
              {data && (data.lunch > 0 || data.dinner > 0) && (
                <div className="flex-1 flex flex-col justify-end gap-0.5">
                  {data.lunch > 0 && (
                    <div className="flex items-center gap-0.5 text-[10px]">
                      <Sun className="w-2.5 h-2.5 text-orange-500 shrink-0" />
                      <span className="font-semibold text-orange-700 dark:text-orange-400">{data.lunch}</span>
                    </div>
                  )}
                  {data.dinner > 0 && (
                    <div className="flex items-center gap-0.5 text-[10px]">
                      <Moon className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">{data.dinner}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
