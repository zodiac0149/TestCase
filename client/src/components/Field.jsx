export const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    {children}
    {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
  </label>
);

export const inputClass =
  'w-full rounded-md border border-slate-200 bg-white/95 px-3 py-2.5 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500';
