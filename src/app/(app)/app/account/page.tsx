import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PresetsSection } from "./presets-section";
import SignOutButton from "./signout-button";

export default async function AccountPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
			<H1>Settings</H1>

			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Manage your account information</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<span className="text-muted-foreground text-sm">Email</span>
							<span className="font-medium">{session.user.email}</span>
						</div>
						<SignOutButton />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Workout Presets</CardTitle>
					<CardDescription>
						Quick access to your frequently used workouts
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PresetsSection />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Data & Privacy</CardTitle>
					<CardDescription>
						Manage your data and privacy settings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline" disabled>
						Export Data
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
