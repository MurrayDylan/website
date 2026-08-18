import { useState } from "react";

interface PptViewerProps {
  viewUrl: string;
  downloadUrl?: string;
  title?: string;
  aspectRatio?: string;
  /** Set to true if viewUrl points directly to a raw .ppt/.pptx file requiring Microsoft Office Web Viewer */
  useOfficeViewer?: boolean;
}

export default function PptViewer({
  viewUrl,
  downloadUrl,
  title = "PowerPoint Presentation",
  aspectRatio = "16/9",
  useOfficeViewer = true,
}: PptViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Office Web Viewer wraps public URLs to render PPT/PPTX in an iframe
  const iframeSrc = useOfficeViewer
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`
    : viewUrl;

  return (
    <div className="flex flex-col w-full rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800 border-b border-neutral-700 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800/50 uppercase shrink-0">
            PPT
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
            Loading presentation preview…
          </div>
        )}

        <iframe
          src={iframeSrc}
          title={title}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}