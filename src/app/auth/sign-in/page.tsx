import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "./google-sign-in-button";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Login to FitCalendr
        </CardTitle>
        <CardDescription>
          Add day info to keep track of your fit habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SignInForm />
        <div className="flex justify-between items-center gap-2 ">
          <Separator className="w-2/5" />
          <p>or</p>
          <Separator className="w-2/5" />
        </div>
        <GoogleSignInButton />
        {/* <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div> */}
      </CardContent>
    </Card>
  );
}
