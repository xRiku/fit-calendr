import H1 from "@/components/h1";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./signout-button";

export default async function AccountPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<main className="flex w-full flex-col items-center justify-center gap-8">
			<H1>Your account</H1>
			<h2>{session?.user?.email}</h2>
			<SignOutButton />
		</main>
	);
}
