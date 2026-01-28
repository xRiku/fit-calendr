"use client";

import { logOut } from "@/actions/actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
	return (
		<Button
			variant="destructive"
			onClick={async () => {
				await logOut();
			}}
		>
			Sign out
		</Button>
	);
}
