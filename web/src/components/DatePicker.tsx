'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default function DatePicker({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newDate) {
      params.set('date', newDate);
    } else {
      params.delete('date');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Calendar className="h-4 w-4 text-zinc-400" />
      </div>
      <input
        type="date"
        value={defaultDate}
        onChange={handleDateChange}
        className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      />
    </div>
  );
}
