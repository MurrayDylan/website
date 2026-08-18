import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import type { LayoutMode } from "./AppShell";

interface PageTransitionProps {
  layoutMode: LayoutMode;
}

export default function PageTransition({
  layoutMode,
}: PageTransitionProps) {
  const isMobile = layoutMode === "mobile";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.15,
        ease: "easeOut",
      }}
      className={`
        flex
        flex-col
        flex-1
        min-h-0
        ${isMobile ? "w-full" : "w-full"}
      `}
    >
      <Outlet context={{ layoutMode }} />
    </motion.div>
  );
}