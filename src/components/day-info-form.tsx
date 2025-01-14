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

import { addDayInfo } from "@/actions/actions";
import { useModalStore } from "@/stores/day-info-modal";

const formSchema = z.object({
  cheatMealName: z.string().max(50).optional(),
  workoutDescription: z.string().max(50).optional(),
});

export default function DayInfoForm() {
  const { selectedDayInfo, dayInfoType, toggleDayInfoModalState } =
    useModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cheatMealName: selectedDayInfo?.cheatMeal?.name ?? "",
      workoutDescription: selectedDayInfo?.gymCheck?.description ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        id="day-info-form"
        action={async (formData) => {
          if (dayInfoType === "create") {
            await addDayInfo({
              formData,
              date: selectedDayInfo?.date ?? new Date(),
            });
          }

          if (dayInfoType === "edit") {
            // if (selectedDayInfo) {
            //   await updateCheatMeal({ id: selectedDayInfo.id, formData });
            // }
          }

          toggleDayInfoModalState();
        }}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        <FormField
          control={form.control}
          name="cheatMealName"
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
          name="workoutDescription"
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
