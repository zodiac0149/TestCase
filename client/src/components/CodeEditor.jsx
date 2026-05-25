import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye, Pencil } from 'lucide-react';
import { Button } from './Button';

export const CodeEditor = ({ value, onChange, darkMode }) => {
  const [editing, setEditing] = useState(false);
  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Generated output</span>
        <Button variant="ghost" onClick={() => setEditing((current) => !current)}>
          {editing ? <Eye size={16} /> : <Pencil size={16} />}
          {editing ? 'Preview' : 'Edit'}
        </Button>
      </div>
      {editing ? (
        <textarea
          className="min-h-96 w-full resize-y bg-transparent p-4 font-mono text-sm leading-6"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <SyntaxHighlighter language="markdown" style={darkMode ? oneDark : oneLight} customStyle={{ margin: 0, minHeight: 360 }}>
          {value || 'Generated tests will appear here.'}
        </SyntaxHighlighter>
      )}
    </div>
  );
};
