import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignOutButton from "./signout-button";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="flex w-full flex-col items-center justify-center gap-8">
      <h1 className="text-5xl">Your account</h1>
      <h2>{session?.user?.email}</h2>
      <SignOutButton />
    </main>
  );
}
