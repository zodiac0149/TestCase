import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Bot, Braces, Copy, Download, FileText, GitBranch, Loader2, Route, Send, Upload, X } from 'lucide-react';
import { generationApi } from '../api/generationApi';
import { projectsApi } from '../api/projectsApi';
import { Button } from '../components/Button';
import { CodeEditor } from '../components/CodeEditor';
import { Field, inputClass } from '../components/Field';
import { Skeleton } from '../components/Skeleton';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { downloadExport } from '../utils/exportFile';
import { marked } from 'marked';

/* ── Markdown Content renderer ────────────────────────────────────────── */
const MarkdownContent = ({ content }) => {
  const html = marked.parse(content || '', { gfm: true, breaks: true });
  return (
    <div
      className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-6 space-y-2
        [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-xs
        [&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-100/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-rose-600
        dark:[&_code]:bg-slate-800/80 dark:[&_code]:text-rose-400
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
        [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5
        [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1
        [&_p]:my-1
        [&_a]:text-teal-600 dark:[&_a]:text-teal-400 [&_a]:underline
        [&_strong]:font-semibold"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/* ── GitHub URL modal ──────────────────────────────────────────────────── */
const GithubModal = ({ onClose, onConfirm, loading, error }) => {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    onConfirm(url);
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="surface w-full max-w-md p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">
              <GitBranch className="h-5 w-5 text-teal-600 dark:text-teal-300" />
            </span>
            <div>
              <h2 className="font-semibold tracking-tight text-slate-950 dark:text-white">Connect GitHub repository</h2>
              <p className="mt-0.5 text-xs text-slate-500">Public repositories only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="GitHub repository URL">
            <input
              ref={inputRef}
              className={inputClass}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
              pattern="https://github\.com/[\w.\-]+/[\w.\-]+(\.git)?/?"
              title="Enter a valid public GitHub repository URL"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch size={16} />}
              {loading ? 'Analyzing…' : 'Analyze repo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main workspace ────────────────────────────────────────────────────── */
export const WorkspacePage = () => {
  const { projectId } = useParams();
  const { darkMode } = useOutletContext();
  const [project, setProject] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [form, setForm] = useState({ generationType: 'comprehensive', testingGoal: '', codeSnippet: '', instructions: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [showGithubModal, setShowGithubModal] = useState(false);

  const { loading, error, run } = useAsyncAction();
  const { loading: analyzing, error: analysisError, run: runAnalysis } = useAsyncAction();
  const { loading: uploadingSpec, error: specError, run: runUploadSpec } = useAsyncAction();
  const { loading: chatting, run: runChat } = useAsyncAction();

  const loadProject = async () => setProject(await projectsApi.get(projectId));

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleAutofill = () => {
    if (!project) return;
    const isReact = project.detectedTechnologies?.includes('React');
    const models = project.analysis?.models || [];
    const routes = project.analysis?.routes || [];

    let goal = '';
    let code = '';
    let inst = '';

    if (models.length > 0) {
      const modelNames = models.map(m => m.name).join(', ');
      goal = `Validate database operations, schema validation, and CRUD operations for models: ${modelNames}`;
      code = `// Example interface for ${models[0].name}\nexport interface I${models[0].name.charAt(0).toUpperCase() + models[0].name.slice(1)} {\n  id: string;\n  createdAt: Date;\n  metadata: Record<string, any>;\n}`;
      inst = `Use Jest. For each test case, include concrete suggested inputs, mock datasets (with valid and edge-case values), and assertion checks.`;
    } else if (routes.length > 0) {
      const routePaths = routes.slice(0, 2).map(r => `${r.method} ${r.path}`).join(' and ');
      goal = `Write comprehensive integration tests for API routes: ${routePaths}`;
      code = `// API route definition\napp.${routes[0].method.toLowerCase()}('${routes[0].path}', async (req, res) => {\n  const { input } = req.body;\n  res.json({ success: true, data: input });\n});`;
      inst = `Use Jest and Supertest. Provide clear suggested request input payloads and test both successful and validation error payloads.`;
    } else if (isReact) {
      goal = "Write interactive unit tests for custom React components";
      code = `import React, { useState } from 'react';\n\nexport const InputSelector = ({ onSubmit }) => {\n  const [value, setValue] = useState('');\n  return (\n    <div className="p-4 border rounded-md">\n      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Enter test payload" />\n      <button onClick={() => onSubmit(value)} className="btn">Submit</button>\n    </div>\n  );\n};`;
      inst = `Use Jest and React Testing Library. Write assertions that use concrete suggested user inputs to test interactive text submission scenarios.`;
    } else {
      goal = "Generate robust unit tests for core helper functions";
      code = `export function validateInput(data) {\n  if (!data || typeof data !== 'object') return false;\n  if (!data.email || !data.email.includes('@')) return false;\n  return true;\n}`;
      inst = `Use Jest. Include a detailed table of suggested input payloads (both valid and malformed edge cases) and expected outputs.`;
    }

    setForm({
      generationType: 'comprehensive',
      testingGoal: goal,
      codeSnippet: code,
      instructions: inst
    });
  };

  const generate = (event) => {
    event.preventDefault();
    run(async () => {
      const result = await generationApi.generate({ projectId, ...form });
      setGeneration(result);
      setGeneratedContent(result.generatedContent);
    });
  };

  const uploadZip = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be re-selected if needed
    event.target.value = '';
    runAnalysis(async () => {
      const data = new FormData();
      data.append('projectId', projectId);
      data.append('repository', file);
      setProject(await projectsApi.uploadZip(data));
    });
  };

  const uploadSpecFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    runUploadSpec(async () => {
      const data = new FormData();
      data.append('projectId', projectId);
      data.append('specification', file);
      setProject(await projectsApi.uploadSpecification(data));
    });
  };

  const connectGithub = (url) => {
    runAnalysis(async () => {
      const updated = await projectsApi.connectGithub({ projectId, repositoryUrl: url });
      setProject(updated);
      setShowGithubModal(false);
    });
  };

  const sendChat = (event) => {
    event.preventDefault();
    runChat(async () => {
      const response = await generationApi.chat({ projectId, message: chatMessage });
      setChat((current) => [...current, response]);
      setChatMessage('');
    });
  };

  const copyOutput = () => navigator.clipboard.writeText(generatedContent);

  if (!project) return <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-96" /></div>;

  return (
    <>
      {showGithubModal && (
        <GithubModal
          onClose={() => setShowGithubModal(false)}
          onConfirm={connectGithub}
          loading={analyzing}
          error={analysisError}
        />
      )}

      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="surface flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="eyebrow">Project workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{project.projectName}</h1>
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                <GitBranch size={12} /> {project.repositoryUrl}
              </a>
            )}
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {project.repositorySummary || 'Upload a repository ZIP or connect a GitHub repo to enrich AI context.'}
            </p>
            {project.specificationFileName && (
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800">
                  📄 Spec: {project.specificationFileName}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* ZIP upload — always visible */}
            <label
              htmlFor="zip-upload"
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold shadow-sm transition
                ${analyzing
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={16} />}
              Upload ZIP
              <input
                id="zip-upload"
                className="hidden"
                type="file"
                accept=".zip"
                disabled={analyzing}
                onChange={uploadZip}
              />
            </label>

            {/* Spec upload — PDF, DOCX, Markdown */}
            <label
              htmlFor="spec-upload"
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold shadow-sm transition
                ${uploadingSpec
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
            >
              {uploadingSpec ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText size={16} />}
              Upload Spec
              <input
                id="spec-upload"
                className="hidden"
                type="file"
                accept=".pdf,.docx,.md,.markdown"
                disabled={uploadingSpec}
                onChange={uploadSpecFile}
              />
            </label>

            {/* GitHub connect */}
            <Button variant="secondary" onClick={() => setShowGithubModal(true)} disabled={analyzing}>
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch size={16} />}
              Connect GitHub
            </Button>
          </div>

          {(analysisError || specError) && (
            <p className="w-full text-sm text-red-600">{analysisError || specError}</p>
          )}
        </div>

        {/* ── Main content ── */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <form onSubmit={generate} className="surface p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="section-title">Generate tests</h2>
                  <p className="mt-1 text-sm text-slate-500">Use repository context, code snippets, and historical memory.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60"
                  >
                    ✨ Suggest Inputs
                  </button>
                  <span className="rounded-md bg-teal-50 p-2 dark:bg-teal-950"><Braces className="h-5 w-5 text-teal-700 dark:text-teal-300" /></span>
                </div>
              </div>
              <div className="grid gap-4">
                <Field label="Generation type">
                  <select className={inputClass} value={form.generationType} onChange={(event) => setForm({ ...form, generationType: event.target.value })}>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="unit">Unit tests</option>
                    <option value="integration">Integration tests</option>
                    <option value="api">API tests</option>
                    <option value="edge">Edge cases</option>
                  </select>
                </Field>
                <Field label="Testing goal">
                  <input className={inputClass} value={form.testingGoal} onChange={(event) => setForm({ ...form, testingGoal: event.target.value })} placeholder="Generate tests for auth and project creation flows" required />
                </Field>
                <Field label="Code snippet">
                  <textarea className={`${inputClass} min-h-28 font-mono`} value={form.codeSnippet} onChange={(event) => setForm({ ...form, codeSnippet: event.target.value })} />
                </Field>
                <Field label="Instructions">
                  <textarea className={`${inputClass} min-h-20`} value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} placeholder="Use Jest, Supertest, React Testing Library..." />
                </Field>
              </div>
              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
              <Button className="mt-4 w-full sm:w-auto" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate tests'}</Button>
            </form>

            <div className="space-y-3">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="section-title">Generated tests</h2>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copyOutput} disabled={!generatedContent}><Copy size={16} /> Copy</Button>
                  {['markdown', 'json', 'pdf'].map((format) => (
                    <Button key={format} variant="secondary" onClick={() => downloadExport(generationApi.exportUrl(format, projectId), `test-cases.${format === 'markdown' ? 'md' : format}`)}>
                      <Download size={16} /> {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <CodeEditor value={generatedContent} onChange={setGeneratedContent} darkMode={darkMode} />
            </div>
          </div>

          <aside className="space-y-6">
            <section className="surface p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="section-title">Repository analysis</h2>
                <div className="flex items-center gap-2">
                  {project.analysis?.aiSummarized && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-800">
                      ✦ AI Enhanced
                    </span>
                  )}
                  <span className="rounded-md bg-blue-50 p-2 dark:bg-blue-950"><Route className="h-5 w-5 text-blue-700 dark:text-blue-300" /></span>
                </div>
              </div>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium">Technologies</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.detectedTechnologies || []).length
                      ? (project.detectedTechnologies || []).map((tech) => <span className="chip" key={tech}>{tech}</span>)
                      : <span className="text-slate-400 text-xs">Connect a repo to detect technologies</span>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="text-xs font-medium text-slate-500">Frontend</p>
                    <p className="mt-1 font-semibold">{project.analysis?.frontendFramework || 'Unknown'}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="text-xs font-medium text-slate-500">Backend</p>
                    <p className="mt-1 font-semibold">{project.analysis?.backendFramework || 'Unknown'}</p>
                  </div>
                </div>
                <p className="leading-6 text-slate-600 dark:text-slate-300">{project.analysis?.architectureSummary || 'No architecture summary yet.'}</p>
                <pre className="max-h-56 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-5 dark:border-slate-800 dark:bg-slate-950">{project.analysis?.folderStructure || 'No folder structure yet.'}</pre>
              </div>
            </section>

            <section className="surface p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="section-title">AI assistant</h2>
                <span className="rounded-md bg-amber-50 p-2 dark:bg-amber-950"><Bot className="h-5 w-5 text-amber-700 dark:text-amber-300" /></span>
              </div>
              <div className="mt-4 max-h-72 space-y-3 overflow-auto">
                {chat.map((item) => (
                  <div key={item._id} className="space-y-2 text-sm">
                    <p className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">{item.userMessage}</p>
                    <div className="rounded-md border border-teal-100 bg-teal-50 p-3 leading-6 text-slate-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-slate-200">
                      <MarkdownContent content={item.assistantMessage} />
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChat} className="mt-4 flex gap-2">
                <input className={inputClass} value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Identify missing tests" required />
                <Button disabled={chatting}>{chatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}</Button>
              </form>
            </section>
          </aside>
        </section>
      </div>
    </>
  );
};
