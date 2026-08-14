import { useLocation } from "react-router-dom";
import { useContext } from "react";
import TypewriterTitle from "../shared/TypewriterTitle";
import PageTransition from "./PageTransition";
import { TitleProvider, TitleContext } from "../../context/TitleContext";

const PAGE_TITLES: Record<string, string> = {
  "/about": "About Me",
  "/education": "Education",
  "/work": "Work Experience",
  "/projects": "Projects",
  "/skills": "Skills",
  "/contact": "Contact Me",
  "/dissertation": "Masters Dissertation",
  "/about-this-website": "About This Website",
  "/admin": "Admin Dashboard",
  "/login": "Admin Login",
  "/admin/pages": "Manage Pages",
  "/admin/pages/new": "New Page",
  "/admin/projects": "Manage Projects",
  "/admin/projects/new": "New Project",
  "/admin/work": "Manage Work Experience",
  "/admin/work/new": "New Work Experience",
};

interface ContentPanelProps {
  onOpenMobileMenu?: () => void;
}

function PanelContent({ onOpenMobileMenu }: ContentPanelProps) {
  const location = useLocation();
  const baseTitle = PAGE_TITLES[location.pathname] ?? "";
  const { titleOverride, headerAction } = useContext(TitleContext)!;

  const displayTitle = titleOverride ?? baseTitle;

  return (
    <main className="flex-1 h-full min-h-0 rounded-xl bg-neutral-950/90 text-neutral-100 shadow-lg overflow-hidden flex flex-col relative w-full">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 z-20 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="min-w-0 truncate flex-1">
            <TypewriterTitle text={displayTitle} />
          </div>
        </div>

        {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 shrink-0 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        
        {headerAction && (
          <div className="flex items-center gap-4 shrink-0">{headerAction}</div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 pt-4 pb-8 [scrollbar-gutter:stable] relative z-10 flex flex-col custom-scrollbar">
        <PageTransition />
      </div>
    </main>
  );
}

export default function ContentPanel({ onOpenMobileMenu }: ContentPanelProps) {
  return (
    <TitleProvider>
      <PanelContent onOpenMobileMenu={onOpenMobileMenu} />
    </TitleProvider>
  );
}