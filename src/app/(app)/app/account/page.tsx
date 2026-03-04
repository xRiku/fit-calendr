import { CheatMealPresetsSection } from "@/app/(app)/app/account/cheat-meal-presets-section";
import { GoalsSection } from "@/app/(app)/app/account/goals-section";
import { WorkoutPresetsSection } from "@/app/(app)/app/account/workout-presets-section";
import { UsernameSection } from "@/app/(app)/app/account/username-section";
import H2 from "@/components/h2";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { getUserGoals } from "@/lib/server-utils";
import { getInitials } from "@/lib/utils";
import { Dumbbell, Utensils } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./signout-button";
import prisma from "@/lib/db";

export default async function AccountPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const goals = await getUserGoals();
	const userRecord = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { username: true },
	});

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<div className="flex py-2 items-center flex-wrap gap-4">
				<H2>Settings</H2>
			</div>

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
						<div className="flex items-center gap-3">
							<Avatar className="size-12">
								<AvatarFallback className="bg-neutral-800 text-sm">
									{getInitials(session.user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5">
								<span className="font-medium">{session.user.name}</span>
								<span className="text-muted-foreground text-sm">{session.user.email}</span>
							</div>
						</div>
						<UsernameSection currentUsername={userRecord?.username ?? null} />
						<Link href="/app/groups" className="text-sm text-vibrant-green hover:underline pt-1">
							My groups →
						</Link>
					</div>
				</section>

				<Separator />

				{/* Goals Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-semibold">Weekly Goals</h2>
						<p className="text-muted-foreground text-sm">
							Set your weekly targets
						</p>
					</div>
					<GoalsSection
						initialWorkoutGoal={goals.weeklyWorkoutGoal}
						initialCheatMealBudget={goals.weeklyCheatMealBudget}
					/>
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

				{/* Account Actions Section - Mobile */}
				<section className="pt-2 pb-6">
					<SignOutButton className="w-full" />
				</section>
			</div>

			{/* Desktop: Card layout */}
			<div className="hidden md:flex md:flex-col md:gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>Manage your account information</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div className="flex items-center gap-3">
							<Avatar className="size-12">
								<AvatarFallback className="bg-neutral-800 text-sm">
									{getInitials(session.user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5">
								<span className="font-medium">{session.user.name}</span>
								<span className="text-muted-foreground text-sm">{session.user.email}</span>
							</div>
						</div>
						<Separator />
						<UsernameSection currentUsername={userRecord?.username ?? null} />
						<Link href="/app/groups" className="text-sm text-vibrant-green hover:underline self-start">
							My groups →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Weekly Goals</CardTitle>
						<CardDescription>Set your weekly targets</CardDescription>
					</CardHeader>
					<CardContent>
						<GoalsSection
							initialWorkoutGoal={goals.weeklyWorkoutGoal}
							initialCheatMealBudget={goals.weeklyCheatMealBudget}
						/>
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

				<Card className="border-destructive/20">
					<CardHeader>
						<CardTitle className="text-destructive">Account Management</CardTitle>
						<CardDescription>
							Sign out of your account on this device
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignOutButton />
					</CardContent>
				</Card>

			</div>
		</main>
	);
}
