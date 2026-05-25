import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, CheckCircle2, FileCode2, GitBranch, MessageSquareText, TestTube2 } from 'lucide-react';
import { Button } from '../components/Button';
import { PolarizedBlueScene } from '../components/PolarizedBlueScene';

const features = [
  { icon: FileCode2, title: 'Repository-aware generation', text: 'Scan ZIP uploads, detect routes, models, services, and framework signals.' },
  { icon: BrainCircuit, title: 'Memory-enhanced AI', text: 'Reuse historical generations and feedback with vector-style retrieval.' },
  { icon: GitBranch, title: 'QA-ready coverage', text: 'Generate unit, integration, API, validation, edge, and negative scenarios.' },
  { icon: MessageSquareText, title: 'Assistant workflow', text: 'Ask for missing tests, stronger assertions, explanations, and coverage gaps.' },
];

export const LandingPage = () => (
  <div className="min-h-screen bg-slate-950 text-slate-950">
    <section className="polarized-hero relative min-h-[86vh] overflow-hidden">
      <PolarizedBlueScene />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(80,142,255,0.28),transparent_32%),linear-gradient(120deg,rgba(2,6,23,0.98),rgba(11,35,83,0.94)_52%,rgba(14,165,233,0.72))]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-100 to-transparent" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-white">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-blue-100 ring-1 ring-blue-300/25"><TestTube2 size={19} /></span>
          QA TestGen
        </Link>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost" className="text-white hover:bg-black/30">Login</Button></Link>
          <Link to="/signup"><Button className="border border-blue-300/20 bg-black text-blue-50 hover:bg-slate-900">Sign up</Button></Link>
        </div>
      </header>
      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-10 text-white">
        <p className="mb-4 max-w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">AI test case generation for QA teams</p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">QA TestGen Platform</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-200">
          Analyze requirements, repositories, APIs, and frontend flows to produce automation-ready tests with feedback-driven improvement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup"><Button className="px-5">Start generating <ArrowRight size={18} /></Button></Link>
          <Link to="/login"><Button variant="secondary" className="border-blue-200/20 bg-black/25 text-white hover:bg-black/40">Login</Button></Link>
        </div>
        <div className="mt-10 grid max-w-3xl gap-3 text-sm text-slate-200 sm:grid-cols-3">
          {['Repository analysis', 'Embedding memory', 'Export-ready output'].map((item) => (
            <span key={item} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-300" /> {item}</span>
          ))}
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-4 bg-slate-100 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <article key={feature.title} className="surface surface-hover p-5">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-black text-blue-100 shadow-sm shadow-blue-900/20">
            <feature.icon className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
        </article>
      ))}
    </section>
  </div>
);
