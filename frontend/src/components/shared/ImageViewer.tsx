import { useState } from "react";

interface ImageViewerProps {
  viewUrl: string;
  downloadUrl?: string;
  altText?: string;
  caption?: string;
  className?: string;
}

export default function ImageViewer({
  viewUrl,
  downloadUrl,
  altText = "Image preview",
  caption,
  className = "",
}: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail View */}
      <figure className={`group relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800/50 ${className}`}>
        <div className="relative cursor-pointer overflow-hidden" onClick={() => setIsOpen(true)}>
          <img
            src={viewUrl}
            alt={altText}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              Click to enlarge
            </span>
          </div>
        </div>

        {caption && (
          <figcaption className="px-3 py-2 text-xs text-neutral-400 border-t border-neutral-700/50 bg-neutral-900/40">
            {caption}
          </figcaption>
        )}
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent click inside image from closing overlay
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800 border-b border-neutral-700 text-sm">
              <span className="font-medium text-white truncate max-w-md">
                {caption || altText}
              </span>

              <div className="flex items-center gap-3">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Download
                  </a>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white text-sm px-2 py-0.5 rounded hover:bg-neutral-700"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center p-2 bg-neutral-950 overflow-auto">
              <img
                src={viewUrl}
                alt={altText}
                className="max-h-[80vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}