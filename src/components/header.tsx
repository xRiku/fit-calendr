import HeaderLogo from "./header-logo";

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<header className="px-4 xl:px-6 h-14 flex justify-between items-center sm:mb-0 backdrop-blur-md border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-50">
			<HeaderLogo />
			{children}
		</header>
	);
}
