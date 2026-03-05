import { CalendarDays, Flame } from "lucide-react";
import Link from "next/link";

const productLinks = [
	{ label: "Funcionalidades", href: "#features" },
	{ label: "Como Funciona", href: "#how-it-works" },
	{ label: "Começar", href: "/auth/sign-in" },
];

const legalLinks = [
	{ label: "Política de Privacidade", href: "/privacy-policy" },
	{ label: "Termos de Serviço", href: "/terms-of-service" },
];

export function LandingFooter() {
	return (
		<footer className="border-t border-neutral-800 py-12 bg-neutral-900/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div className="md:col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-vibrant-green flex items-center justify-center">
								<CalendarDays className="w-5 h-5 text-black" />
							</div>
							<span className="font-bold text-xl">FitCalendr</span>
						</div>
						<p className="text-neutral-400 max-w-sm">
							O rastreador fitness minimalista para quem treina pesado e aproveita
							a vida. Registre treinos, acompanhe refeições livres, visualize o progresso.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Produto</h4>
						<ul className="space-y-2 text-neutral-400">
							{productLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="hover:text-vibrant-green transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Legal</h4>
						<ul className="space-y-2 text-neutral-400">
							{legalLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="hover:text-vibrant-green transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-neutral-400 text-sm">
						© {new Date().getFullYear()} FitCalendr. Todos os direitos reservados.
					</p>
					<div className="flex items-center gap-2 text-sm text-neutral-400">
						<span>Feito com</span>
						<Flame className="w-4 h-4 text-vibrant-orange" />
						<span>para entusiastas do fitness</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
