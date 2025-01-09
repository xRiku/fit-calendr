import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="flex gap-10 items-center">
      <Link href="/app">Dashboard</Link>
      <Link href="/app/account">Account</Link>
    </nav>
  );
}
