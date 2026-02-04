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
			variant="destructive"
			className={className}
			onClick={async () => {
				await logOut();
			}}
		>
			Sign out
		</Button>
	);
}
