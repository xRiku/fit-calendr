import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle } from "lucide-react";
import Link from "next/link";

export function DashboardEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="bg-neutral-900/50 p-6 rounded-full mb-6">
				<CalendarDays className="w-12 h-12 text-vibrant-green" />
			</div>
			<h3 className="text-2xl font-bold mb-3">Comece a Monitorar Seus Hábitos</h3>
			<p className="text-neutral-400 mb-8 max-w-md">
				Seu dashboard mostrará os resultados assim que você adicionar seu primeiro treino ou
				refeição livre.
			</p>
			<div className="flex flex-col sm:flex-row gap-4">
				<Button
					asChild
					className="bg-vibrant-green text-black hover:bg-vibrant-green/90 font-semibold px-6"
				>
					<Link href="/app/calendar?add=true">
						<PlusCircle className="w-4 h-4 mr-2" />
						Adicione seu Primeiro Registro
					</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/app/calendar">Navegar no Calendário</Link>
				</Button>
			</div>
		</div>
	);
}
