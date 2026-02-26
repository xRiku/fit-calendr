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
		<section className="py-24 lg:py-32 border-t border-primary/20 bg-black/80">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<MotionDiv
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-wider">
							Built for <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-vibrant-green drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">Real Players</span>
						</h2>
						<p className="text-xl text-primary/70 mb-8 leading-relaxed font-mono">
							Most fitness apps are either too complex or too restrictive. We
							believe in balance — run your missions, enjoy your loot, and track it all
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
						className="relative font-mono"
					>
						{/* Heatmap Preview */}
						<div className="relative">
							<div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
							<div className="relative bg-[#05050A]/90 backdrop-blur-xl rounded-none border border-primary/30 p-6 shadow-[0_0_30px_rgba(var(--primary),0.05)]">
								<h3 className="text-lg font-bold mb-2 uppercase text-primary tracking-widest">
									Player Activity
								</h3>
								<p className="text-sm text-primary/50 mb-6">
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
