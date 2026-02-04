"use client";

import { useModalStore } from "@/stores/day-info-modal";
import DayInfoForm from "./day-info-form";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "./ui/drawer";

export default function DayInfoDrawer() {
	const {
		dayInfoModalState,
		toggleDayInfoModalState,
		dayInfoType,
		selectedDayInfo,
	} = useModalStore();

	return (
		<Drawer
			open={dayInfoModalState}
			onOpenChange={() => toggleDayInfoModalState()}
		>
			<DrawerContent className="max-h-[90vh]">
				<DrawerHeader className="px-6 pt-6 pb-2 shrink-0">
					<DrawerTitle className="font-extrabold text-2xl text-left">
						{dayInfoType === "create" && "Add info for the day"}
						{dayInfoType === "edit" && "Edit info for the day"}
					</DrawerTitle>
					<DrawerDescription className="text-left text-base">
						{selectedDayInfo?.date.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-6 pb-8 overflow-y-auto">
					<DayInfoForm />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
