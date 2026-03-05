import { CalendarDays, Target, TrendingUp } from "lucide-react";
import MotionDiv from "./motion-div";

const steps = [
	{
		icon: CalendarDays,
		step: "01",
		title: "Registre Seu Dia",
		description:
			"Clique em qualquer dia do calendário para adicionar treinos ou refeições livres. Use presets rápidos para atividades comuns.",
	},
	{
		icon: Target,
		step: "02",
		title: "Defina Suas Metas",
		description:
			"Estabeleça sua meta semanal de treinos e o limite de refeições livres. Barras de progresso visuais te ajudam a manter o foco.",
	},
	{
		icon: TrendingUp,
		step: "03",
		title: "Acompanhe o Progresso",
		description:
			"Veja o ano inteiro de relance com o heatmap. Acompanhe sequências, analise padrões e mantenha a motivação.",
	},
];

export function HowItWorks() {
	return (
		<section id="how-it-works" className="py-24 lg:py-32">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
					<p className="text-xl text-neutral-400 max-w-2xl mx-auto">
						Comece a registrar em segundos. Sem configurações complexas, sem curva de aprendizado.
					</p>
				</MotionDiv>

				<div className="grid md:grid-cols-3 gap-8 lg:gap-12">
					{steps.map((item, i) => (
						<MotionDiv
							key={item.step}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.15 }}
							className="relative group"
						>
							<div className="absolute -inset-px bg-linear-to-b from-vibrant-green/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 h-full hover:border-vibrant-green/30 transition-colors duration-300">
								<div className="flex items-center justify-between mb-6">
									<div className="w-14 h-14 rounded-xl bg-vibrant-green/10 flex items-center justify-center">
										<item.icon className="w-7 h-7 text-vibrant-green" />
									</div>
									<span className="text-5xl font-bold text-neutral-800 group-hover:text-vibrant-green/20 transition-colors duration-300">
										{item.step}
									</span>
								</div>
								<h3 className="text-2xl font-bold mb-3">{item.title}</h3>
								<p className="text-neutral-400 leading-relaxed">
									{item.description}
								</p>
							</div>
						</MotionDiv>
					))}
				</div>
			</div>
		</section>
	);
}
