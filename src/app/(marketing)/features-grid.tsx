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
		title: "Interactive Datapad",
		description:
			"Beautiful monthly view with glowing indicators. Click any day to log your progress instantly.",
	},
	{
		icon: Dumbbell,
		title: "Custom Loadouts",
		description:
			"Create presets for Leg Day, Cardio, or any mission you run regularly. One-click equipping.",
	},
	{
		icon: Pizza,
		title: "HP Budget Tracking",
		description:
			"Log cheat meals or any indulgence. Keep tabs on your treats with the weekly HP budget feature.",
	},
	{
		icon: Flame,
		title: "Streak Multiplier",
		description:
			"Stay motivated with current and longest streak tracking. Don't break the combo chain!",
	},
	{
		icon: TrendingUp,
		title: "Yearly Heatmap",
		description:
			"Contribution-style visualization of your entire year. Spot patterns and celebrate levels reached at a glance.",
	},
	{
		icon: Target,
		title: "Weekly Objectives",
		description:
			"Set targets for workouts (XP) and budgets for cheat meals (HP). Visual progress bars keep you accountable.",
	},
];

export function FeaturesGrid() {
	return (
		<section
			id="features"
			className="py-24 lg:py-32 border-t border-primary/20 bg-black"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider text-white">
						<span className="text-transparent border-b-2 border-primary pb-2 text-white">System Tools</span>
					</h2>
					<p className="text-xl text-primary/70 max-w-2xl mx-auto font-mono mt-8">
						Powerful features, beautifully designed. Everything you need to conquer your goals.
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
							<Card className="bg-[#05050A]/60 backdrop-blur-md border border-primary/20 hover:border-vibrant-green/50 hover:shadow-[0_0_20px_rgba(var(--vibrant-green),0.15)] transition-all duration-300 h-full group rounded-none">
								<CardContent className="p-6">
									<div className="w-12 h-12 rounded-none border border-primary/30 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-vibrant-green/20 group-hover:border-vibrant-green/40 transition-colors duration-300 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] group-hover:shadow-[inset_0_0_15px_rgba(var(--vibrant-green),0.3)]">
										<feature.icon className="w-6 h-6 text-primary group-hover:text-vibrant-green drop-shadow-[0_0_5px_rgba(var(--primary),0.8)] group-hover:drop-shadow-[0_0_8px_rgba(var(--vibrant-green),0.8)] transition-all" />
									</div>
									<h3 className="text-xl font-bold mb-2 text-white uppercase tracking-wide group-hover:text-vibrant-green transition-colors">{feature.title}</h3>
									<p className="text-white/60 leading-relaxed font-mono text-sm">
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
