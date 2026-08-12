'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { adjustBalance } from '@/app/actions/users';
import { Plus, Minus } from 'lucide-react';

const initialState = { error: '' };

export default function BalanceForm({ userId, userName, currentBalance }: { userId: number; userName: string; currentBalance: number }) {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingReason, setPendingReason] = useState('');

  const [state, formAction, isPending] = useActionState(adjustBalance, initialState);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const amount = parseInt(formData.get('amount') as string) || 0;
    const reason = formData.get('reason') as string;

    if (amount <= 0) return;

    setPendingAmount(amount);
    setPendingReason(reason);
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    // Submit via hidden form with the server action
    const form = document.getElementById('balance-form') as HTMLFormElement;
    const formData = new FormData(form);
    formAction(formData);
  }

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Adjust Balance</h3>
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === 'add'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Meals
          </button>
          <button
            type="button"
            onClick={() => setMode('remove')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === 'remove'
                ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Minus className="w-4 h-4" />
            Remove Meals
          </button>
        </div>

        <form id="balance-form" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="mode" value={mode} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Number of Meals</label>
              <input
                type="number"
                name="amount"
                min={1}
                defaultValue={26}
                required
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reason</label>
              <input
                type="text"
                name="reason"
                required
                placeholder={mode === 'add' ? 'e.g. Monthly recharge' : 'e.g. Correction'}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-3 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm ${
              mode === 'add'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isPending && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {mode === 'add' ? 'Add' : 'Remove'} Meals
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 max-w-md w-full">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Confirm Balance Change</h4>
            <p className="text-zinc-600 dark:text-zinc-400 mb-1">
              Are you sure you want to <span className={`font-semibold ${mode === 'add' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{mode === 'add' ? 'add' : 'remove'} {pendingAmount} meals</span> {mode === 'add' ? 'to' : 'from'} <span className="font-semibold text-zinc-900 dark:text-white">{userName}</span>?
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-1">
              Current balance: <span className="font-medium">{currentBalance} meals</span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
              New balance: <span className="font-semibold">{mode === 'add' ? currentBalance + pendingAmount : Math.max(0, currentBalance - pendingAmount)} meals</span>
            </p>
            {pendingReason && (
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                Reason: <span className="font-medium italic">{pendingReason}</span>
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
                  mode === 'add'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Yes, {mode === 'add' ? 'Add' : 'Remove'} {pendingAmount} Meals
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
