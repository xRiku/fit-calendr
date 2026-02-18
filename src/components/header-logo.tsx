import { Dumbbell } from "lucide-react";

export default function HeaderLogo() {
	return (
		<div className="flex gap-2.5 items-center group cursor-pointer selection:bg-transparent">
			<Dumbbell className="sm:h-6 sm:w-6 h-8 w-8 text-vibrant-green transition-transform group-hover:rotate-[-10deg]" />{" "}
			<p className="text-white hidden sm:inline-block font-bold tracking-tight text-lg">
				<span className="text-vibrant-green">Fit</span>Calendr
			</p>
		</div>
	);
}
