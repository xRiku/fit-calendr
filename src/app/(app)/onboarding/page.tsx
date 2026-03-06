import HeaderLogo from "@/components/header-logo";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import OnboardingForm from "./onboarding-form";

export const metadata: Metadata = {
	title: "Setup account | FitCalendr",
};

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div>
			<div className="absolute left-5 top-4 md:left-10 md:top-10">
				<Link href="/">
					<HeaderLogo />
				</Link>
			</div>

			<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0 bg-zinc-950">
				<div className="relative z-20 m-auto flex w-full max-w-[420px] flex-col">
					<OnboardingForm userId={session?.user.id} name={session?.user.name} />
				</div>
			</div>
		</div>
	);
}
