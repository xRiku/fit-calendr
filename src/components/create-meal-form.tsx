"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const formSchema = z.object({
  mealName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(50),
  mealPeriod: z.enum(["dawn", "morning", "afternoon", "night", ""]),
});

export default function CreateMealForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealName: "",
      mealPeriod: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        id="create-meal-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        <FormField
          control={form.control}
          name="mealName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Meal name</FormLabel>
              <FormControl>
                <Input placeholder="type the name of your meal" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealPeriod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>What time did you have the meal?</FormLabel>
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
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
