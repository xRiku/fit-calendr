import { Check } from "lucide-react";
import { HeatmapPreview } from "./heatmap-preview";
import MotionDiv from "./motion-div";

const benefits = [
	"No complex meal logging or calorie counting",
	"No overwhelming dashboards with 50 metrics",
	"No subscription fees or hidden costs",
	"No ads cluttering your experience",
	"No account required to get started",
];

export function WhyDifferent() {
	return (
		<section className="py-24 lg:py-32 border-t border-neutral-800 bg-neutral-900/20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<MotionDiv
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Built for <span className="text-vibrant-green">Real Life</span>
						</h2>
						<p className="text-xl text-neutral-300 mb-8 leading-relaxed">
							Most fitness apps are either too complex or too restrictive. We
							believe in balance — train hard, enjoy life, and track it all
							without the headache.
						</p>

						<div className="space-y-4">
							{benefits.map((item) => (
								<div key={item} className="flex items-center gap-3">
									<div className="w-6 h-6 rounded-full bg-vibrant-green/20 flex items-center justify-center flex-shrink-0">
										<Check className="w-4 h-4 text-vibrant-green" />
									</div>
									<span className="text-neutral-300">{item}</span>
								</div>
							))}
						</div>
					</MotionDiv>

					<MotionDiv
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						{/* Heatmap Preview */}
						<div className="relative">
							<div className="absolute -inset-4 bg-vibrant-green/10 rounded-3xl blur-2xl" />
							<div className="relative bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 shadow-2xl">
								<h3 className="text-lg font-semibold mb-2">
									Your Year at a Glance
								</h3>
								<p className="text-sm text-neutral-400 mb-6">
									Consistency is key. See your entire fitness journey
									visualized.
								</p>

								<HeatmapPreview />

								<div className="flex items-center justify-between mt-4 text-xs text-neutral-400">
									<span>Less</span>
									<div className="flex gap-1">
										<div className="w-3 h-3 rounded-sm bg-neutral-800" />
										<div className="w-3 h-3 rounded-sm bg-vibrant-green/30" />
										<div className="w-3 h-3 rounded-sm bg-vibrant-green/60" />
										<div className="w-3 h-3 rounded-sm bg-vibrant-green" />
									</div>
									<span>More</span>
								</div>
							</div>
						</div>
					</MotionDiv>
				</div>
			</div>
		</section>
	);
}
