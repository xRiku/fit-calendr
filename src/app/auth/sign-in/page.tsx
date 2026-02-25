import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// import { Separator } from "@/components/ui/separator";
// import { GoogleSignInButton } from "./google-sign-in-button";
import { SignInForm } from "./sign-in-form";

export const metadata = {
	title: "Login | FitCalendr",
	description: "Login to your FitCalendr account to track your daily habits.",
};

export default function SignInPage() {
	return (
		<Card className="bg-neutral-900 border-neutral-800 text-white">
			<CardHeader>
				<CardTitle className="text-xl font-semibold tracking-tight text-white">
					Login to FitCalendr
				</CardTitle>
				<CardDescription className="text-neutral-400">
					Add daily information to keep track of your healthy habits.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<SignInForm />
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
