import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle } from "lucide-react";
import Link from "next/link";

export function DashboardEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center font-mono">
			<div className="border border-primary/30 bg-[#05050A]/80 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] p-6 mb-6">
				<CalendarDays className="w-12 h-12 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse" />
			</div>
			<h3 className="text-2xl font-bold mb-3 uppercase tracking-widest text-white">Initialize Activity</h3>
			<p className="text-white/60 mb-8 max-w-md">
				Your command center will come online once you log your first mission. Equip your loadout to get started.
			</p>
			<div className="flex flex-col sm:flex-row gap-4">
				<Button
					asChild
					className="bg-primary text-black hover:bg-primary/90 font-bold px-8 rounded-none tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all"
				>
					<Link href="/app/calendar?add=true">
						<PlusCircle className="w-4 h-4 mr-2" />
						Start Mission
					</Link>
				</Button>
				<Button asChild variant="outline" className="border-primary/20 bg-black hover:bg-primary/10 hover:text-primary rounded-none tracking-widest uppercase text-xs">
					<Link href="/app/calendar">Access Datapad</Link>
				</Button>
			</div>
		</div>
	);
}
