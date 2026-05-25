import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Moon, Sun, TestTube2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="flex w-full max-w-full items-center justify-between px-4 py-3 md:px-8 xl:px-12">
          <Link to="/dashboard" className="flex items-center gap-3 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-teal-400 dark:text-slate-950">
              <TestTube2 className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block">QA TestGen</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">AI coverage workspace</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:flex">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">{user?.name}</span>
            <Button variant="ghost" onClick={toggleDark} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</Button>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="w-full max-w-full px-4 py-6 md:px-8 md:py-8 xl:px-12">
        <Outlet context={{ darkMode: dark }} />
      </main>
    </div>
  );
};
