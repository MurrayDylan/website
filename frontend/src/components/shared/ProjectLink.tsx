import { useState } from "react";
import { Link } from "react-router-dom";
import { type ProjectLinkResponse } from "../../api/responseTypes";

interface ProjectLinkProps {
  link: ProjectLinkResponse;
  className?: string;
}

const defaultClassName =
  "group inline-flex items-center gap-2 rounded-lg border border-neutral-700/60 bg-neutral-800/40 px-3.5 py-2 text-sm font-medium text-neutral-200 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-white";

function getFaviconUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return null;
  }
}

export default function ProjectLink({
  link,
  className = defaultClassName,
}: ProjectLinkProps) {
  const [imgError, setImgError] = useState(false);
  const isInternal = link.url.trim().startsWith("/");
  const faviconUrl = !isInternal ? getFaviconUrl(link.url) : null;

  const content = (
    <>
      {/* Icon: Favicon for external, clean internal marker for routes */}
      {!isInternal && faviconUrl && !imgError ? (
        <img
          src={faviconUrl}
          alt=""
          className="h-4 w-4 shrink-0 rounded-sm opacity-80 group-hover:opacity-100 transition"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-neutral-400 group-hover:text-blue-400 transition">
          {isInternal ? (
            // Internal route icon
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          ) : (
            // Generic globe fallback icon
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8" />
            </svg>
          )}
        </span>
      )}

      <span>{link.label}</span>

      {/* External link subtle arrow indicator */}
      {!isInternal && (
        <svg 
          className="h-3 w-3 text-neutral-500 group-hover:text-neutral-300 transition -ml-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </>
  );

  if (isInternal) {
    return (
      <Link to={link.url} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}