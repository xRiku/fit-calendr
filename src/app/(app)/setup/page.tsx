import HeaderLogo from "@/components/header-logo";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import SetupForm from "./setup-form";

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

			<div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
				<div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
					<h1 className="text-2xl font-medium pb-4">Update your account</h1>
					<p className="text-sm text-[#878787] mb-8">Add your name</p>

					<SetupForm userId={session?.user.id} name={session?.user.name} />
				</div>
			</div>
		</div>
	);
}
