import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart } from "./chart";

const options: {
  [key: string]: { description: string };
} = {
  "gym-workout": {
    description: "Showing gym workout frequency per weekday for this year",
  },
  "cheat-meal": {
    description: "Showing cheat meal frequency per weekday for this year",
  },
};

export function WeekdayChart({ selected }: { selected: string }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Weekday Frequency Chart</CardTitle>
        <CardDescription>{options[selected].description}</CardDescription>
      </CardHeader>
      <Chart selected={selected} />
    </Card>
  );
}
