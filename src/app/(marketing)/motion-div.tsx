"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

export default function MotionDiv({
	children,
	className,
	...props
}: HTMLMotionProps<"div"> & { children?: React.ReactNode; className?: string }) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className={className}
				{...props}
				transition={shouldReduceMotion ? { duration: 0 } : props.transition}
			>
				{children}
			</m.div>
		</LazyMotion>
	);
}
