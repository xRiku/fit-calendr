import { CheatMealPresetsSection } from "@/app/(app)/app/account/cheat-meal-presets-section";
import { WorkoutPresetsSection } from "@/app/(app)/app/account/workout-presets-section";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Dumbbell, Utensils } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./signout-button";

export default async function AccountPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<H1>Settings</H1>

			{/* Mobile: Flat layout with separators | Desktop: Cards */}
			<div className="md:hidden space-y-6">
				{/* Profile Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-semibold">Profile</h2>
						<p className="text-muted-foreground text-sm">
							Manage your account information
						</p>
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<span className="text-muted-foreground text-sm">Email</span>
							<span className="font-medium">{session.user.email}</span>
						</div>
						<SignOutButton className="w-full" />
					</div>
				</section>

				<Separator />

				{/* Presets Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-semibold">Presets</h2>
						<p className="text-muted-foreground text-sm">
							Quick access to your frequently used items
						</p>
					</div>
					<Tabs defaultValue="workouts" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="workouts" className="flex items-center gap-2">
								<Dumbbell className="h-4 w-4" />
								Workouts
							</TabsTrigger>
							<TabsTrigger
								value="cheat-meals"
								className="flex items-center gap-2"
							>
								<Utensils className="h-4 w-4" />
								Cheat Meals
							</TabsTrigger>
						</TabsList>
						<TabsContent value="workouts" className="mt-4">
							<WorkoutPresetsSection />
						</TabsContent>
						<TabsContent value="cheat-meals" className="mt-4">
							<CheatMealPresetsSection />
						</TabsContent>
					</Tabs>
				</section>

				<Separator />

				{/* Data & Privacy Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-semibold">Data & Privacy</h2>
						<p className="text-muted-foreground text-sm">
							Manage your data and privacy settings
						</p>
					</div>
					<Button variant="outline" disabled>
						Export Data
					</Button>
				</section>
			</div>

			{/* Desktop: Card layout */}
			<div className="hidden md:flex md:flex-col md:gap-6">
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
						<CardTitle>Presets</CardTitle>
						<CardDescription>
							Quick access to your frequently used items
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="workouts" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger
									value="workouts"
									className="flex items-center gap-2"
								>
									<Dumbbell className="h-4 w-4" />
									Workouts
								</TabsTrigger>
								<TabsTrigger
									value="cheat-meals"
									className="flex items-center gap-2"
								>
									<Utensils className="h-4 w-4" />
									Cheat Meals
								</TabsTrigger>
							</TabsList>
							<TabsContent value="workouts" className="mt-4">
								<WorkoutPresetsSection />
							</TabsContent>
							<TabsContent value="cheat-meals" className="mt-4">
								<CheatMealPresetsSection />
							</TabsContent>
						</Tabs>
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
			</div>
		</main>
	);
}
