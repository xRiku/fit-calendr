import { DayInfoDrawerDialog } from "@/components/day-info-drawer-dialog";
import LoggedHeader from "@/components/logged-header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<LoggedHeader />
			<main className="flex flex-col justify-center gap-4 p-8 pt-6 ">
				{children}
			</main>
			<DayInfoDrawerDialog />
			<Toaster />
		</>
	);
}
