"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Activity, CalendarDays } from "lucide-react";

export function GroupTabs({ children }: { children: React.ReactNode }) {
	return (
		<Tabs defaultValue="ranking">
			<TabsList className="w-full">
				<TabsTrigger value="ranking" className="flex-1 gap-1.5">
					<BarChart3 className="size-3.5" />
					Ranking
				</TabsTrigger>
				<TabsTrigger value="feed" className="flex-1 gap-1.5">
					<Activity className="size-3.5" />
					Atividade
				</TabsTrigger>
				<TabsTrigger value="calendar" className="flex-1 gap-1.5">
					<CalendarDays className="size-3.5" />
					Calendário
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	);
}

export { TabsContent };
