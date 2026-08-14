import { motion } from "framer-motion";
import {
  type ArchitectureNodeProps,
} from "./ArchitectureNode";

interface ArchitectureGroupProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  nodes?: ArchitectureNodeProps[];
  className?: string;
}

export default function ArchitectureGroup({
  title,
  description,
  children,
  nodes = [],
  className = "",
}: ArchitectureGroupProps) {
  return (
    <section
      className={[
        "w-full min-w-0",
        "rounded-lg border border-neutral-800",
        "bg-neutral-950/40",
        className,
      ].join(" ")}
    >
      {/* ------------------------------------------------------------ */}
      {/* Group header                                                   */}
      {/* ------------------------------------------------------------ */}

      <div className="border-b border-neutral-800 px-3 py-3 sm:px-5 sm:py-5">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-neutral-700" />

          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              {title}
            </h3>

            {description && (
              <p className="mt-1 max-w-xl text-[10px] sm:text-xs leading-4 sm:leading-6 text-neutral-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Architecture layers (Forced 3 columns, tightly scaling text)   */}
      {/* ------------------------------------------------------------ */}

      {nodes.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-neutral-800/80">
          {nodes.map((node, index) => (
            <ArchitectureLayer
              key={`${node.title}-${index}`}
              node={node}
              index={index}
            />
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Optional custom content                                       */}
      {/* ------------------------------------------------------------ */}

      {children && (
        <div className="border-t border-neutral-800 px-3 py-3 sm:px-5 sm:py-5">
          {children}
        </div>
      )}
    </section>
  );
}

function ArchitectureLayer({
  node,
  index,
}: {
  node: ArchitectureNodeProps;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.2,
      }}
      className={[
        "group",
        "flex flex-col min-w-0",
        "px-2 py-3 sm:px-5 sm:py-6",
        "transition-colors duration-200",
        "hover:bg-neutral-900/30",
      ].join(" ")}
    >
      {/* Top row: Number and Subtitle */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[8px] sm:text-[10px] text-neutral-700 transition-colors group-hover:text-neutral-500">
          {String(index + 1).padStart(2, "0")}
        </span>

        {node.subtitle && (
          <span className="text-[7px] sm:text-[10px] uppercase tracking-[0.05em] sm:tracking-[0.1em] text-neutral-600 truncate ml-0.5">
            {node.subtitle}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-[10px] sm:text-sm font-semibold leading-tight sm:leading-5 text-white">
        {node.title}
      </h4>

      {/* Description */}
      <p className="mt-1 text-[9px] sm:text-xs leading-3.5 sm:leading-6 text-neutral-400 flex-1">
        {node.description}
      </p>

      {/* Technologies */}
      {node.technologies && node.technologies.length > 0 && (
        <div className="mt-2 sm:mt-4 flex flex-wrap gap-x-1.5 gap-y-1 pt-2 sm:pt-3 border-t border-neutral-800/60">
          {node.technologies.map((technology) => (
            <span
              key={technology}
              className="font-mono text-[7px] sm:text-[9px] text-neutral-600"
            >
              {technology}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}