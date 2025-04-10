"use client";

import { motion, type MotionProps } from "motion/react";

export default function MotionDiv({
  children,
  className,
  ...props
}: MotionProps & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}
