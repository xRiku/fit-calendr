import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy — FitCalendr",
	description: "How FitCalendr collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-black text-white pt-14">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
				<p className="text-neutral-400 mb-10">Last updated: January 2026</p>

				<div className="space-y-10 text-neutral-300 leading-relaxed">
					<section>
						<h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
						<p>
							FitCalendr collects only the information necessary to provide the service. This includes your email address for authentication, and the fitness and cheat meal data you choose to log. We do not collect any other personal information.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
						<p>
							Your data is used solely to power your personal dashboard and calendar. We do not sell, share, or monetize your data in any way. Your workout and meal logs are private and accessible only to you.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">3. Data Storage</h2>
						<p>
							Your data is stored securely in our database. We use industry-standard security practices to protect your information from unauthorized access.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">4. Cookies</h2>
						<p>
							FitCalendr uses a session cookie solely to keep you logged in. No tracking or advertising cookies are used.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
						<p>
							You can delete your account and all associated data at any time. If you have questions about your data, contact us at the email below.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
						<p>
							For privacy-related questions, please reach out via the app.
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
