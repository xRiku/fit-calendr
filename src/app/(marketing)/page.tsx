import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Pizza, BarChart4 } from "lucide-react";
import MotionDiv from "./motion-div";
import Link from "next/link";

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
								Fitness
							</span>
							.<br /> Own Your{" "}
							<span className="decoration-dashed underline underline-offset-4 decoration-vibrant-green">
								Progress
							</span>
							.
						</h1>
						<p className="text-xl mb-8 max-w-md text-neutral-300">
							FitCalendr helps you stay on top of your workouts and cheat meals
							with clear tracking and powerful analytics.
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
								Start Your Journey
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
										<Dumbbell className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Workout Tracking</h2>
								</div>
								<p className="text-neutral-300">
									Easily log and monitor your training sessions with a seamless,
									intuitive interface.
								</p>
							</CardContent>
						</Card>
						<Card className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 text-white shadow-lg hover:border-[#2adb7a]/30 transition-all duration-300 hover:shadow-[#2adb7a]/10 hover:shadow-xl group">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-[#2adb7a]/20 transition-colors duration-300">
										<Pizza className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Cheat Meal Tracking</h2>
								</div>
								<p className="text-neutral-300">
									Stay mindful of your diet with simple and effective cheat meal
									logging and analysis.
								</p>
							</CardContent>
						</Card>
						<Card className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 text-white shadow-lg hover:border-[#2adb7a]/30 transition-all duration-300 hover:shadow-[#2adb7a]/10 hover:shadow-xl group">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-[#2adb7a]/20 transition-colors duration-300">
										<BarChart4 className="w-6 h-6 text-vibrant-green" />
									</div>
									<h2 className="text-xl font-bold">Insightful Analytics</h2>
								</div>
								<p className="text-neutral-300">
									Visualize patterns and optimize your health routine with
									powerful data insights.
								</p>
							</CardContent>
						</Card>
					</MotionDiv>
				</div>
			</section>

			<section className="py-24 p-4 relative border-t border-neutral-800">
				<div className="absolute inset-0 bg-linear-to-b from-black to-neutral-900"></div>
				<MotionDiv
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-5xl mx-auto text-center relative z-10"
				>
					<h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-[#2adb7a] to-[#22c96b]">
						Why Choose FitCalendr?
					</h2>
					<p className="text-xl text-white mb-16 max-w-2xl mx-auto">
						We combine simplicity, performance tracking, and data insights to
						help you build fitness habits that truly stick.
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
								Easy Logging
							</h3>
							<p className="text-neutral-300">
								Quickly add workouts and meals in a few taps. Less typing, more
								doing. Our streamlined interface keeps you focused on your
								goals.
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
								Visual Insights
							</h3>
							<p className="text-neutral-300">
								Charts and trends that make sense at a glance, keeping you
								engaged and motivated through clear visual feedback.
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
								Stay Accountable
							</h3>
							<p className="text-neutral-300">
								Track consistency and patterns to help you hit your goals and
								maintain the motivation to keep pushing forward.
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
						Ready to transform your fitness journey?
					</h2>
					<p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
						Start tracking your workouts and cheat meals today with FitCalendr.
						Join thousands of users who have improved their fitness habits.
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
							Get Started Now
						</Link>
					</Button>
				</MotionDiv>
			</section>

			<footer className="border-t border-neutral-800 py-8 text-center text-neutral-400">
				<div className="max-w-6xl mx-auto px-4">
					<p>© {new Date().getFullYear()} FitCalendr. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
