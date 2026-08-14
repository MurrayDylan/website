import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export default function PageTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col flex-1 min-h-0"
    >
      <Outlet />
    </motion.div>
  );
}