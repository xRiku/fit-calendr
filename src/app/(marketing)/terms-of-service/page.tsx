import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Terms of Service — FitCalendr",
	description: "Terms and conditions for using FitCalendr.",
};

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen bg-black text-white pt-14">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
				<p className="text-neutral-400 mb-10">Last updated: January 2026</p>

				<div className="space-y-10 text-neutral-300 leading-relaxed">
					<section>
						<h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
						<p>
							By using FitCalendr, you agree to these Terms of Service. If you do not agree, please do not use the app.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">2. Use of the Service</h2>
						<p>
							FitCalendr is a personal fitness tracking tool. You agree to use it only for lawful purposes and not to misuse or attempt to disrupt the service.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">3. Your Account</h2>
						<p>
							You are responsible for maintaining the security of your account. You are responsible for all activity that occurs under your account.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">4. Your Data</h2>
						<p>
							You own all data you enter into FitCalendr. We do not claim any ownership over your fitness or meal logs.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">5. Service Availability</h2>
						<p>
							FitCalendr is provided free of charge. We reserve the right to modify or discontinue the service at any time, with reasonable notice where possible.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
						<p>
							FitCalendr is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
						<p>
							For questions about these terms, please reach out via the app.
						</p>
					</section>
				</div>

				<div className="mt-16 pt-8 border-t border-neutral-800">
					<Link href="/" className="text-vibrant-green hover:underline text-sm">
						← Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}
