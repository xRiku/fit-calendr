import { CheatMealPresetsSection } from "@/app/(app)/app/account/cheat-meal-presets-section";
import { GoalsSection } from "@/app/(app)/app/account/goals-section";
import { WorkoutPresetsSection } from "@/app/(app)/app/account/workout-presets-section";
import { UsernameSection } from "@/app/(app)/app/account/username-section";
import { DeleteAccountSection } from "@/app/(app)/app/account/delete-account-section";
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
import { AvatarUpload } from "@/app/(app)/app/account/avatar-upload";
import { auth } from "@/lib/auth";
import { getUserGoals } from "@/lib/server-utils";
import { getInitials } from "@/lib/utils";
import { Dumbbell, Utensils, AlertTriangle, LogOut } from "lucide-react";
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
		select: { username: true, avatarUrl: true },
	});

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<div className="flex py-2 items-center flex-wrap gap-4">
				<H2>Configurações</H2>
			</div>

			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Perfil</CardTitle>
						<CardDescription>
							Gerencie as informações da sua conta
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div className="flex items-center gap-3">
							<AvatarUpload
								avatarUrl={userRecord?.avatarUrl ?? null}
								name={session.user.name}
								initials={getInitials(session.user.name)}
							/>
							<div className="flex flex-col gap-0.5">
								<span className="font-medium">{session.user.name}</span>
								<span className="text-muted-foreground text-sm">
									{session.user.email}
								</span>
							</div>
						</div>
						<Separator />
						<UsernameSection currentUsername={userRecord?.username ?? null} />
						<Link
							href="/app/groups"
							className="text-sm text-vibrant-green hover:underline self-start"
						>
							Meus grupos →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Metas Semanais</CardTitle>
						<CardDescription>Defina suas metas semanais</CardDescription>
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
						<CardTitle>Atalhos</CardTitle>
						<CardDescription>
							Acesso rápido aos seus itens mais usados
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
									Treinos
								</TabsTrigger>
								<TabsTrigger
									value="cheat-meals"
									className="flex items-center gap-2"
								>
									<Utensils className="h-4 w-4" />
									Refeições Livres
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
						<CardTitle>Sessão</CardTitle>
						<CardDescription>Gerencie sua sessão atual</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col sm:flex-row sm:items-center gap-4">
							<div className="flex items-start gap-3 flex-1">
								<LogOut className="size-5 text-muted-foreground mt-0.5 shrink-0" />
								<div>
									<p className="text-sm font-medium">Sair</p>
									<p className="text-sm text-muted-foreground mt-0.5">
										Encerra sua sessão neste dispositivo.
									</p>
								</div>
							</div>
							<SignOutButton className="shrink-0 sm:self-center" />
						</div>
					</CardContent>
				</Card>

				<Card className="border-destructive/20">
					<CardHeader>
						<CardTitle className="text-destructive flex items-center gap-2">
							<AlertTriangle className="h-5 w-5" />
							Zona de Perigo
						</CardTitle>
						<CardDescription>
							Ações destrutivas e irreversíveis relacionadas à sua conta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DeleteAccountSection />
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
