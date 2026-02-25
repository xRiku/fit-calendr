import MotionDiv from "./motion-div";

const stats = [
	{ value: "10K+", label: "Workouts Logged" },
	{ value: "30 Days", label: "Avg. Streak" },
	{ value: "100%", label: "Free Forever" },
	{ value: "No", label: "Credit Card Required" },
];

export function StatsBar() {
	return (
		<section className="border-y border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
					{stats.map((stat, i) => (
						<MotionDiv
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="text-center"
						>
							<div className="text-3xl md:text-4xl font-bold text-vibrant-green mb-1">
								{stat.value}
							</div>
							<div className="text-sm text-neutral-400">{stat.label}</div>
						</MotionDiv>
					))}
				</div>
			</div>
		</section>
	);
}
