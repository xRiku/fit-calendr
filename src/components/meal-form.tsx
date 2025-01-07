"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { useRef } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
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

export default function MealForm({ onFormSubmission }: MealFormProps) {
  const { selectedCheatMeal, mealType } = useModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealName: selectedCheatMeal ? selectedCheatMeal.name : "",
      mealPeriod: "",
      mealDate: new Date(),
    },
  });

  const popOverRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Form {...form}>
      <form
        id="meal-form"
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
              <FormLabel className="font-bold">Meal name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Hamburger" {...field} />
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
              <FormLabel className="font-bold">Day you ate the meal</FormLabel>
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
      </form>
    </Form>
  );
}
