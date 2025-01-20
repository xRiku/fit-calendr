import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Chart } from "./chart";

export function FrequencyChart() {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Gym Check Frequency Chart</CardTitle>
        <CardDescription>
          Showing gym check frequency for this year
        </CardDescription>
      </CardHeader>
      <Chart />
    </Card>
  );
}
