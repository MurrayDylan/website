import { type Variants } from "framer-motion";

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.2, ease: "easeOut" } 
  },
};