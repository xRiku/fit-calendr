import { CalendarDays, Target, TrendingUp } from "lucide-react";
import MotionDiv from "./motion-div";

const steps = [
	{
		icon: CalendarDays,
		step: "01",
		title: "Log Your Mission",
		description:
			"Click any day on the datapad to add workouts or cheat meals. Use quick presets for common activities.",
	},
	{
		icon: Target,
		step: "02",
		title: "Define Objectives",
		description:
			"Set your weekly workout target (XP) and cheat meal budget (HP). We'll help you stay on track with visual HUD bars.",
	},
	{
		icon: TrendingUp,
		step: "03",
		title: "Analyze Stats",
		description:
			"See your entire year at a glance with the glowing heatmap. Track streaks, analyze patterns, and level up.",
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
					<h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">How to Play</h2>
					<p className="text-xl text-primary/70 max-w-2xl mx-auto font-mono">
						Start tracking in seconds. No complex setup, just pure stat-building.
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
							<div className="absolute -inset-px bg-linear-to-b from-primary/30 to-transparent rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
							<div className="relative bg-[#05050A]/80 backdrop-blur-md border border-primary/20 p-8 h-full hover:border-primary/60 transition-colors duration-300 shadow-[inset_0_0_20px_rgba(0,240,255,0.02)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
								<div className="flex items-center justify-between mb-6">
									<div className="w-14 h-14 bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.2)]">
										<item.icon className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
									</div>
									<span className="text-5xl font-mono font-bold text-primary/10 group-hover:text-primary/30 transition-colors duration-300">
										{item.step}
									</span>
								</div>
								<h3 className="text-2xl font-bold mb-3 uppercase tracking-wide text-white/90">{item.title}</h3>
								<p className="text-white/60 leading-relaxed font-mono text-sm">
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
