"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTransition } from "react";

export default function SelectCheckOptions({ selected }: { selected: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  return (
    <div data-pending={isPending ? "" : undefined}>
      <Select
        defaultValue={selected}
        disabled={isPending}
        onValueChange={(value: string) => {
          startTransition(() =>
            router.push(`${pathname}?${createQueryString("selected", value)}`)
          );
        }}
      >
        <SelectTrigger className="w-[180px]" isLoading={isPending}>
          <SelectValue defaultValue={selected} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gym-workout" className="flex items-center">
            Workouts
          </SelectItem>
          <SelectItem value="cheat-meal">Cheat Meals</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
