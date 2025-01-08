import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus2 } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex w-full items-center justify-center">
          <UserPlus2 className="h-12 w-12" />
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Create account
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SignUpForm />
        <div className="flex justify-between items-center gap-2 ">
          <Separator className="w-2/5" />
          <p>or</p>
          <Separator className="w-2/5" />
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline underline-offset-4">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
