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
	title: "FitCalendr — Acompanhe seus Treinos, Mantenha o Equilíbrio",
	description:
		"O rastreador de fitness minimalista para quem treina pesado e aproveita a vida. Registre treinos, acompanhe refeições livres, visualize seu progresso — tudo em um calendário bonito. Grátis para sempre.",
	keywords: [
		"rastreador de fitness",
		"registro de treinos",
		"rastreador de hábitos",
		"rastreador de refeições livres",
		"calendário fitness",
	],
	openGraph: {
		title: "FitCalendr — Acompanhe seus Treinos, Mantenha o Equilíbrio",
		description:
			"O rastreador de fitness minimalista para quem treina pesado e aproveita a vida. Grátis para sempre.",
		type: "website",
	},
};

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-black text-white overflow-x-hidden pt-14">
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
