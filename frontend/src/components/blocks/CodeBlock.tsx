import { useState } from "react";

export interface CodeBlockData {
  _type: "code";
  language?: string;
  filename?: string;
  code: string;
}

export default function CodeBlock({ data }: { data: CodeBlockData }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!data.code) return;
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-neutral-400">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 shrink-0" />
          {data.filename && (
            <span className="ml-2 text-neutral-300 font-medium truncate">{data.filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {data.language && (
            <span className="uppercase text-[10px] text-neutral-500">{data.language}</span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-neutral-400 hover:text-white transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-neutral-200 leading-relaxed">
        <code>{data.code}</code>
      </pre>
    </div>
  );
}