import { Dumbbell } from "lucide-react";

export default function HeaderLogo() {
	return (
		<div className="flex gap-2.5 items-center group cursor-pointer selection:bg-transparent">
			<div className="relative">
				<Dumbbell className="sm:h-6 sm:w-6 h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110 relative z-10" />
				<div className="absolute inset-0 bg-primary/40 blur-md rounded-full -z-10 group-hover:bg-primary/60 transition-colors duration-300" />
			</div>
			<p className="text-foreground hidden sm:inline-block font-extrabold tracking-tighter text-xl uppercase italic">
				<span className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]">Fit</span>Calendr
			</p>
		</div>
	);
}
