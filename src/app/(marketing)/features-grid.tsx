import { Card, CardContent } from "@/components/ui/card";
import {
	CalendarDays,
	Dumbbell,
	Flame,
	Pizza,
	Target,
	TrendingUp,
} from "lucide-react";
import MotionDiv from "./motion-div";

const features = [
	{
		icon: CalendarDays,
		title: "Calendário Interativo",
		description:
			"Visão mensal bonita com indicadores visuais. Clique em qualquer dia para adicionar ou editar entradas instantaneamente.",
	},
	{
		icon: Dumbbell,
		title: "Presets de Treino Personalizados",
		description:
			"Crie presets para Leg Day, Cardio, Yoga ou qualquer atividade que você faz regularmente. Registro com um clique.",
	},
	{
		icon: Pizza,
		title: "Rastreamento de Refeições Livres",
		description:
			"Registre hambúrgueres, pizza ou qualquer indulgência. Controle suas refeições livres com o recurso de orçamento semanal.",
	},
	{
		icon: Flame,
		title: "Contador de Sequência",
		description:
			"Mantenha-se motivado com o rastreamento da sequência atual e a mais longa. Não quebre a corrente!",
	},
	{
		icon: TrendingUp,
		title: "Heatmap Anual",
		description:
			"Visualização estilo GitHub do seu ano inteiro. Identifique padrões e celebre a consistência de relance.",
	},
	{
		icon: Target,
		title: "Metas Semanais",
		description:
			"Defina metas de treinos e limite de refeições livres. Barras de progresso visuais mantêm você responsável.",
	},
];

export function FeaturesGrid() {
	return (
		<section
			id="features"
			className="py-24 lg:py-32 border-t border-neutral-800"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4">
						Tudo que Você Precisa
					</h2>
					<p className="text-xl text-neutral-400 max-w-2xl mx-auto">
						Recursos poderosos, lindamente simples. Nada mais, nada menos.
					</p>
				</MotionDiv>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, i) => (
						<MotionDiv
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<Card className="bg-neutral-900/50 backdrop-blur-sm border-neutral-800 hover:border-vibrant-green/30 transition-all duration-300 h-full group">
								<CardContent className="p-6">
									<div className="w-12 h-12 rounded-lg bg-vibrant-green/10 flex items-center justify-center mb-4 group-hover:bg-vibrant-green/20 transition-colors duration-300">
										<feature.icon className="w-6 h-6 text-vibrant-green" />
									</div>
									<h3 className="text-xl font-bold mb-2 text-white">
										{feature.title}
									</h3>
									<p className="text-neutral-400 leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</MotionDiv>
					))}
				</div>
			</div>
		</section>
	);
}
