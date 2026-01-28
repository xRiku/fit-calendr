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

import { addDayInfo, updateDayInfo } from "@/actions/actions";
import { useModalStore } from "@/stores/day-info-modal";
import { Button } from "./ui/button";
import { toast } from "sonner";

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
            toast.promise(
              addDayInfo({
                formData,
                date: selectedDayInfo?.date ?? new Date(),
              }),
              {
                loading: "Adding day info...",
                success: "Day info added",
                error: "Error",
              }
            );
          }

          if (dayInfoType === "edit") {
            toast.promise(
              updateDayInfo({
                cheatMealId: selectedDayInfo?.cheatMeal?.id,
                gymCheckId: selectedDayInfo?.gymCheck?.id,
                cheatMealName: form.formState.dirtyFields?.cheatMealName
                  ? (formData.get("cheatMealName") as string)
                  : undefined,
                workoutDescription: form.formState.dirtyFields
                  ?.workoutDescription
                  ? (formData.get("workoutDescription") as string)
                  : undefined,
                date: selectedDayInfo?.date ?? new Date(),
              }),
              {
                loading: "Editing day info...",
                success: "Day info updated",
                error: "Error",
              }
            );
          }

          toggleDayInfoModalState();
        }}
        className="space-y-4 flex flex-col items-end justify-center"
      >
        <FormField
          control={form.control}
          name="workoutDescription"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">
                Workout description{" "}
                <span className="text-xs font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g Chest workout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cheatMealName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-bold">
                Cheat meal name{" "}
                <span className="text-xs font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g Hamburger" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex flex-col w-full sm:hidden gap-2 mt-4 pb-4">
        <Button
          type="submit"
          disabled={
            !Object.values(form.getValues()).some((value) => {
              return value.length > 0;
            }) && dayInfoType === "create"
          }
          form="day-info-form"
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => toggleDayInfoModalState()}>
          Cancel
        </Button>
      </div>
      <div className="hidden sm:flex sm:justify-center gap-4">
        <Button
          variant="outline"
          className="w-1/4"
          onClick={() => toggleDayInfoModalState()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !Object.values(form.getValues()).some((value) => {
              return value.length > 0;
            }) && dayInfoType === "create"
          }
          className="w-1/4"
          form="day-info-form"
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
