"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState, useTransition } from "react";
import { signInWithCredentials, verifyOtp } from "@/actions/actions";
import { OTPInput } from "./otp-input"; // Import the new OTPInput component
import { useRouter } from "next/navigation";

const signInFormSchema = z.object({
  email: z.string().email(),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const [shouldShowOtpField, setShouldShowOtpField] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const {
    formState: { errors },
    register,
    getValues,
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (hasError && otpCode.length !== 6) {
      setHasError(false);
    }
  }, [hasError, otpCode]);

  async function handleSignIn() {
    const { email } = getValues();
    await signInWithCredentials(email);
    setShouldShowOtpField(true);
  }

  const [, formAction, isPendingSubmit] = useActionState(handleSignIn, null);

  const handleOnComplete = async (otp: string) => {
    setIsLoading(true);
    const { email } = getValues();

    try {
      const { user } = await verifyOtp(email, otp);

      if (!user.name) {
        startTransition(() => {
          router.push("/setup");
        });
        return;
      }

      startTransition(() => {
        router.push("/app/dashboard");
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (shouldShowOtpField) {
    return (
      <OTPInput
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        handleOnComplete={handleOnComplete}
        hasError={hasError}
        // setHasError={setHasError}
        isLoading={isLoading}
        isNavigating={isNavigating}
        setShouldShowOtpField={setShouldShowOtpField}
      />
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          placeholder="Enter email address"
          id="email"
          type="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full bg-vibrant-green! font-semibold" disabled={isPendingSubmit}>
        {isPendingSubmit ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Continue
      </Button>
    </form>
  );
}
