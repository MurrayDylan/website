import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioData } from "../context/PortfolioContext";
import { useTitleOverride } from "../context/TitleContext";
import WorkExperienceCard from "../components/work/WorkExperienceCard";
import { staggerContainer } from "../util/animation";

export default function WorkPage() {
  const { work } = usePortfolioData();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  const sortedWork = work.status === "success" 
    ? [...work.data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)) 
    : [];

  const selectedEntry =
    work.status === "success" && expandedId !== null
      ? sortedWork.find((entry) => entry.id === expandedId) ?? null
      : null;

  useEffect(() => {
    if (selectedEntry) {
      setTitleOverride(`Work Experience/${selectedEntry.companyName}`);
      setHeaderAction(
        <button
          onClick={() => setExpandedId(null)}
          className="rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-1.5 text-sm text-neutral-300 transition hover:border-blue-400 hover:text-white"
        >
          Close
        </button>
      );
    } else {
      setTitleOverride(null);
      setHeaderAction(null);
    }

    return () => {
      setTitleOverride(null);
      setHeaderAction(null);
    };
  }, [selectedEntry, setTitleOverride, setHeaderAction]);

  if (work.status === "loading") return <p>Loading work experience…</p>;
  if (work.status === "error") return <p>Couldn't load work experience: {work.message}</p>;
  if (work.status === "not-implemented") return <p>Coming soon.</p>;

  return (
    <motion.div
      key={`work-page-${sortedWork.length}`}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="relative min-h-full flex flex-col flex-1"
    >
      {!selectedEntry ? (
        <div className="flex flex-col gap-4 flex-1 pr-1">
          {sortedWork.length === 0 && (
            <p className="text-neutral-500 text-sm">No work experience listed yet.</p>
          )}
          {sortedWork.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <WorkExperienceCard
                entry={entry}
                onToggleExpand={() => setExpandedId(entry.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEntry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col pt-2"
          >
            <WorkExperienceCard
              entry={selectedEntry}
              isOverlay={true}
              onToggleExpand={() => setExpandedId(null)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}