import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getMobileSession(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		return {
			session: null,
			userId: null,
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}
	return { session, userId: session.user.id, error: null };
}
