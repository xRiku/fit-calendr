"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
	DrawerTrigger,
} from "@/components/ui/drawer";

const ResponsiveDialogContext = React.createContext(true);

function ResponsiveDialog({
	children,
	...props
}: React.ComponentProps<typeof Dialog>) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<ResponsiveDialogContext.Provider value={true}>
				<Dialog {...props}>{children}</Dialog>
			</ResponsiveDialogContext.Provider>
		);
	}

	return (
		<ResponsiveDialogContext.Provider value={false}>
			<Drawer {...props}>{children}</Drawer>
		</ResponsiveDialogContext.Provider>
	);
}

function ResponsiveDialogTrigger(
	props: React.ComponentProps<typeof DialogTrigger>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? (
		<DialogTrigger {...props} />
	) : (
		<DrawerTrigger {...props} />
	);
}

function ResponsiveDialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof DialogContent>) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	if (isDesktop) {
		return (
			<DialogContent className={className} {...props}>
				{children}
			</DialogContent>
		);
	}
	return (
		<DrawerContent className="max-h-[95vh] flex flex-col">
			<div className="overflow-y-auto flex-1">{children}</div>
		</DrawerContent>
	);
}

function ResponsiveDialogHeader(
	props: React.HTMLAttributes<HTMLDivElement>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? <DialogHeader {...props} /> : <DrawerHeader {...props} />;
}

function ResponsiveDialogTitle(
	props: React.ComponentProps<typeof DialogTitle>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

function ResponsiveDialogDescription(
	props: React.ComponentProps<typeof DialogDescription>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? (
		<DialogDescription {...props} />
	) : (
		<DrawerDescription {...props} />
	);
}

function ResponsiveDialogFooter(
	props: React.HTMLAttributes<HTMLDivElement>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? <DialogFooter {...props} /> : <DrawerFooter {...props} />;
}

function ResponsiveDialogClose(
	props: React.ComponentProps<typeof DialogClose>,
) {
	const isDesktop = React.useContext(ResponsiveDialogContext);
	return isDesktop ? <DialogClose {...props} /> : <DrawerClose {...props} />;
}

export {
	ResponsiveDialog,
	ResponsiveDialogTrigger,
	ResponsiveDialogContent,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogClose,
};
