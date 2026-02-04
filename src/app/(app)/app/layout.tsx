import { DayInfoDrawerDialog } from "@/components/day-info-drawer-dialog";
import LoggedHeader from "@/components/logged-header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<div className="flex flex-col min-h-dvh">
				<LoggedHeader />
				<main className="flex flex-col gap-4 pb-8 px-6 pt-6 flex-1">
					{children}
				</main>
				<DayInfoDrawerDialog />
				<Toaster />
			</div>
		</Providers>
	);
}
