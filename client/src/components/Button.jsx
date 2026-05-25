export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const styles = {
    primary: 'border border-blue-400/20 bg-black text-blue-50 shadow-sm shadow-blue-950/20 hover:bg-slate-900 dark:border-blue-300/20 dark:bg-black dark:text-blue-50 dark:shadow-none dark:hover:bg-slate-900',
    secondary: 'border border-slate-300 bg-slate-950 text-white shadow-sm hover:border-blue-300/40 hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-300/40 dark:hover:bg-slate-900',
    ghost: 'text-slate-700 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'border border-red-500/30 bg-black text-red-100 hover:bg-red-950',
  };
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
