"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useRef } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import { addCheatMeal } from "@/app/actions/actions";

const formSchema = z.object({
  mealName: z.string().max(50).optional(),
  mealPeriod: z.enum(["dawn", "morning", "afternoon", "night", ""]).optional(),
  mealDate: z.date().optional(),
});

export default function MealForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealName: "",
      mealPeriod: "",
      mealDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log(typeof values.mealDate);
    // await addCheatMeal(values);
  }

  const popOverRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Form {...form}>
      <form
        id="create-meal-form"
        action={addCheatMeal}
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        <FormField
          control={form.control}
          name="mealName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">Meal name</FormLabel>
              <FormControl>
                <Input placeholder="type the name of your meal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="font-bold">
                The day to add the cheat meal
              </FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <PopoverClose ref={popOverRef} />
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(e) => {
                      field.onChange(e);
                      popOverRef.current?.click();
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
              <input
                type="hidden"
                name={field.name}
                value={field.value?.toISOString()}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealPeriod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">
                What time did you have the meal?
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="justify-center gap-4"
                >
                  <ToggleGroupItem
                    asChild
                    value="dawn"
                    aria-label="Toggle dawn"
                  >
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
                    value="afternoon"
                    aria-label="Toggle afternoon"
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
              </FormControl>
              <FormMessage />
              <input type="hidden" name={field.name} value={field.value} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
