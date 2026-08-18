import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TypewriterTitle from "../shared/TypewriterTitle";
import PageTransition from "./PageTransition";
import Sidebar from "./Sidebar";
import { TitleProvider, TitleContext } from "../../context/TitleContext";
import type { LayoutMode } from "./AppShell";

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
  layoutMode: LayoutMode;
  showMobileMenu: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
}

function PanelContent({
  layoutMode,
  showMobileMenu,
  onOpenMobileMenu,
  onCloseMobileMenu,
}: ContentPanelProps) {
  const isMobile = layoutMode === "mobile";
  const location = useLocation();

  const baseTitle = PAGE_TITLES[location.pathname] ?? "";

  const { titleOverride, headerAction } =
    useContext(TitleContext)!;

  const displayTitle =
    titleOverride ?? baseTitle;

  const title = showMobileMenu
    ? "Dylan Murray"
    : displayTitle;

  return (
    <main
      className={`
        flex-1
        h-full
        min-h-0
        ${isMobile ? "" : "rounded-xl"}
        bg-neutral-950/90
        text-neutral-100
        shadow-lg
        overflow-hidden
        flex
        flex-col
        relative
        w-full
      `}
    >
      <div
        className="
          px-5
          sm:px-10
          py-4
          flex
          items-center
          justify-between
          shrink-0
          z-20
          gap-4
        "
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="min-w-0 truncate flex-1">
            <TypewriterTitle text={title} />
          </div>
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={
              showMobileMenu
                ? onCloseMobileMenu
                : onOpenMobileMenu
            }
            className="
              p-2.5
              rounded-lg
              bg-neutral-900
              text-neutral-300
              hover:text-white
              border
              border-neutral-800
              shrink-0
              transition-colors
            "
            aria-label={
              showMobileMenu
                ? "Close menu"
                : "Open menu"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showMobileMenu ? "close" : "menu"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {showMobileMenu ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 6l12 12M18 6L6 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        )}

        {headerAction && !showMobileMenu && (
          <div className="flex items-center gap-4 shrink-0">
            {headerAction}
          </div>
        )}
      </div>

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          px-5
          sm:px-10
          pt-5
          pb-10
          [scrollbar-gutter:stable]
          relative
          z-10
          flex
          flex-col
          custom-scrollbar
        "
      >
        {isMobile ? (
          <AnimatePresence mode="wait" initial={false}>
            {showMobileMenu ? (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="flex flex-col flex-1 min-h-0"
              >
                <Sidebar
                  className="w-full"
                  mobileView
                  onClose={onCloseMobileMenu}
                />
              </motion.div>
            ) : (
              <motion.div
                key="page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="flex flex-col flex-1 min-h-0"
              >
                <PageTransition layoutMode={layoutMode} />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <PageTransition layoutMode={layoutMode} />
        )}
      </div>
    </main>
  );
}

export default function ContentPanel({
  layoutMode,
  showMobileMenu,
  onOpenMobileMenu,
  onCloseMobileMenu,
}: ContentPanelProps) {
  return (
    <TitleProvider>
      <PanelContent
        layoutMode={layoutMode}
        showMobileMenu={showMobileMenu}
        onOpenMobileMenu={onOpenMobileMenu}
        onCloseMobileMenu={onCloseMobileMenu}
      />
    </TitleProvider>
  );
}