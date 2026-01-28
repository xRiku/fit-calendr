import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";

// import { Separator } from "@/components/ui/separator";
// import { GoogleSignInButton } from "./google-sign-in-button";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold tracking-tight">
					Login to FitCalendr
				</CardTitle>
				<CardDescription>
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
