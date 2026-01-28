"use client";

import { DialogHeader, DialogContent, Dialog, DialogTitle } from "./ui/dialog";
import DayInfoForm from "./day-info-form";
import { useModalStore } from "@/stores/day-info-modal";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function DayInfoDialog() {
	const {
		dayInfoModalState,
		toggleDayInfoModalState,
		dayInfoType,
		selectedDayInfo,
	} = useModalStore();

	return (
		<Dialog
			open={dayInfoModalState}
			onOpenChange={() => toggleDayInfoModalState()}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader aria-describedby="Day Info Form">
					<DialogTitle className="font-extrabold text-2xl">
						{dayInfoType === "create" && "Add info for the day"}
						{dayInfoType === "edit" && "Edit info for the day"}
					</DialogTitle>
					<DialogDescription>
						{selectedDayInfo?.date.toDateString()}
					</DialogDescription>
				</DialogHeader>
				<DayInfoForm />
			</DialogContent>
		</Dialog>
	);
}
