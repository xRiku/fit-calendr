import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import MotionDiv from "./motion-div";

const testimonials = [
	{
		quote:
			"Finalmente, um app de fitness que não tenta fazer tudo. Só registro meus treinos e refeições livres ocasionais. Simples.",
		author: "Alex M.",
		title: "Levantador de Peso",
	},
	{
		quote:
			"O heatmap anual é viciante. Ver minha consistência visualizada me mantém motivado a não quebrar a sequência.",
		author: "Sarah K.",
		title: "Atleta de CrossFit",
	},
	{
		quote:
			"Adoro que ele também rastreia refeições livres. A maioria dos apps te envergonha por isso, mas esse me ajuda a manter o equilíbrio sem culpa.",
		author: "Mike R.",
		title: "Atleta de Fim de Semana",
	},
];

export function Testimonials() {
	return (
		<section className="py-24 lg:py-32 border-t border-neutral-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4">
						Amado por Atletas
					</h2>
					<p className="text-xl text-neutral-400">
						Junte-se a milhares acompanhando sua jornada fitness
					</p>
				</MotionDiv>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, i) => (
						<MotionDiv
							key={testimonial.author}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.15 }}
						>
							<Card className="bg-neutral-900/50 backdrop-blur-sm border-neutral-800 h-full">
								<CardContent className="p-8 flex flex-col h-full">
									<div className="flex gap-1 mb-4">
										{Array.from({ length: 5 }).map((_, j) => (
											<Star
												// biome-ignore lint/suspicious/noArrayIndexKey: static stars
												key={j}
												className="w-5 h-5 text-vibrant-green fill-vibrant-green"
											/>
										))}
									</div>
									<p className="text-neutral-300 leading-relaxed flex-grow mb-6">
										"{testimonial.quote}"
									</p>
									<div>
										<p className="font-semibold text-white">
											{testimonial.author}
										</p>
										<p className="text-sm text-neutral-400">
											{testimonial.title}
										</p>
									</div>
								</CardContent>
							</Card>
						</MotionDiv>
					))}
				</div>
			</div>
		</section>
	);
}
