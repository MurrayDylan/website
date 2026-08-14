import { useState } from "react";

interface PdfViewerProps {
  viewUrl: string;
  downloadUrl?: string;
  title?: string;
  aspectRatio?: string;
}

export default function PdfViewer({
  viewUrl,
  downloadUrl,
  title = "PDF Document",
  aspectRatio = "12/17",
}: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col w-full rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800 border-b border-neutral-700 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/50 uppercase shrink-0">
            PDF
          </span>
          <span className="font-medium text-white truncate">{title}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-white transition"
          >
            Open in New Tab ↗
          </a>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="rounded bg-neutral-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-600 transition"
            >
              Download
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full bg-neutral-950" style={{ aspectRatio }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
            Loading PDF preview…
          </div>
        )}

        <iframe
          src={`${viewUrl}#toolbar=1&navpanes=0`}
          title={title}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}