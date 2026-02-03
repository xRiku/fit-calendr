import HeaderLogo from "./header-logo";

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<header className="h-14 sm:mb-0 backdrop-blur-md border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-50">
			<div className="px-4 xl:px-6 h-full max-w-7xl mx-auto flex justify-between items-center">
				<HeaderLogo />
				{children}
			</div>
		</header>
	);
}
