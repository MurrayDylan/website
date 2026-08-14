import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  tag: string;
  description: string;
  tech?: string[];
  date?: string;
}

export default function FeatureCard({
  title,
  tag,
  description,
  tech = [],
  date,
}: FeatureCardProps) {
  return (
    <motion.article
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={[
        "group flex h-full min-w-0 flex-col",
        "rounded-lg border border-neutral-800",
        "bg-neutral-900/30",
        "p-4 sm:p-5",
        "transition-colors hover:border-neutral-700",
        "max-sm:border-neutral-700",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0 text-[9px] font-mono uppercase tracking-wide text-blue-400 sm:text-[10px]">
          {tag}
        </span>

        {date && (
          <span className="shrink-0 text-[9px] font-mono text-neutral-600 sm:text-[10px]">
            {date}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[13px] font-semibold leading-6 text-white sm:mt-4 sm:text-sm">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-[11px] leading-5 text-neutral-400 sm:text-xs sm:leading-6">
        {description}
      </p>

      {tech.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-neutral-800 pt-3 sm:mt-5">
          {tech.map((item) => (
            <span
              key={item}
              className="text-[9px] font-mono text-neutral-500 sm:text-[10px]"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}