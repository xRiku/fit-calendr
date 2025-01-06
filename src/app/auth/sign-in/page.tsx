import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { SignInButton } from "./sign-in-button";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center font-semibold tracking-tight">
              Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
