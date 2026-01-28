"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import DayInfoDialog from "./day-info-dialog";
import DayInfoDrawer from "./day-info-drawer";

export function DayInfoDrawerDialog() {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return <DayInfoDialog />;
	}

	return <DayInfoDrawer />;
}
