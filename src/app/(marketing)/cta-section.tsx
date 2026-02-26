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
					<div className="absolute -inset-px bg-linear-to-r from-primary/30 via-vibrant-green/10 to-vibrant-orange/20 rounded-none blur-xl" />

					<div className="relative bg-[#05050A]/90 backdrop-blur-xl rounded-none border border-primary/30 p-12 md:p-16 text-center shadow-[inset_0_0_50px_rgba(0,240,255,0.05)]">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-widest">
							Ready to Begin Your
							<br />
							<span className="text-vibrant-green drop-shadow-[0_0_10px_rgba(var(--vibrant-green),0.8)]">Mission?</span>
						</h2>

						<p className="text-xl text-primary/70 font-mono mb-8 max-w-2xl mx-auto">
							Join thousands of players tracking their stats and leveling up.
							It's free to play, simple to start, and highly addictive.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(var(--primary),0.4)] font-bold text-lg px-10 py-7 rounded-none transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest"
							>
								<Link href="/auth/sign-in" className="flex items-center gap-2">
									Initialize Account
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
