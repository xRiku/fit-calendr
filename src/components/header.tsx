import HeaderLogo from "./header-logo";

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<header className="h-14 sm:mb-0 backdrop-blur-xl bg-neutral-900/60 fixed top-0 left-0 right-0 z-50 border-b border-white/5 supports-[backdrop-filter]:bg-neutral-900/60">
			<div className="px-4 xl:px-6 h-full max-w-7xl mx-auto flex justify-between items-center">
				<HeaderLogo />
				{children}
			</div>
		</header>
	);
}
