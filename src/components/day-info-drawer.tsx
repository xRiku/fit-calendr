"use client";

import DayInfoForm from "./day-info-form";
import { useModalStore } from "@/stores/day-info-modal";
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
      <DrawerContent>
        <DrawerHeader aria-describedby="Day Info Form">
          <DrawerTitle className="font-extrabold text-2xl text-left">
            {dayInfoType === "create" && "Add info for the day"}
            {dayInfoType === "edit" && "Edit info for the day"}
          </DrawerTitle>
          <DrawerDescription className="text-left">
            {selectedDayInfo?.date.toDateString()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <DayInfoForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
