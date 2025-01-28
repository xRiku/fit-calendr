import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart } from "@/app/(app)/app/dashboard/(cheat-meals)/(weekday-chart)/chart";

export function WeekdayChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Cheat Meal Weekday Frequency Chart</CardTitle>
        <CardDescription>
          Showing cheat meal frequency per weekday for this year
        </CardDescription>
      </CardHeader>
      <Chart />
    </Card>
  );
}
