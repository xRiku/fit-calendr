import MotionDiv from "./motion-div";

const stats = [
	{ value: "10K+", label: "Workouts Logged" },
	{ value: "30 Days", label: "Avg. Streak" },
	{ value: "100%", label: "Free Forever" },
	{ value: "No", label: "Credit Card Required" },
];

export function StatsBar() {
	return (
		<section className="border-y border-primary/20 bg-[#05050A]/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.05)]">
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
							<div className="text-4xl md:text-5xl font-mono font-bold text-vibrant-green mb-2 drop-shadow-[0_0_12px_rgba(var(--vibrant-green),0.8)]">
								{stat.value}
							</div>
							<div className="text-sm font-bold tracking-widest uppercase text-primary/70">{stat.label}</div>
						</MotionDiv>
					))}
				</div>
			</div>
		</section>
	);
}
