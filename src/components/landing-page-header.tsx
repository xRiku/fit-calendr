import Link from "next/link";
import Header from "./header";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPageHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Header>
      <Button 
        asChild 
        className="bg-[#2adb7a] hover:bg-[#22c96b] text-black font-medium px-6"
        size="sm"
      >
        <Link href={`${session?.user.id ? "/app/dashboard" : "/auth/sign-in"}`}>
          {session?.user.id ? "Dashboard" : "Sign In"}
        </Link>
      </Button>
    </Header>
  );
}
