"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
	const pathname = usePathname();

	return (
		<nav className="flex gap-1 h-full items-center">
			<Link
				href="/app/calendar"
				className={`relative h-9 px-4 flex items-center text-sm font-medium transition-colors hover:text-white ${pathname === "/app/calendar"
						? "text-white bg-white/10 rounded-full"
						: "text-neutral-400 hover:bg-white/5 rounded-full"
					} `}
			>
				Calendar
			</Link>
			<Link
				href="/app/dashboard"
				className={`relative h-9 px-4 flex items-center text-sm font-medium transition-colors hover:text-white ${pathname === "/app/dashboard"
						? "text-white bg-white/10 rounded-full"
						: "text-neutral-400 hover:bg-white/5 rounded-full"
					} `}
			>
				Dashboard
			</Link>
		</nav>
	);
}
