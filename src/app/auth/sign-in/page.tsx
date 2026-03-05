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
	title: "Entrar | FitCalendr",
	description:
		"Entre na sua conta FitCalendr para acompanhar seus hábitos diários.",
};

export default function SignInPage() {
	return (
		<Card className="bg-neutral-900 border-neutral-800 text-white">
			<CardHeader>
				<CardTitle className="text-xl font-semibold tracking-tight text-white">
					Entrar no FitCalendr
				</CardTitle>
				<CardDescription className="text-neutral-400">
					Adicione informações diárias para acompanhar seus hábitos saudáveis.
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
