import { CheatMealPresetsSection } from "@/app/(app)/app/account/cheat-meal-presets-section";
import { GoalsSection } from "@/app/(app)/app/account/goals-section";
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
import { getUserGoals } from "@/lib/server-utils";
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

	const goals = await getUserGoals();

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<H1>System Preferences</H1>

			{/* Mobile: Flat layout with separators | Desktop: Cards */}
			<div className="md:hidden space-y-6">
				{/* Profile Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-bold uppercase tracking-wider text-primary">Player Profile</h2>
						<p className="text-primary/70 font-mono text-sm tracking-tight">
							Manage your player data
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

				{/* Goals Section - Mobile */}
				<section>
					<div className="mb-3">
						<h2 className="text-lg font-bold uppercase tracking-wider text-vibrant-green">Mission Objectives</h2>
						<p className="text-vibrant-green/70 font-mono text-sm tracking-tight">
							Set your weekly XP and HP targets
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
						<h2 className="text-lg font-bold uppercase tracking-wider text-white">Loadouts</h2>
						<p className="text-white/60 font-mono text-sm tracking-tight">
							Configure quick access items
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
						<h2 className="text-lg font-bold uppercase tracking-wider text-white">Save Data</h2>
						<p className="text-white/60 font-mono text-sm tracking-tight">
							Export your complete stat history
						</p>
					</div>
					<Button variant="outline" disabled className="font-mono uppercase tracking-widest text-xs border-primary/20">
						Export Save File
					</Button>
				</section>
			</div>

			{/* Desktop: Card layout */}
			<div className="hidden md:flex md:flex-col md:gap-6">
				<Card className="rounded-none border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
					<CardHeader>
						<CardTitle className="uppercase tracking-widest text-primary text-xl">Player Profile</CardTitle>
						<CardDescription className="font-mono text-primary/60">Manage your player data</CardDescription>
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

				<Card className="rounded-none border-vibrant-green/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(var(--vibrant-green),0.05)]">
					<CardHeader>
						<CardTitle className="uppercase tracking-widest text-vibrant-green text-xl">Mission Objectives</CardTitle>
						<CardDescription className="font-mono text-vibrant-green/60">Set your weekly XP and HP targets</CardDescription>
					</CardHeader>
					<CardContent>
						<GoalsSection
							initialWorkoutGoal={goals.weeklyWorkoutGoal}
							initialCheatMealBudget={goals.weeklyCheatMealBudget}
						/>
					</CardContent>
				</Card>

				<Card className="rounded-none border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
					<CardHeader>
						<CardTitle className="uppercase tracking-widest text-white text-xl">Loadouts</CardTitle>
						<CardDescription className="font-mono text-white/50">
							Configure quick access items
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

				<Card className="rounded-none border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
					<CardHeader>
						<CardTitle className="uppercase tracking-widest text-white text-xl">Save Data</CardTitle>
						<CardDescription className="font-mono text-white/50">
							Export your complete stat history
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" disabled className="font-mono uppercase tracking-widest text-xs border-primary/20">
							Export Save File
						</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
