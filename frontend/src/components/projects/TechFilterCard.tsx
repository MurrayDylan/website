import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chip from "../shared/Chip";

interface TechGroup {
  category: string;
  technologies: string[];
}

interface TechFilterCardProps {
  groups: TechGroup[];
  selected: Set<string>;
  onToggle: (tech: string) => void;
}

export default function TechFilterCard({ groups, selected, onToggle }: TechFilterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedTechs = Array.from(selected);

  if (groups.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-neutral-800 bg-neutral-900/60">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-300">Filter by technology</span>
          {selectedTechs.length > 0 && (
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
              {selectedTechs.length} active
            </span>
          )}
        </div>
        <span className="text-xs text-neutral-500">{isExpanded ? "Hide" : "Show all"}</span>
      </button>

      {!isExpanded && selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {selectedTechs.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              selected
              removable
              onClick={() => onToggle(tech)}
            />
          ))}
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 pb-4">
              {groups.map((group) => (
                <div key={group.category}>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        selected={selected.has(tech)}
                        removable={selected.has(tech)}
                        onClick={() => onToggle(tech)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}