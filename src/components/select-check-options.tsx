"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function SelectCheckOptions({ selected }: { selected: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  return (
    <Select
      defaultValue={selected}
      onValueChange={(value: string) => {
        router.push(`${pathname}?${createQueryString("selected", value)}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue defaultValue={selected} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gym-workout">Gym workout</SelectItem>
        <SelectItem value="cheat-meal">Cheat Meal</SelectItem>
      </SelectContent>
    </Select>
  );
}
