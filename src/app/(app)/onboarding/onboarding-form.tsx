"use client";

import { completeUserOnboarding } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type SetupFormProps = {
	userId?: string;
	name?: string;
};

export default function OnboardingForm({ name: initialName, userId }: SetupFormProps) {
	const router = useRouter();

	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form State
	const [name, setName] = useState(initialName ?? "");
	const [workoutGoal, setWorkoutGoal] = useState<number>(4);
	const [cheatMealGoal, setCheatMealGoal] = useState<number>(2);

	const slideVariants = {
		enter: (dir: number) => ({
			x: dir > 0 ? 50 : -50,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (dir: number) => ({
			zIndex: 0,
			x: dir < 0 ? 50 : -50,
			opacity: 0,
		}),
	};

	const handleNext = () => {
		if (step === 1 && name.trim().length < 2) return;
		setDirection(1);
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setDirection(-1);
		setStep((prev) => prev - 1);
	};

	const handleSubmit = async () => {
		if (!userId || !name) return;

		setIsSubmitting(true);

		try {
			await completeUserOnboarding({
				name,
				weeklyWorkoutGoal: workoutGoal,
				weeklyCheatMealBudget: cheatMealGoal,
			});
			router.replace("/app/dashboard");
		} catch (error) {
			console.error("Failed to complete setup:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			{/* Progress indicator */}
			<div className="flex gap-2 w-full mb-10">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ease-in-out ${i <= step ? 'bg-vibrant-green' : 'bg-zinc-800'}`}
					/>
				))}
			</div>

			<div className="relative min-h-[320px]">
				<AnimatePresence mode="wait" custom={direction}>
					{step === 1 && (
						<motion.div
							key="step1"
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
							className="absolute w-full"
						>
							<h1 className="text-3xl font-semibold mb-2 text-zinc-100 tracking-tight">Qual seu nome?</h1>
							<p className="text-zinc-400 mb-8">Como devemos te chamar no aplicativo?</p>

							<div className="space-y-4">
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Ex: João da Silva"
									className="text-lg py-6 bg-zinc-900 border-zinc-800 focus-visible:ring-vibrant-green rounded-xl px-4"
									autoFocus
									onKeyDown={(e) => {
										if (e.key === 'Enter' && name.trim().length >= 2) handleNext();
									}}
								/>
								<div className="flex justify-end pt-4">
									<Button
										onClick={handleNext}
										disabled={name.trim().length < 2}
										className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-semibold rounded-xl py-6 px-8 text-lg w-full transition-all"
									>
										Continuar <ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</div>
							</div>
						</motion.div>
					)}

					{step === 2 && (
						<motion.div
							key="step2"
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
							className="absolute w-full"
						>
							<h1 className="text-3xl font-semibold mb-2 text-zinc-100 tracking-tight">Sua meta de treinos</h1>
							<p className="text-zinc-400 mb-8">Quantos dias por semana você pretende treinar?</p>

							<div className="grid grid-cols-4 gap-3 mb-8">
								{[1, 2, 3, 4, 5, 6, 7].map((num) => (
									<button
										key={num}
										onClick={() => setWorkoutGoal(num)}
										className={`aspect-square rounded-2xl text-2xl font-medium transition-all duration-200 ${workoutGoal === num
											? "bg-vibrant-green text-black scale-105 shadow-lg shadow-vibrant-green/20 border-transparent"
											: "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
											}`}
									>
										{num}
									</button>
								))}
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									onClick={handleBack}
									variant="outline"
									className="rounded-xl py-6 px-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
								<Button
									onClick={handleNext}
									className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-semibold rounded-xl py-6 px-8 text-lg flex-1 transition-all"
								>
									Continuar <ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</div>
						</motion.div>
					)}

					{step === 3 && (
						<motion.div
							key="step3"
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
							className="absolute w-full"
						>
							<h1 className="text-3xl font-semibold mb-2 text-zinc-100 tracking-tight">Refeições livres</h1>
							<p className="text-zinc-400 mb-8">Qual o seu limite semanal para refeições livres?</p>

							<div className="grid grid-cols-4 gap-3 mb-8">
								{[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
									<button
										key={num}
										onClick={() => setCheatMealGoal(num)}
										className={`aspect-square rounded-2xl text-2xl font-medium transition-all duration-200 ${cheatMealGoal === num
											? "bg-vibrant-orange text-black scale-105 shadow-lg shadow-vibrant-orange/20 border-transparent"
											: "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
											}`}
									>
										{num}
									</button>
								))}
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									onClick={handleBack}
									variant="outline"
									className="rounded-xl py-6 px-4 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all"
									disabled={isSubmitting}
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
								<Button
									onClick={handleSubmit}
									disabled={isSubmitting}
									className="bg-vibrant-green hover:bg-vibrant-green/90 text-black font-semibold rounded-xl py-6 px-8 text-lg flex-1 transition-all"
								>
									{isSubmitting ? (
										<Loader2 className="h-5 w-5 animate-spin mx-auto" />
									) : (
										"Finalizar"
									)}
								</Button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
