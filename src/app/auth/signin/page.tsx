import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "./google-sign-in-button";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold tracking-tight">
              Get Started
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <SignInForm />
            <div className="flex justify-between items-center gap-2 ">
              <Separator className="w-2/5" />
              <p>or</p>
              <Separator className="w-2/5" />
            </div>
            <GoogleSignInButton />
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
