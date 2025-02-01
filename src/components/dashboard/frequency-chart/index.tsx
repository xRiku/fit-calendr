import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Chart } from "./chart";

const options: {
  [key: string]: { title: string; description: string };
} = {
  "gym-workout": {
    title: "Gym Workout Frequency Chart",
    description: "Showing gym workout frequency for this year",
  },
  "cheat-meal": {
    title: "Cheat Meal Frequency Chart",
    description: "Showing cheat meal frequency for this year",
  },
};

export function FrequencyChart({ selected }: { selected: string }) {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>{options[selected].title}</CardTitle>
        <CardDescription>{options[selected].description}</CardDescription>
      </CardHeader>
      <Chart selected={selected} />
    </Card>
  );
}
