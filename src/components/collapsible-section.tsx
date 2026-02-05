"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function CollapsibleSection({
	title,
	collapsedHint,
	children,
}: {
	title: string;
	collapsedHint?: string;
	children: React.ReactNode;
}) {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const [expanded, setExpanded] = useState(true);

	useEffect(() => {
		setExpanded(isDesktop);
	}, [isDesktop]);

	return (
		<div>
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 lg:pointer-events-none"
			>
				<span>{title}</span>
				<ChevronDownIcon
					className={cn(
						"size-4 transition-transform duration-200 lg:hidden",
						expanded && "rotate-180",
					)}
				/>
			</button>
			<div
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out",
					expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
				)}
			>
				{children}
			</div>
			{!expanded && collapsedHint && (
				<p className="text-xs text-muted-foreground">{collapsedHint}</p>
			)}
		</div>
	);
}
