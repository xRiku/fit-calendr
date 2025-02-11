"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { signInWithCredentials, verifyOtp } from "@/actions/actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const signInFormSchema = z.object({
  email: z.string().email(),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const [shouldShowOtpField, setShouldShowOtpField] = useState(false);

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

  async function handleSignIn(_: unknown, formData: FormData) {
    await signInWithCredentials(formData.get("email") as string);
    setShouldShowOtpField(true);
  }

  const [, formAction, isPending] = useActionState(handleSignIn, null);

  const handleOnComplete = async (otp: string) => {
    const { email } = getValues();
    await verifyOtp(email, otp);
  };

  if (shouldShowOtpField) {
    return (
      <div className="flex flex-col space-y-4 items-center">
        <InputOTP onComplete={handleOnComplete} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="flex space-x-2">
          <span className="text-sm text-[#878787]">
            Didn&apos;t receive the email?
          </span>
          <button
            // onClick={() => setSent(false)}
            type="button"
            className="text-sm text-white underline font-medium"
          >
            Resend code
          </button>
        </div>
      </div>
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Continue
      </Button>
    </form>
  );
}
