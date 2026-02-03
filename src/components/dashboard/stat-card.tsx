import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { CardSkeleton } from "./card-skeleton";

export type StatCardProps<T> = {
	title: string;
	fetchData: () => Promise<T>;
	renderValue: (data: T) => React.ReactNode;
};

export default function StatCard<T>({
	title,
	fetchData,
	renderValue,
}: StatCardProps<T>) {
	async function CardData() {
		const data = await fetchData();
		return <>{renderValue(data)}</>;
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1">
				<Suspense fallback={<CardSkeleton />}>
					<CardData />
				</Suspense>
			</CardContent>
		</Card>
	);
}
