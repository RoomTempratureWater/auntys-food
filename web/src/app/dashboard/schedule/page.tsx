import { prisma } from 'db';
import { Sun, Moon, Printer } from 'lucide-react';
import Link from 'next/link';
import DietBadge from '@/components/DietBadge';



function DietSummary({ bookings, title }: { bookings: { user: { diet_type: string } }[], title: string }) {
  const total = bookings.length;
  const veg = bookings.filter(b => b.user.diet_type === 'veg').length;
  const nonveg = bookings.filter(b => b.user.diet_type === 'nonveg').length;
  const egg = bookings.filter(b => b.user.diet_type === 'egg').length;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50">
      <span className="font-semibold text-zinc-800 dark:text-zinc-200">Total {title}: {total}</span>
      
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {veg} Veg
        </span>
        <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          {nonveg} Non-Veg
        </span>
        <span className="flex items-center gap-1.5 text-yellow-700 dark:text-yellow-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          {egg} Egg
        </span>
      </div>
    </div>
  );
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const queryDate = date ? new Date(date) : new Date();
  queryDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(queryDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const bookings = await prisma.mealSchedule.findMany({
    where: {
      date: {
        gte: queryDate,
        lt: nextDate,
      },
      status: 'booked'
    },
    include: {
      user: true
    },
    orderBy: {
      type: 'asc'
    }
  });

  const lunchBookings = bookings.filter(b => b.type === 'lunch');
  const dinnerBookings = bookings.filter(b => b.type === 'dinner');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Daily Schedule</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {queryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/print?date=${queryDate.toISOString()}`}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl transition-colors dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 font-medium text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Labels
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lunch Column */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-orange-50/50 dark:bg-orange-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Lunch Deliveries</h3>
              </div>
            </div>
            <DietSummary bookings={lunchBookings} title="Lunch" />
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 flex-1 overflow-auto max-h-[600px]">
            {lunchBookings.map(booking => (
              <div key={booking.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{booking.user.name}</h4>
                    <DietBadge type={booking.user.diet_type} />
                  </div>
                  <div className="text-xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                    {booking.user.phone_number}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{booking.user.address}</p>
                {booking.user.has_preferences && (
                  <div className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-md font-medium border border-amber-200 dark:border-amber-500/20">
                    {booking.user.preferences_text || 'Special Request'}
                  </div>
                )}
              </div>
            ))}
            {lunchBookings.length === 0 && (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                No lunch bookings for this day.
              </div>
            )}
          </div>
        </div>

        {/* Dinner Column */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-indigo-50/50 dark:bg-indigo-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Moon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Dinner Deliveries</h3>
              </div>
            </div>
            <DietSummary bookings={dinnerBookings} title="Dinner" />
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 flex-1 overflow-auto max-h-[600px]">
            {dinnerBookings.map(booking => (
              <div key={booking.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{booking.user.name}</h4>
                    <DietBadge type={booking.user.diet_type} />
                  </div>
                  <div className="text-xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                    {booking.user.phone_number}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{booking.user.address}</p>
                {booking.user.has_preferences && (
                  <div className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-md font-medium border border-amber-200 dark:border-amber-500/20">
                    {booking.user.preferences_text || 'Special Request'}
                  </div>
                )}
              </div>
            ))}
            {dinnerBookings.length === 0 && (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                No dinner bookings for this day.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
