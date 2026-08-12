'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6">
              <ChefHat className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-zinc-400 mt-2 text-sm">Sign in to manage meals and schedules.</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
              <input 
                type="text" 
                name="username" 
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-white placeholder-zinc-600"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input 
                type="password" 
                name="password" 
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-white placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
              >
                {state.error}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={pending}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
