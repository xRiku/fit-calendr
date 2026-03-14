"use client";

import { getTodayEntries } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/day-info-modal";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function QuickAddTodayButton() {
	const { setSelectedDayInfo, toggleDayInfoModalState } = useModalStore();
	const [loading, setLoading] = useState(false);

	const handleQuickAdd = async () => {
		setLoading(true);
		try {
			const { gymChecks, cheatMeals } = await getTodayEntries();
			const hasExistingData = gymChecks.length > 0 || cheatMeals.length > 0;

			setSelectedDayInfo({
				date: new Date(),
				gymChecks: gymChecks.map((gymCheck) => ({
					id: gymCheck.id,
					description: gymCheck.description,
					userId: gymCheck.userId,
					updatedAt: gymCheck.updatedAt,
					createdAt: gymCheck.createdAt,
					presetId: gymCheck.presetId,
					presetColor: gymCheck.preset?.color,
				})),
				cheatMeals: cheatMeals.map((meal) => ({
					id: meal.id,
					name: meal.name,
					userId: meal.userId,
					updatedAt: meal.updatedAt,
					createdAt: meal.createdAt,
					presetId: meal.presetId,
					presetColor: meal.preset?.color,
				})),
			});

			toggleDayInfoModalState(hasExistingData ? "edit" : "create");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={handleQuickAdd} disabled={loading} size="sm" className="gap-1.5">
			<Plus className="size-4" />
			<span className="hidden sm:inline">Registrar Hoje</span>
		</Button>
	);
}
