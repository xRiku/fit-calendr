"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/day-info-modal";
import { Plus } from "lucide-react";

export default function QuickAddTodayButton() {
	const { setSelectedDayInfo, toggleDayInfoModalState } = useModalStore();

	const handleQuickAdd = () => {
		setSelectedDayInfo({
			date: new Date(),
			gymChecks: [],
			cheatMeals: [],
		});
		toggleDayInfoModalState("create");
	};

	return (
		<Button onClick={handleQuickAdd} size="sm" className="gap-1.5">
			<Plus className="size-4" />
			<span className="hidden sm:inline">Log Today</span>
		</Button>
	);
}
