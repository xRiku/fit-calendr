import { CalendarDays, Target, TrendingUp } from "lucide-react";
import MotionDiv from "./motion-div";

const steps = [
	{
		icon: CalendarDays,
		step: "01",
		title: "Log Your Day",
		description:
			"Click any day on the calendar to add workouts or cheat meals. Use quick presets for common activities.",
	},
	{
		icon: Target,
		step: "02",
		title: "Set Your Goals",
		description:
			"Define your weekly workout target and cheat meal budget. We'll help you stay on track with visual progress bars.",
	},
	{
		icon: TrendingUp,
		step: "03",
		title: "Watch Progress",
		description:
			"See your entire year at a glance with the heatmap. Track streaks, analyze patterns, and stay motivated.",
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
					<h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
					<p className="text-xl text-neutral-400 max-w-2xl mx-auto">
						Start tracking in seconds. No complex setup, no learning curve.
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
