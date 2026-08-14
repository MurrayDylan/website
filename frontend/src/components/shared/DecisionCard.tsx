import { motion } from "framer-motion";

interface DecisionCardProps {
  title: string;
  problem: string;
  decision: string;
  reason: string;
  className?: string;
}

export default function DecisionCard({
  title,
  problem,
  decision,
  reason,
  className = "",
}: DecisionCardProps) {
  return (
    <motion.article
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={[
        "min-w-0 rounded-lg",
        "border border-neutral-800",
        "bg-neutral-900/30",
        "p-4 sm:p-5",
        "transition-colors hover:border-neutral-700",
        "max-sm:border-neutral-700",
        className,
      ].join(" ")}
    >
      <h3 className="text-[13px] font-semibold leading-6 text-white sm:text-sm">
        {title}
      </h3>

      <div className="mt-4 space-y-4 sm:mt-5">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-wide text-neutral-600 sm:text-[10px]">
            Problem
          </p>

          <p className="mt-1.5 text-[11px] leading-5 text-neutral-400 sm:text-xs sm:leading-6">
            {problem}
          </p>
        </div>

        <div>
          <p className="text-[9px] font-mono uppercase tracking-wide text-blue-400 sm:text-[10px]">
            Decision
          </p>

          <p className="mt-1.5 text-[11px] leading-5 text-neutral-300 sm:text-xs sm:leading-6">
            {decision}
          </p>
        </div>

        <div>
          <p className="text-[9px] font-mono uppercase tracking-wide text-neutral-600 sm:text-[10px]">
            Why
          </p>

          <p className="mt-1.5 text-[11px] leading-5 text-neutral-400 sm:text-xs sm:leading-6">
            {reason}
          </p>
        </div>
      </div>
    </motion.article>
  );
}