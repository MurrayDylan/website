import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  viewUrl: string;
  downloadUrl?: string;
  title?: string;
  isHorizontal?: boolean;
}

interface PdfPageProps {
  pageNumber: number;
  containerWidth: number;
}

export default function PdfViewer({
  viewUrl,
  downloadUrl,
  title = "PDF Document",
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(false);
  };

  const handleLoadError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded border border-red-800/50 bg-red-950 px-1.5 py-0.5 font-mono text-xs uppercase text-red-400">
            PDF
          </span>

          <span className="truncate font-medium text-white">
            {title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 transition hover:text-white"
          >
            Open in New Tab ↗
          </a>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="rounded bg-neutral-700 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-neutral-600"
            >
              Download
            </a>
          )}
        </div>
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="
          relative
          h-[80vh]
          min-h-[400px]
          w-full
          overflow-y-auto
          overflow-x-hidden
          overscroll-contain
          bg-neutral-950
          py-4
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950/90 text-sm text-neutral-400 backdrop-blur-sm">
            Loading PDF preview…
          </div>
        )}

        {error && (
          <div className="flex min-h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium text-white">
                Unable to display this PDF.
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                Try opening the document in a new tab instead.
              </p>
            </div>
          </div>
        )}

        {!error && containerWidth > 0 && (
          <Document
            file={viewUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={null}
            error={null}
            className="flex w-full flex-col items-center gap-4"
          >
            {Array.from({ length: numPages }, (_, index) => (
              <LazyPdfPage
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                containerWidth={containerWidth}
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}

function LazyPdfPage({
  pageNumber,
  containerWidth,
}: PdfPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = pageRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "1200px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /*
   * Leave enough horizontal space for the page to fit inside
   * the viewer without being clipped.
   *
   * The 32px accounts for the viewer's visual padding.
   */
  const pageWidth = Math.max(containerWidth - 32, 1);

  return (
    <div
      ref={pageRef}
      className="flex w-full justify-center px-2 sm:px-4"
    >
      {shouldRender ? (
        <div className="w-fit max-w-full overflow-hidden rounded-sm bg-white shadow-lg">
          <Page
            pageNumber={pageNumber}
            width={pageWidth}
            renderTextLayer
            renderAnnotationLayer
            loading={
              <div
                className="flex items-center justify-center bg-white text-sm text-neutral-500"
                style={{
                  width: pageWidth,
                  minHeight: 200,
                }}
              >
                Loading page {pageNumber}…
              </div>
            }
          />
        </div>
      ) : (
        <div
          className="w-full max-w-[1000px] rounded-sm bg-neutral-900/30"
          style={{
            aspectRatio: "1 / 1.414",
          }}
        />
      )}
    </div>
  );
}