export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 sm:p-10 bg-neutral-950">
			<div className="w-full max-w-sm">{children}</div>
		</div>
	);
}
