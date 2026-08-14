import { motion } from "framer-motion";
import ArchitectureNode, {
  type ArchitectureNodeProps,
} from "./ArchitectureNode";

export interface ArchitectureFlowItem
  extends Omit<ArchitectureNodeProps, "className"> {
  id: string;
}

interface ArchitectureFlowProps {
  items: ArchitectureFlowItem[];
  direction?: "vertical" | "horizontal";
  className?: string;
}

export default function ArchitectureFlow({
  items,
  direction = "vertical",
  className = "",
}: ArchitectureFlowProps) {
  const isVertical = direction === "vertical";

  return (
    <div className={["w-full min-w-0", className].join(" ")}>
      <div
        className={[
          "flex w-full min-w-0",
          isVertical
            ? "flex-col items-stretch"
            : "flex-col items-stretch lg:flex-row lg:items-stretch",
        ].join(" ")}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              className={[
                "flex min-w-0",
                isVertical
                  ? "flex-col items-center"
                  : "flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center",
              ].join(" ")}
            >
              <ArchitectureNode
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                technologies={item.technologies}
                variant={item.variant}
                className="w-full min-w-0"
              />

              {!isLast && (
                <div
                  className={[
                    "flex shrink-0 items-center justify-center text-neutral-700",
                    isVertical
                      ? "h-7 w-full sm:h-10"
                      : "h-7 w-full lg:h-auto lg:w-8",
                  ].join(" ")}
                >
                  {isVertical ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{
                          delay: index * 0.08 + 0.1,
                          duration: 0.2,
                        }}
                        className="h-4 w-px origin-top bg-neutral-800 sm:h-5"
                      />

                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: index * 0.08 + 0.2,
                        }}
                        className="text-[10px] leading-none sm:text-xs"
                      >
                        ↓
                      </motion.span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="hidden h-px w-5 bg-neutral-800 lg:block" />
                      <span className="text-[10px] lg:text-[11px]">→</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}