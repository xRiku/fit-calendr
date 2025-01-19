"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-10 items-center">
      <Link
        href="/app/calendar"
        className={`${
          pathname === "/app/calendar" ? "underline" : ""
        } underline-offset-4 decoration-primary`}
      >
        Calendar
      </Link>
      <Link
        href="/app/dashboard"
        className={`${
          pathname === "/app/dashboard" ? "underline" : ""
        } underline-offset-4 decoration-primary`}
      >
        Dashboard
      </Link>
      <Link
        href="/app/account"
        className={`${
          pathname === "/app/account" ? "underline" : ""
        } underline-offset-4 decoration-primary`}
      >
        Account
      </Link>
    </nav>
  );
}
