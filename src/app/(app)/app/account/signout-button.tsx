"use client";

import { logOut } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useWebHaptics } from "web-haptics/react";

export default function SignOutButton({
	className,
}: {
	className?: string;
}) {
	const haptic = useWebHaptics();

	return (
		<Button
			variant="outline"
			size="sm"
			className={className}
			onClick={async () => {
				haptic.trigger("warning");
				await logOut();
			}}
		>
			Sair
		</Button>
	);
}
