'use client';

import { useActionState } from 'react';
import { createUser } from '@/app/actions/users';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const initialState = {
  error: '',
};

export default function NewUserPage() {
  const [state, formAction, pending] = useActionState(createUser, initialState);
  const [hasPreferences, setHasPreferences] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/users"
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Add Customer</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Register a new customer for the meal service.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
              <input 
                type="text" 
                name="phone_number" 
                required
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                placeholder="e.g. +91 9876543210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Diet Type</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-green-500 has-[:checked]:border-green-500 transition-all">
                <input type="radio" name="diet_type" value="veg" defaultChecked className="sr-only" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Veg</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-red-500 has-[:checked]:border-red-500 transition-all">
                <input type="radio" name="diet_type" value="nonveg" className="sr-only" />
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Non-Veg</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-yellow-500 has-[:checked]:border-yellow-500 transition-all">
                <input type="radio" name="diet_type" value="egg" className="sr-only" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Egg</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Delivery Address</label>
            <textarea 
              name="address" 
              required
              rows={3}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white resize-none"
              placeholder="Full delivery address with landmarks..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Initial Meal Balance</label>
              <input 
                type="number" 
                name="meal_balance" 
                defaultValue={26}
                min={0}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="has_preferences" 
                  className="sr-only peer"
                  checked={hasPreferences}
                  onChange={(e) => setHasPreferences(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Special Dietary Preferences?</span>
            </label>

            {hasPreferences && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preference Details</label>
                <input 
                  type="text" 
                  name="preferences_text" 
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                  placeholder="e.g. Pure Veg, No Garlic, Less Spicy..."
                />
              </div>
            )}
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <Link 
              href="/dashboard/users"
              className="px-6 py-3 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={pending}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {pending && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
