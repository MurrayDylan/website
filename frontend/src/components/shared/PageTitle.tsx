import { motion, AnimatePresence } from "framer-motion";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.h2
        key={title}
        initial={{ opacity: 0, scaleX: 0.96 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0.96 }}
        transition={{ duration: 0.15 }}
        className="text-2xl font-semibold mb-6 text-neutral-100 origin-left"
      >
        {title}
      </motion.h2>
    </AnimatePresence>
  );
}