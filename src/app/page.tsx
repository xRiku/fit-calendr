import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Moon, Plus, Sun, Sunrise, Sunset } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto ">
      <section className="flex items-center justify-between w-full h-[13rem]">
        <Card className="flex border-2 border-green-600 rounded-xl h-full">
          <CardContent className="flex flex-col items-start justify-center gap-2 py-8 px-8">
            <span className="text-5xl font-medium">Week xx of 20xx</span>
            <p className="text-4xl font-medium flex items-center gap-2 font-mono">
              <span className="text-6xl text-green-600 ">0</span> Cheat meals
              this week
            </p>
          </CardContent>
        </Card>
        <Card className="flex border-2 border-green-600 rounded-xl h-full">
          <CardContent className="flex flex-col items-start justify-center gap-2 py-8 px-8">
            <span className="text-5xl font-medium">xx/yy/zzzz</span>
            <p className="text-4xl font-medium flex items-center gap-2 font-mono">
              <span className="text-6xl text-green-600 ">0</span> Cheat meals
              today
            </p>
          </CardContent>
        </Card>
        <Card className="flex border-2 border-green-600 rounded-xl h-full">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8 px-8">
            <p className="text-4xl font-medium flex items-center gap-2 font-mono ">
              <span className="text-8xl text-green-600 ">0</span>
            </p>
            <span className="text-3xl font-medium">
              Days since last cheat meal
            </span>
          </CardContent>
        </Card>
      </section>
      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Plus className="h-24 w-24 text-green-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-2xl">
                Create cheat meal
              </DialogTitle>
              <DialogDescription>
                Add the details of your cheat meal here. They are optional, but
                can be useful for analytics.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col items-start gap-2">
                <Label
                  htmlFor="mealName"
                  className="text-right font-semibold text-sm"
                >
                  Meal name
                </Label>
                <Input
                  id="mealName"
                  placeholder="Type the name of your meal"
                  className="col-span-3"
                />
              </div>
              <span className="font-semibold text-sm">
                What time did you have the meal?
              </span>
              <ToggleGroup
                type="single"
                variant="outline"
                // value={selectedOptions}
                // onValueChange={setSelectedOptions}
                className="justify-center gap-4"
              >
                <ToggleGroupItem asChild value="dawn" aria-label="Toggle dawn">
                  <Sunrise className="h-12 w-12" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  asChild
                  value="morning"
                  aria-label="Toggle morning"
                >
                  <Sun className="h-12 w-12" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  asChild
                  value="after-noon"
                  aria-label="Toggle after-noon"
                >
                  <Sunset className="h-12 w-12" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  asChild
                  value="night"
                  aria-label="Toggle night"
                >
                  <Moon className="h-12 w-12" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <DialogFooter className="flex sm:justify-center gap-4">
              <Button variant="outline" className="w-1/4">
                Cancel
              </Button>
              <Button type="submit" className="w-1/4">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
