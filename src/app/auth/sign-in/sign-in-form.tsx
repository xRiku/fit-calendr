"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signInWithCredentials } from "@/actions/actions";

const signInFormSchema = z.object({
  email: z.string().email(),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const {
    formState: { errors },
    register,
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSignIn(_: unknown, formData: FormData) {
    await signInWithCredentials(formData);
  }

  const [, formAction, isPending] = useActionState(handleSignIn, null);

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
