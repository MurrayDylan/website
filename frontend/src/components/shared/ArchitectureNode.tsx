import { motion } from "framer-motion";

export interface ArchitectureNodeProps {
  title: string;
  subtitle?: string;
  description?: string;
  technologies?: string[];
  variant?: "default" | "primary" | "database" | "storage";
  className?: string;
}

const variantClasses = {
  default:
    "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700",
  primary:
    "border-blue-500/20 bg-blue-500/[0.04] hover:border-blue-500/30",
  database:
    "border-emerald-500/20 bg-emerald-500/[0.035] hover:border-emerald-500/30",
  storage:
    "border-amber-500/20 bg-amber-500/[0.035] hover:border-amber-500/30",
};

const labelClasses = {
  default: "text-neutral-500",
  primary: "text-blue-400",
  database: "text-emerald-400",
  storage: "text-amber-400",
};

export default function ArchitectureNode({
  title,
  subtitle,
  description,
  technologies = [],
  variant = "default",
  className = "",
}: ArchitectureNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={[
        "rounded-lg border p-4 transition-colors",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          {subtitle && (
            <p
              className={[
                "mt-1 text-[11px] uppercase tracking-wide",
                labelClasses[variant],
              ].join(" ")}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs leading-6 text-neutral-400">
          {description}
        </p>
      )}

      {technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="text-[11px] font-mono text-neutral-500"
            >
              {technology}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}