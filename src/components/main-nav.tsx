"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-10 items-center">
      <Link
        href="/app/dashboard"
        className={`${
          pathname === "/app/dashboard" ? "underline" : ""
        } underline-offset-4`}
      >
        Dashboard
      </Link>
      <Link
        href="/app/account"
        className={`${
          pathname === "/app/account" ? "underline" : ""
        } underline-offset-4`}
      >
        Account
      </Link>
    </nav>
  );
}
