import { cn } from "@/lib/utils";

export default function H2({
	children,
	className,
}: {
	children: string | React.ReactNode;
	className?: string;
}) {
	return (
		<h2 className={cn("text-3xl font-bold tracking-tight", className)}>
			{children}
		</h2>
	);
}
