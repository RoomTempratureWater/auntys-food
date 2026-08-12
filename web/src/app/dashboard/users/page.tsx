import { prisma } from 'db';
import Link from 'next/link';
import { Plus, Check, X, Phone, MapPin, ChevronRight } from 'lucide-react';
import { toggleUserStatus } from '@/app/actions/users';
import DietBadge from '@/components/DietBadge';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Customers</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage customer subscriptions and meal balances.</p>
        </div>
        <Link 
          href="/dashboard/users/new"
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Diet</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Preferences</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/users/${user.id}`} className="font-medium text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Phone className="w-3.5 h-3.5" />
                        {user.phone_number}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DietBadge type={user.diet_type} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.meal_balance > 5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      user.meal_balance > 0 ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400' :
                      'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {user.meal_balance} meals
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.has_preferences ? (
                      <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        {user.preferences_text || 'Yes'}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <form action={async () => {
                      'use server';
                      await toggleUserStatus(user.id, !user.is_active);
                    }}>
                      <button 
                        type="submit"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.is_active 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20' 
                            : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {user.is_active ? (
                          <><Check className="w-3 h-3" /> Active</>
                        ) : (
                          <><X className="w-3 h-3" /> Inactive</>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/dashboard/users/${user.id}`}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No customers found. Click "Add Customer" to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
