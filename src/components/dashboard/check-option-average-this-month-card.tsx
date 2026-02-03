import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	getCheatMealsByYearGroupedByMonth,
	getGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import { CardSkeleton } from "./card-skeleton";

const options: {
	[key: string]: {
		title: string;
		fetchCall:
			| typeof getGymChecksByYearGroupedByMonth
			| typeof getCheatMealsByYearGroupedByMonth;
	};
} = {
	workout: {
		title: "Workouts AVG. (month)",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Cheat meals AVG. (month)",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

export default function CheckOptionAveragePerMonthCard({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: keyof typeof options;
	year?: number;
}) {
	async function CardData() {
		const checkOptionsGroupedByMonth = await options[selected].fetchCall({
			year,
		});

		// const getDiffFromLastMonth = async () => {
		//   const thisMonth =
		//     checkOptionsGroupedByMonth.hashTable[new Date().getMonth()]?.length || 0;
		//   if (thisMonth === 0) {
		//     return 0;
		//   }
		//   let prevMonth =
		//     checkOptionsGroupedByMonth.hashTable[new Date().getMonth() - 1]?.length ||
		//     0;

		//   if (prevMonth === 0) {
		//     if (new Date().getMonth() === 0) {
		//       const prevYearCheckOptionsGroupedByMonth =
		//         await fetchGymChecksByYearGroupedByMonth({
		//           year: new Date().getFullYear() - 1,
		//         });
		//       prevMonth =
		//         prevYearCheckOptionsGroupedByMonth.hashTable[11]?.length || 0;
		//       if (prevMonth === 0) {
		//         return 0;
		//       }
		//       return (thisMonth / prevMonth - 1) * 100;
		//     }

		//     return 0;
		//   }

		//   return (thisMonth / prevMonth - 1) * 100;
		// };

		// const diffFromLastMonth = await getDiffFromLastMonth();

		const hashTableKeys = Object.keys(checkOptionsGroupedByMonth.hashTable);
		const lastestMonth =
			hashTableKeys.length > 0 ? Math.max(...hashTableKeys.map(Number)) + 1 : 1;

		return (
			<>
				{checkOptionsGroupedByMonth && (
					<>
						<span className="text-2xl font-bold">
							{((checkOptionsGroupedByMonth.count || 0) / lastestMonth).toFixed(
								2,
							)}
						</span>
						{/* {diffFromLastMonth !== 0 && (
              <p className="text-xs text-muted-foreground">
                {diffFromLastMonth > 0 ? "Up by " : "Down by "}
                <span
                  className={
                    diffFromLastMonth > 0 ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {diffFromLastMonth > 0
                    ? `+${diffFromLastMonth.toFixed(1)}`
                    : diffFromLastMonth.toFixed(1)}
                  %
                </span>{" "}
                this month
              </p>
            )} */}
					</>
				)}
			</>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold">
					{options[selected]?.title}
					{/* <CardDescription>{options[selected]?.description}</CardDescription> */}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1">
				<Suspense fallback={<CardSkeleton />}>
					<CardData />
				</Suspense>
			</CardContent>
		</Card>
	);
}
