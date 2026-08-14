import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export interface ContentTabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ContentTabsProps {
  tabs: ContentTabItem[];
  defaultTab?: string;
  className?: string;
}

export default function ContentTabs({
  tabs,
  defaultTab,
  className = "",
}: ContentTabsProps) {
  const initialTab =
    defaultTab && tabs.some((tab) => tab.id === defaultTab)
      ? defaultTab
      : tabs[0]?.id;

  const [activeTab, setActiveTab] = useState(initialTab);

  const activeContent = tabs.find((tab) => tab.id === activeTab);

  if (!activeContent) {
    return null;
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      <div
        role="tablist"
        aria-label="Technology areas"
        className={[
          "flex w-full min-w-0 items-end gap-1",
          "overflow-x-auto overflow-y-hidden",
          "overscroll-x-contain",
          "pb-0",
        ].join(" ")}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "relative shrink-0",
                "rounded-t-md",
                "px-3.5 py-2.5 sm:px-5 sm:py-3",
                "text-[10px] font-medium sm:text-xs",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
                "max-sm:border-neutral-700",

                isActive
                  ? [
                      "z-30",
                      "-mb-px",

                      // The active tab is the only tab with the
                      // page-outline treatment.
                      "border border-white/80",
                      "border-b-neutral-950",

                      "bg-neutral-950",
                      "text-white",
                    ].join(" ")
                  : [
                      "z-10",
                      "border border-neutral-800",
                      "bg-neutral-900/50",
                      "text-neutral-500",
                      "hover:bg-neutral-900",
                      "hover:text-neutral-300",
                    ].join(" "),
              ].join(" ")}
            >
              {tab.label}

              {isActive && (
                <motion.span
                  layoutId="active-tab-edge"
                  className="absolute bottom-[-1px] left-0 right-0 h-px bg-neutral-950"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`tabpanel-${activeContent.id}`}
        role="tabpanel"
        className={[
          "relative z-20",
          "w-full min-w-0 overflow-hidden",

          // Page/card shape
          "rounded-b-md rounded-tr-md",

          // Light outline around the page itself (full border so it runs continuously under inactive tabs)
          "border border-white/80",

          "bg-neutral-950",
        ].join(" ")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeContent.id}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.16 }}
            className="w-full min-w-0 p-4 sm:p-5 md:p-7"
          >
            {activeContent.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}