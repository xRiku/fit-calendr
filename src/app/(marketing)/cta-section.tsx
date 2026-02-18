import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import MotionDiv from "./motion-div";

export function CTASection() {
	return (
		<section className="py-24 lg:py-32">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<MotionDiv
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="relative"
				>
					{/* Background Glow */}
					<div className="absolute -inset-px bg-linear-to-r from-vibrant-green/30 via-vibrant-green/10 to-vibrant-orange/20 rounded-3xl blur-xl" />

					<div className="relative bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800 p-12 md:p-16 text-center">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Ready to Start Your
							<br />
							<span className="text-vibrant-green">Fitness Journey?</span>
						</h2>

						<p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
							Join thousands of people tracking their workouts and staying
							balanced. It's free, it's simple, and it works.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
							<Button
								asChild
								size="lg"
								className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-bold text-lg px-10 py-7 rounded-full transition-all hover:scale-105 active:scale-95 group"
							>
								<Link href="/auth/sign-in" className="flex items-center gap-2">
									Create Free Account
									<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
							<div className="flex items-center gap-2">
								<Check className="w-4 h-4 text-vibrant-green" />
								<span>Free forever</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="w-4 h-4 text-vibrant-green" />
								<span>No credit card</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="w-4 h-4 text-vibrant-green" />
								<span>Cancel anytime</span>
							</div>
						</div>
					</div>
				</MotionDiv>
			</div>
		</section>
	);
}
