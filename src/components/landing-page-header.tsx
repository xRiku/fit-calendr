import Link from "next/link";
import Header from "./header";
import { Button } from "./ui/button";

export default function LandingPageHeader() {
  return (
    <Header>
      <Button asChild variant="default">
        <Link href="/auth/sign-in">Login</Link>
      </Button>
    </Header>
  );
}
