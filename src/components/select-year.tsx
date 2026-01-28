"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type SelectYearProps = {
	availableYears: number[];
	selectedYear: number;
};

export default function SelectYear({
	availableYears,
	selectedYear,
}: SelectYearProps) {
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
				defaultValue={String(selectedYear)}
				disabled={isPending}
				onValueChange={(value: string) => {
					startTransition(() =>
						router.push(`${pathname}?${createQueryString("year", value)}`),
					);
				}}
			>
				<SelectTrigger className="w-[120px]" isLoading={isPending}>
					<SelectValue defaultValue={String(selectedYear)} />
				</SelectTrigger>
				<SelectContent>
					{availableYears.map((year) => (
						<SelectItem key={year} value={String(year)}>
							{year}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
