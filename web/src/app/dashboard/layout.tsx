import { ChefHat, LayoutDashboard, Users, CalendarDays, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <ChefHat className="text-white w-4 h-4" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white tracking-tight">Aunty's Meals</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link href="/dashboard/schedule" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">
            <CalendarDays className="w-4 h-4" />
            Daily Schedule
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">
            <Users className="w-4 h-4" />
            Customers
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <form action={logout}>
            <button className="w-full mt-1 flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/10 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 flex items-center px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10 sticky top-0">
          <h1 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Dashboard</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
