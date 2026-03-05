import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import Header from "./header";
import MainNav from "./main-nav";
import { MyAccountDropdown } from "./my-account-dropdown";

export default async function LoggedHeader() {
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

	const userRecord = session
		? await prisma.user.findUnique({
				where: { id: session.user.id },
				select: { avatarUrl: true },
			})
		: null;

	return (
		<Header>
			<MainNav />
			<MyAccountDropdown initialsFromName={initialsFromName} avatarUrl={userRecord?.avatarUrl} />
		</Header>
	);
}
