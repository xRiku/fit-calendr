import { cn } from "@/lib/utils";

export default function H1({
	children,
	className,
}: {
	children: string | React.ReactNode;
	className?: string;
}) {
	return (
		<h1
			className={cn(
				"text-4xl sm:text-6xl font-extrabold tracking-tight underline-offset-8",
				className,
			)}
		>
			{children}
		</h1>
	);
}
