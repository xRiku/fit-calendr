"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { addCheatMeal, updateCheatMeal } from "@/actions/actions";
import { useModalStore } from "@/stores/cheat-meal-modal";

const formSchema = z.object({
  mealName: z.string().max(50).optional(),
  mealPeriod: z.enum(["dawn", "morning", "afternoon", "night", ""]).optional(),
  mealDate: z.date().optional(),
});

type MealFormProps = {
  onFormSubmission: (mealType?: string) => void;
};

export default function DayInfoForm({ onFormSubmission }: MealFormProps) {
  const { selectedCheatMeal, mealType } = useModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealName: selectedCheatMeal ? selectedCheatMeal.name : "",
      mealPeriod: "",
      mealDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form
        id="day-info-form"
        action={async (formData) => {
          if (mealType === "create") {
            await addCheatMeal(formData);
          }

          if (mealType === "edit") {
            if (selectedCheatMeal) {
              await updateCheatMeal({ id: selectedCheatMeal.id, formData });
            }
          }
          onFormSubmission();
        }}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        <FormField
          control={form.control}
          name="mealName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">Cheat meal name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Hamburger" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">Workout description</FormLabel>
              <FormControl>
                <Input placeholder="e.g Chest workout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
