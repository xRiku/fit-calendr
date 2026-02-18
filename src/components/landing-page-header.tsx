import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import Header from "./header";
import { Button } from "./ui/button";

export default async function LandingPageHeader() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<Header>
			<Button
				asChild
				className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-semibold tracking-tight px-6 h-9 rounded-full transition-all hover:scale-105 active:scale-95"
				size="sm"
			>
				<Link href={`${session?.user.id ? "/app/dashboard" : "/auth/sign-in"}`}>
					{session?.user.id ? "Dashboard" : "Sign In"}
				</Link>
			</Button>
		</Header>
	);
}
