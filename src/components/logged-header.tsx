import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import Header from "./header";
import { HeaderSkeleton } from "./header-skeleton";
import MainNav from "./main-nav";
import { MyAccountDropdown } from "./my-account-dropdown";

function LoggedHeaderContent({
	initialsFromName,
}: { initialsFromName: string }) {
	return (
		<Header>
			<MainNav />
			<MyAccountDropdown initialsFromName={initialsFromName} />
		</Header>
	);
}

async function LoggedHeaderAsync() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const getInitialsFromName = (name: string | undefined) => {
		if (!name) {
			return "?";
		}

		const splitedNames = name.split(" ");

		if (splitedNames.length === 1) {
			return `${splitedNames[0].slice(0, 2)}`;
		}

		return `${splitedNames[0][0]}${splitedNames[1][0]}`;
	};

	const initialsFromName = getInitialsFromName(
		session?.user.name,
	).toUpperCase();

	return <LoggedHeaderContent initialsFromName={initialsFromName} />;
}

export default function LoggedHeader() {
	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<LoggedHeaderAsync />
		</Suspense>
	);
}
