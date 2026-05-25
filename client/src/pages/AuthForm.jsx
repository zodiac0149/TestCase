import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, TestTube2 } from 'lucide-react';
import { authApi } from '../api/authApi';
import { Button } from '../components/Button';
import { Field, inputClass } from '../components/Field';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useAuthStore } from '../store/authStore';

export const AuthForm = ({ mode }) => {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const { loading, error, run } = useAsyncAction();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (event) => {
    event.preventDefault();
    run(async () => {
      const data = isSignup ? await authApi.signup(form) : await authApi.login({ email: form.email, password: form.password });
      setSession(data);
      navigate('/dashboard');
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 dark:bg-slate-950">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none md:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-slate-950 p-8 text-white md:flex md:flex-col md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} /> Home</Link>
            <div className="mt-10 flex h-11 w-11 items-center justify-center rounded-md bg-teal-400 text-slate-950"><TestTube2 size={22} /></div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Turn product context into QA coverage.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">Secure sessions, repository-aware generation, and exportable test assets for modern engineering teams.</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <ShieldCheck className="mb-3 h-5 w-5 text-teal-300" />
            JWT auth, hashed passwords, payload validation, and prompt-safety filtering are wired in.
          </div>
        </aside>
        <form onSubmit={submit} className="p-6 sm:p-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950 md:hidden"><ArrowLeft size={16} /> Home</Link>
        <h1 className="text-3xl font-semibold tracking-tight">{isSignup ? 'Create account' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm text-slate-500">Build, regenerate, and export QA coverage from one workspace.</p>
        <div className="mt-6 space-y-4">
          {isSignup ? (
            <Field label="Name">
              <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </Field>
          ) : null}
          <Field label="Email">
            <input className={inputClass} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </Field>
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Button className="mt-6 w-full" disabled={loading}>{loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Login'}</Button>
        <p className="mt-4 text-center text-sm text-slate-500">
          {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link className="font-medium text-teal-700 dark:text-teal-300" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Login' : 'Sign up'}</Link>
        </p>
      </form>
      </div>
    </div>
  );
};
