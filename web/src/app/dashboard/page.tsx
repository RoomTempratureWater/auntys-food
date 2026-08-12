import { prisma } from 'db';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import MonthlyCalendar from '@/components/MonthlyCalendar';

export default async function DashboardOverview() {
  const userCount = await prisma.user.count();
  const activeUserCount = await prisma.user.count({ where: { is_active: true } });

  // Get today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysBookings = await prisma.mealSchedule.count({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
      status: 'booked'
    }
  });

  // Get current month's booking data for the calendar
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Fetch all bookings for the current month (and a buffer for navigation)
  // We'll fetch 3 months of data to allow prev/next without re-fetching
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth + 2, 0);

  const monthBookings = await prisma.mealSchedule.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: 'booked',
    },
    select: {
      date: true,
      type: true,
    },
  });

  // Aggregate into { "YYYY-MM-DD": { lunch: N, dinner: N } }
  const bookingData: Record<string, { lunch: number; dinner: number }> = {};
  for (const b of monthBookings) {
    const dateStr = b.date.toISOString().split('T')[0];
    if (!bookingData[dateStr]) {
      bookingData[dateStr] = { lunch: 0, dinner: 0 };
    }
    if (b.type === 'lunch') bookingData[dateStr].lunch++;
    else if (b.type === 'dinner') bookingData[dateStr].dinner++;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Customers</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{userCount}</p>
            </div>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-emerald-500 font-medium">{activeUserCount}</span> active subscriptions
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Today's Meals</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{todaysBookings}</p>
            </div>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Scheduled for delivery today
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Payments</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">0</p>
            </div>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Awaiting verification
          </div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <MonthlyCalendar
        bookingData={bookingData}
        initialYear={currentYear}
        initialMonth={currentMonth}
      />
    </div>
  );
}
