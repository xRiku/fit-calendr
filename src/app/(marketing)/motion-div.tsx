"use client";

import { type MotionProps, motion } from "motion/react";

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
