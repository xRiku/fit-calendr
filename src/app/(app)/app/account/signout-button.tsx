"use client";

import { logOut } from "@/actions/actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton({
	className,
}: {
	className?: string;
}) {
	return (
		<Button
			variant="outline"
			size="sm"
			className={className}
			onClick={async () => {
				await logOut();
			}}
		>
			Sair
		</Button>
	);
}
