import { Button } from "@/components/ui/button";
import {
	CalendarDays,
	Check,
	ChevronRight,
	Dumbbell,
	Lock,
	Pizza,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import MotionDiv from "./motion-div";

export function HeroSection() {
	return (
		<section className="relative min-h-[90vh] flex items-center">
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-vibrant-green/20 rounded-full blur-[150px] animate-pulse" />
				<div
					className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vibrant-orange/15 rounded-full blur-[130px] animate-pulse"
					style={{ animationDelay: "1s" }}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vibrant-green/5 rounded-full blur-[200px]" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<MotionDiv
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="space-y-8"
					>
						{/* Headline */}
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
							Track Fitness.
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-vibrant-green to-vibrant-green-light">
								Stay Balanced.
							</span>
						</h1>

						{/* Subheadline */}
						<p className="text-xl text-neutral-300 max-w-lg leading-relaxed">
							The minimalist habit tracker for people who train hard and enjoy
							life. Log workouts, track cheat meals, visualize your progress —
							all in one beautiful calendar.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								asChild
								size="lg"
								className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-bold text-lg px-8 py-6 rounded-full transition-all hover:scale-105 active:scale-95 group"
							>
								<Link href="/auth/sign-in" className="flex items-center gap-2">
									Start Tracking Free
									<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="border-neutral-700 hover:border-vibrant-green/50 text-white font-semibold text-lg px-8 py-6 rounded-full bg-neutral-900/50 backdrop-blur-sm"
							>
								<Link href="#how-it-works">See How It Works</Link>
							</Button>
						</div>

						{/* Trust Indicators */}
						<div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
							<div className="flex items-center gap-2">
								<Check className="w-4 h-4 text-vibrant-green" />
								<span>Free forever</span>
							</div>
							<div className="flex items-center gap-2">
								<Lock className="w-4 h-4 text-vibrant-green" />
								<span>Privacy-first</span>
							</div>
							<div className="flex items-center gap-2">
								<Zap className="w-4 h-4 text-vibrant-green" />
								<span>No setup required</span>
							</div>
						</div>
					</MotionDiv>

					{/* Hero Visual */}
					<MotionDiv
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="hidden lg:block"
					>
						<HeroVisual />
					</MotionDiv>
				</div>
			</div>
		</section>
	);
}

function HeroVisual() {
	const calendarDays = [
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		{ workout: true },
		{ workout: true },
		null,
		{ workout: true },
		null,
		{ cheat: true },
		{ workout: true },
		null,
		null,
		{ workout: true },
		{ workout: true },
		null,
		{ cheat: true },
		null,
		null,
		{ workout: true },
		null,
		{ workout: true, cheat: true },
		null,
		{ workout: true },
		null,
		null,
	];

	return (
		<div className="relative">
			{/* Glow effect */}
			<div className="absolute -inset-4 bg-vibrant-green/20 rounded-3xl blur-2xl" />

			{/* Calendar Preview */}
			<div className="relative bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 shadow-2xl">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold">February 2026</h3>
						<p className="text-sm text-neutral-400">Your activity this month</p>
					</div>
					<div className="flex gap-2">
						<div className="flex items-center gap-1.5 text-xs">
							<div className="w-3 h-3 rounded-sm bg-vibrant-green" />
							<span className="text-neutral-400">Workout</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs">
							<div className="w-3 h-3 rounded-sm bg-vibrant-orange" />
							<span className="text-neutral-400">Cheat</span>
						</div>
					</div>
				</div>

				{/* Calendar Grid */}
				<div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
					{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
						<div
							key={`hero-weekday-${day}-${i}`}
							className="text-neutral-500 font-medium py-2"
						>
							{day}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7 gap-2">
					{calendarDays.map((day, i) => (
						<div
							key={`hero-cell-${i}`}
							className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${day?.workout && day?.cheat
								? "bg-linear-to-br from-vibrant-green to-vibrant-orange text-white shadow-lg shadow-vibrant-green/25"
								: day?.workout
									? "bg-vibrant-green text-black shadow-lg shadow-vibrant-green/25"
									: day?.cheat
										? "bg-vibrant-orange text-black shadow-lg shadow-vibrant-orange/25"
										: "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800"
								}`}
						>
							{i + 1}
						</div>
					))}
				</div>

				{/* Weekly Progress */}
				<div className="mt-6 pt-6 border-t border-neutral-800 space-y-4">
					<div>
						<div className="flex justify-between text-sm mb-2">
							<span className="text-neutral-300">Weekly Workouts</span>
							<span className="font-semibold text-vibrant-green">3 / 4</span>
						</div>
						<div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
							<div className="h-full w-3/4 bg-vibrant-green rounded-full" />
						</div>
					</div>
					<div>
						<div className="flex justify-between text-sm mb-2">
							<span className="text-neutral-300">Cheat Meal Budget</span>
							<span className="font-semibold text-vibrant-orange">1 / 3</span>
						</div>
						<div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
							<div className="h-full w-1/3 bg-vibrant-orange rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
