import { DayInfoDrawerDialog } from "@/components/day-info-drawer-dialog";
import LoggedHeader from "@/components/logged-header";
import { BottomNav } from "@/components/bottom-nav";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<div className="flex flex-col h-dvh overflow-hidden pt-0 md:pt-14 relative group">
				<div className="hidden md:block">
					<LoggedHeader />
				</div>
				<main className="flex flex-col gap-4 pb-20 md:pb-8 px-4 md:px-6 pt-safe md:pt-4 flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
					{children}
				</main>
				<BottomNav />
				<DayInfoDrawerDialog />
				<Toaster />
			</div>
		</Providers>
	);
}
