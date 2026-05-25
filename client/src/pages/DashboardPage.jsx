import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BarChart3, FolderPlus, History, Layers3, Loader2, Sparkles } from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { Button } from '../components/Button';
import { Field, inputClass } from '../components/Field';
import { Skeleton } from '../components/Skeleton';
import { useAsyncAction } from '../hooks/useAsyncAction';

export const DashboardPage = () => {
  const [data, setData] = useState({ projects: [], recentGenerations: [], stats: {} });
  const [form, setForm] = useState({ projectName: '', repositoryUrl: '' });
  const [loading, setLoading] = useState(true);
  const { loading: creating, error, run } = useAsyncAction();

  const load = async () => {
    setLoading(true);
    try {
      setData(await projectsApi.list());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = (event) => {
    event.preventDefault();
    run(async () => {
      await projectsApi.create(form);
      setForm({ projectName: '', repositoryUrl: '' });
      await load();
    });
  };

  return (
    <div className="space-y-6">
      <section className="surface overflow-hidden">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:p-6">
          <div>
            <p className="eyebrow">Control center</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">QA automation intelligence</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Manage projects, scan repositories, and generate test suites with reusable memory from previous QA work.
            </p>
          </div>
          <div className="grid min-w-64 grid-cols-2 gap-3">
            <div className="rounded-md border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/40">
              <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-300" />
              <p className="mt-3 text-2xl font-semibold">{data.stats.generationCount || 0}</p>
              <p className="text-xs font-medium text-slate-500">AI outputs</p>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
              <Layers3 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              <p className="mt-3 text-2xl font-semibold">{data.stats.analyzedProjects || 0}</p>
              <p className="text-xs font-medium text-slate-500">Analyzed repos</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {['Projects', 'Generations', 'Analyzed'].map((label, index) => (
          <div key={label} className="surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className="rounded-md bg-slate-100 p-2 dark:bg-slate-800"><BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-300" /></span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{[data.stats.projectCount, data.stats.generationCount, data.stats.analyzedProjects][index] || 0}</p>
          </div>
        ))}
      </div>

      <form onSubmit={createProject} className="surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-md bg-teal-50 p-2 dark:bg-teal-950"><FolderPlus className="h-5 w-5 text-teal-700 dark:text-teal-300" /></span>
          <div>
            <h2 className="section-title">Create project</h2>
            <p className="text-sm text-slate-500">Start from a GitHub URL or add a ZIP in the workspace.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Field label="Project name">
            <input className={inputClass} value={form.projectName} onChange={(event) => setForm({ ...form, projectName: event.target.value })} required />
          </Field>
          <Field label="GitHub URL">
            <input className={inputClass} value={form.repositoryUrl} onChange={(event) => setForm({ ...form, repositoryUrl: event.target.value })} placeholder="https://github.com/org/repo" />
          </Field>
          <Button disabled={creating}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}</Button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-3 section-title">Projects</h2>
          {loading ? (
            <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          ) : data.projects.length ? (
            <div className="grid gap-3">
              {data.projects.map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`} className="surface surface-hover block p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold">{project.projectName} <ArrowUpRight size={15} className="text-slate-400" /></h3>
                      <p className="mt-1 text-sm text-slate-500">{project.repositorySummary || project.repositoryUrl || 'No repository connected yet'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(project.detectedTechnologies || []).slice(0, 4).map((tech) => <span key={tech} className="chip">{tech}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="surface border-dashed p-8 text-center text-slate-500">Create a project to start generating tests.</div>
          )}
        </div>
        <aside>
          <h2 className="mb-3 flex items-center gap-2 section-title"><History className="h-5 w-5 text-teal-600 dark:text-teal-300" /> Recent generations</h2>
          <div className="space-y-3">
            {data.recentGenerations?.length ? data.recentGenerations.map((generation) => (
              <div key={generation._id} className="surface p-4 text-sm">
                <p className="font-medium">{generation.generationType}</p>
                <p className="mt-1 line-clamp-2 text-slate-500">{generation.testingGoal}</p>
              </div>
            )) : <p className="surface p-4 text-sm text-slate-500">No generations yet.</p>}
          </div>
        </aside>
      </section>
    </div>
  );
};
