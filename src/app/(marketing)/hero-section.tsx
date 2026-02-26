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
				<div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-vibrant-green/15 rounded-full blur-[150px] animate-pulse" />
				<div
					className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[130px] animate-pulse"
					style={{ animationDelay: "1s" }}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
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
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
							Level Up
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-vibrant-green to-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
								Your Body.
							</span>
						</h1>

						{/* Subheadline */}
						<p className="text-xl text-neutral-300 max-w-lg leading-relaxed">
							The ultimate gamified habit tracker for the dedicated. Log workouts, track your cheat meals, and build your consistency streak. Your stats, visualized.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(var(--primary),0.4)] font-bold text-lg px-8 py-6 rounded-none border-2 border-primary transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest"
							>
								<Link href="/auth/sign-in" className="flex items-center gap-2">
									Start Game
									<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="border-primary/50 hover:border-primary text-primary hover:bg-primary/10 font-bold text-lg px-8 py-6 rounded-none bg-black/50 backdrop-blur-sm uppercase tracking-widest transition-colors shadow-[inset_0_0_10px_rgba(var(--primary),0.1)]"
							>
								<Link href="#how-it-works">View Tutorial</Link>
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
		<div className="relative font-mono">
			{/* Glow effect */}
			<div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl" />

			{/* Calendar Preview HUD */}
			<div className="relative bg-[#05050A]/90 backdrop-blur-xl rounded-none border border-primary/30 p-6 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-bold text-primary uppercase tracking-wider">Player Stats</h3>
						<p className="text-sm text-primary/60">Current Mission: February 2026</p>
					</div>
					<div className="flex gap-4">
						<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
							<div className="w-3 h-3 bg-vibrant-green shadow-[0_0_8px_rgba(var(--vibrant-green),0.8)]" />
							<span className="text-vibrant-green">Workout</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
							<div className="w-3 h-3 bg-vibrant-orange shadow-[0_0_8px_rgba(var(--vibrant-orange),0.8)]" />
							<span className="text-vibrant-orange">Cheat</span>
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
							className={`aspect-square flex items-center justify-center text-sm font-bold transition-all ${day?.workout && day?.cheat
								? "bg-linear-to-br from-vibrant-green to-vibrant-orange text-white shadow-[0_0_15px_rgba(var(--vibrant-green),0.5)] border border-white/20"
								: day?.workout
									? "bg-vibrant-green/20 text-vibrant-green border border-vibrant-green/50 shadow-[0_0_10px_rgba(var(--vibrant-green),0.3)]"
									: day?.cheat
										? "bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 shadow-[0_0_10px_rgba(var(--vibrant-orange),0.3)]"
										: "bg-black/40 text-neutral-600 border border-neutral-800 hover:border-primary/50"
								}`}
						>
							{i + 1}
						</div>
					))}
				</div>

				{/* Weekly Progress HUD component */}
				<div className="mt-6 pt-6 border-t border-primary/20 space-y-5">
					<div>
						<div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
							<span className="text-primary">XP: Weekly Workouts</span>
							<span className="text-vibrant-green drop-shadow-[0_0_5px_rgba(var(--vibrant-green),0.8)] max-w-none">LVL 3 / 4</span>
						</div>
						<div className="h-1 bg-black rounded-none border border-primary/30 overflow-hidden">
							<div className="h-full w-3/4 bg-vibrant-green shadow-[0_0_10px_rgba(var(--vibrant-green),1)]" />
						</div>
					</div>
					<div>
						<div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
							<span className="text-primary">HP: Cheat Meal Budget</span>
							<span className="text-vibrant-orange drop-shadow-[0_0_5px_rgba(var(--vibrant-orange),0.8)]">1 / 3</span>
						</div>
						<div className="h-1 bg-black rounded-none border border-primary/30 overflow-hidden">
							<div className="h-full w-1/3 bg-vibrant-orange shadow-[0_0_10px_rgba(var(--vibrant-orange),1)]" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
