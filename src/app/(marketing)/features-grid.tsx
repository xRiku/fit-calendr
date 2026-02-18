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
		title: "Interactive Calendar",
		description:
			"Beautiful monthly view with visual indicators. Click any day to add or edit entries instantly.",
	},
	{
		icon: Dumbbell,
		title: "Custom Workout Presets",
		description:
			"Create presets for Leg Day, Cardio, Yoga, or any activity you do regularly. One-click logging.",
	},
	{
		icon: Pizza,
		title: "Cheat Meal Tracking",
		description:
			"Log burgers, pizza, or any indulgence. Keep tabs on your treats with the weekly budget feature.",
	},
	{
		icon: Flame,
		title: "Streak Counter",
		description:
			"Stay motivated with current and longest streak tracking. Don't break the chain!",
	},
	{
		icon: TrendingUp,
		title: "Yearly Heatmap",
		description:
			"GitHub-style visualization of your entire year. Spot patterns and celebrate consistency at a glance.",
	},
	{
		icon: Target,
		title: "Weekly Goals",
		description:
			"Set targets for workouts and budgets for cheat meals. Visual progress bars keep you accountable.",
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
						Everything You Need
					</h2>
					<p className="text-xl text-neutral-400 max-w-2xl mx-auto">
						Powerful features, beautifully simple. Nothing more, nothing less.
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
									<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
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
