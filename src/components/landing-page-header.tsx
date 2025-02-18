import Link from "next/link";
import Header from "./header";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPageHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return;
  }

  return (
    <Header>
      <Button asChild variant="default">
        <Link href={`${session.user.id ? "/app/dashboard" : "/auth/sign-in"}`}>
          Login
        </Link>
      </Button>
    </Header>
  );
}
