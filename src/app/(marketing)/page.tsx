import type { Metadata } from "next";
import { CTASection } from "./cta-section";
import { FeaturesGrid } from "./features-grid";
import { HeroSection } from "./hero-section";
import { HowItWorks } from "./how-it-works";
import { LandingFooter } from "./landing-footer";
import { StatsBar } from "./stats-bar";
import { Testimonials } from "./testimonials";
import { WhyDifferent } from "./why-different";

export const metadata: Metadata = {
	title: "FitCalendr — Track Fitness, Stay Balanced",
	description:
		"The minimalist fitness tracker for people who train hard and enjoy life. Log workouts, track cheat meals, visualize your progress — all in one beautiful calendar. Free forever.",
	keywords: [
		"fitness tracker",
		"workout log",
		"habit tracker",
		"cheat meal tracker",
		"fitness calendar",
	],
	openGraph: {
		title: "FitCalendr — Track Fitness, Stay Balanced",
		description:
			"The minimalist fitness tracker for people who train hard and enjoy life. Free forever.",
		type: "website",
	},
};

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-black text-white overflow-x-hidden">
			<HeroSection />
			<StatsBar />
			<HowItWorks />
			<FeaturesGrid />
			<WhyDifferent />
			<Testimonials />
			<CTASection />
			<LandingFooter />
		</div>
	);
}
