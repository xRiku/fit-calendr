import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Dumbbell, Pizza, Target } from "lucide-react";
import Link from "next/link";
import MotionDiv from "./motion-div";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<section className="bg-black text-white py-8 p-4">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
					<MotionDiv
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="sm:text-6xl mb-6 font-extrabold tracking-tight underline-offset-8 text-3xl leading-9 sm:leading-16">
							Track Your{" "}
							<span className="decoration-dashed underline underline-offset-4 decoration-vibrant-green">
								Workouts
							</span>
							.<br /> Log Your{" "}
							<span className="decoration-dashed underline underline-offset-4 decoration-vibrant-green">
								Cheat Meals
							</span>
							.
						</h1>
						<p className="text-xl mb-8 max-w-md text-neutral-300">
							A simple calendar for your fitness habits. No complex setup. Just
							log and see your progress at a glance.
						</p>
						<Button
							asChild
							variant="ghost"
							className="font-semibold hover:opacity-90 px-8 py-6 text-lg"
						>
							<Link
								href="/auth/sign-in"
								className="text-black bg-vibrant-green hover:bg-vibrant-green! hover:text-black!"
							>
								Start Tracking Free
							</Link>
						</Button>
					</MotionDiv>

					<MotionDiv
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="flex flex-col gap-4 md:mt-0 mt-8"
					>
						<Card className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 text-white shadow-lg hover:border-[#2adb7a]/30 transition-all duration-300 hover:shadow-[#2adb7a]/10 hover:shadow-xl group">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-[#2adb7a]/20 transition-colors duration-300">
										<CalendarDays className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Calendar Logging</h2>
								</div>
								<p className="text-neutral-300">
									Click any day to log a workout or cheat meal. Add quick
									presets for things you do often.
								</p>
							</CardContent>
						</Card>
						<Card className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 text-white shadow-lg hover:border-[#2adb7a]/30 transition-all duration-300 hover:shadow-[#2adb7a]/10 hover:shadow-xl group">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-[#2adb7a]/20 transition-colors duration-300">
										<Target className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Weekly Goals</h2>
								</div>
								<p className="text-neutral-300">
									Set a target for workouts and a budget for cheat meals. Track
									your week at a glance.
								</p>
							</CardContent>
						</Card>
						<Card className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 text-white shadow-lg hover:border-[#2adb7a]/30 transition-all duration-300 hover:shadow-[#2adb7a]/10 hover:shadow-xl group">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-[#2adb7a]/20 transition-colors duration-300">
										<Dumbbell className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Visual Progress</h2>
								</div>
								<p className="text-neutral-300">
									Yearly heatmap shows your consistency. Dashboard charts reveal
									your patterns.
								</p>
							</CardContent>
						</Card>
					</MotionDiv>
				</div>
			</section>

			<section className="py-24 p-4 relative border-t border-neutral-800">
				<div className="absolute inset-0 bg-linear-to-b from-black to-neutral-900" />
				<MotionDiv
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-5xl mx-auto text-center relative z-10"
				>
					<h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-[#2adb7a] to-[#22c96b]">
						Why FitCalendr?
					</h2>
					<p className="text-xl text-white mb-16 max-w-2xl mx-auto">
						No bloat. No learning curve. Just a simple way to track your habits
						and see your progress.
					</p>

					<div className="grid md:grid-cols-3 gap-10 text-left">
						<MotionDiv
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-[#2adb7a]/30 transition-all duration-300"
						>
							<h3 className="text-2xl flex items-center gap-2 font-semibold text-white mb-3">
								<span className="text-vibrant-green text-2xl">✓</span>
								Simple
							</h3>
							<p className="text-neutral-300">
								No learning curve. Start logging in seconds. Just workouts and
								cheat meals—nothing else to distract you.
							</p>
						</MotionDiv>

						<MotionDiv
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-[#2adb7a]/30 transition-all duration-300"
						>
							<h3 className="text-2xl font-semibold flex items-center gap-2 text-white mb-3">
								<span className="text-vibrant-green text-2xl">✓</span>
								Visual
							</h3>
							<p className="text-neutral-300">
								See your entire year of habits in one view. Spot patterns and
								stay motivated with clear visual feedback.
							</p>
						</MotionDiv>

						<MotionDiv
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-[#2adb7a]/30 transition-all duration-300"
						>
							<h3 className="text-2xl font-semibold flex items-center gap-2 text-white mb-3">
								<span className="text-vibrant-green text-2xl">✓</span>
								Focused
							</h3>
							<p className="text-neutral-300">
								Just the essentials: track workouts, log cheat meals, set weekly
								goals. No unnecessary features getting in your way.
							</p>
						</MotionDiv>
					</div>
				</MotionDiv>
			</section>

			<section className="py-20 p-4 relative">
				<MotionDiv
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-4xl mx-auto text-center bg-linear-to-r from-neutral-900 to-black p-10 rounded-2xl border border-neutral-800 shadow-xl"
				>
					<h2 className="text-3xl font-bold mb-6 text-white">
						Start tracking today
					</h2>
					<p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
						Free to use. No credit card required. Just sign up and start logging
						your habits.
					</p>
					<Button
						asChild
						variant="ghost"
						className="font-semibold hover:opacity-90 px-8 py-6 text-lg"
					>
						<Link
							href="/auth/sign-in"
							className="text-black bg-vibrant-green hover:bg-vibrant-green! hover:text-black!"
						>
							Get Started Free
						</Link>
					</Button>
				</MotionDiv>
			</section>

			<footer className="border-t border-neutral-800 py-8 text-center text-neutral-400">
				<div className="max-w-6xl mx-auto px-4">
					<p>© {new Date().getFullYear()} FitCalendr.</p>
				</div>
			</footer>
		</div>
	);
}
