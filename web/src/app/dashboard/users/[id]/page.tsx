import { prisma } from 'db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Calendar, Plus, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import BalanceForm from './BalanceForm';
import DietBadge from '@/components/DietBadge';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      BalanceTransaction: {
        orderBy: { created_at: 'desc' },
        take: 50,
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/users"
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{user.name}</h2>
            <DietBadge type={user.diet_type} />
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <Phone className="w-3.5 h-3.5" />
              {user.phone_number}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="w-3.5 h-3.5" />
              {user.address}
            </span>
          </div>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          user.is_active
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Balance</p>
          <p className={`text-3xl font-bold mt-1 ${
            user.meal_balance > 5 ? 'text-emerald-600 dark:text-emerald-400' :
            user.meal_balance > 0 ? 'text-orange-600 dark:text-orange-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {user.meal_balance} <span className="text-base font-medium">meals</span>
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Preferences</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
            {user.has_preferences ? (user.preferences_text || 'Yes') : 'None'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Member Since</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
            {user.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Balance Form */}
      <BalanceForm userId={user.id} userName={user.name} currentBalance={user.meal_balance} />

      {/* Transaction History */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Balance History</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">All balance changes are tracked here for auditing.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {user.BalanceTransaction.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {tx.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="text-zinc-400 dark:text-zinc-600 ml-2 text-xs">
                      {tx.created_at.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                      tx.amount > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.amount > 0 ? (
                        <><ArrowUpRight className="w-3.5 h-3.5" />+{tx.amount}</>
                      ) : (
                        <><ArrowDownRight className="w-3.5 h-3.5" />{tx.amount}</>
                      )}
                      <span className="font-normal text-zinc-500 ml-1">meals</span>
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {tx.reason}
                  </td>
                </tr>
              ))}
              {user.BalanceTransaction.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No balance transactions yet.
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
