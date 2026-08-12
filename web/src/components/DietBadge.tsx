export default function DietBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
    veg: { label: 'Veg', color: 'text-green-800 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20', dot: 'bg-green-500' },
    nonveg: { label: 'Non-Veg', color: 'text-red-800 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', dot: 'bg-red-500' },
    egg: { label: 'Egg', color: 'text-yellow-800 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', dot: 'bg-yellow-500' },
  };
  const c = config[type] || config.veg;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${c.color} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
