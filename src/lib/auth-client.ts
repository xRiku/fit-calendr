import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [emailOTPClient()],
});

export const signInGoogle = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/app/dashboard",
	});

	console.log("data", data);
};
