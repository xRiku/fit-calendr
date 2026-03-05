"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signInWithCredentials, verifyOtp } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { OTPInput } from "./otp-input"; // Import the new OTPInput component

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
    trigger,
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
    const isValid = await trigger();
    if (!isValid) return;
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
        setIsLoading(false);
        return;
      }

      startTransition(() => {
        router.push("/app/dashboard");
      });
      setIsLoading(false);
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="px-0">
        <CardTitle className="text-xl text-left font-semibold tracking-tight text-white">
          Entrar no FitCalendr
        </CardTitle>
        <CardDescription className="text-neutral-400  text-left">
          {shouldShowOtpField
            ? "Um código foi enviado para o seu e-mail. Digite-o abaixo para continuar."
            : "Adicione informações diárias para acompanhar seus hábitos saudáveis."}
        </CardDescription>
      </CardHeader>
      {shouldShowOtpField ? (
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
      ) : (
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              placeholder="Digite seu e-mail"
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

          <Button
            type="submit"
            className="w-full bg-vibrant-green! font-semibold"
            disabled={isPendingSubmit}
          >
            {isPendingSubmit ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Continuar
          </Button>
        </form>
      )}
    </>
  );
}
