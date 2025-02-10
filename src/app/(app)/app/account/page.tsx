import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignOutButton from "./signout-button";
import H1 from "@/components/h1";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="flex w-full flex-col items-center justify-center gap-8">
      <H1>Your account</H1>
      <h2>{session?.user?.email}</h2>
      <SignOutButton />
    </main>
  );
}
