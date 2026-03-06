import { Card, CardContent } from "@/components/ui/card";

// import { Separator } from "@/components/ui/separator";
// import { GoogleSignInButton } from "./google-sign-in-button";
import { SignInForm } from "./sign-in-form";

export const metadata = {
	title: "Entrar | FitCalendr",
	description:
		"Entre na sua conta FitCalendr para acompanhar seus hábitos diários.",
};

export default async function SignInPage({
	searchParams,
}: {
	searchParams: Promise<{ redirect?: string }>;
}) {
	const { redirect } = await searchParams;
	return (
		<Card className="bg-neutral-900 border-neutral-800 text-white">
			<CardContent className="flex flex-col gap-6">
				<SignInForm redirectTo={redirect} />
				{/* <div className="flex justify-between items-center gap-2 ">
          <Separator className="w-2/5" />
          <p>or</p>
          <Separator className="w-2/5" />
        </div>
        <GoogleSignInButton /> */}
			</CardContent>
		</Card>
	);
}
