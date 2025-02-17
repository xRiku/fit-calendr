"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 h-full sm:gap-10 items-center">
      <Link
        href="/app/calendar"
        className={`h-full flex items-center ${
          pathname === "/app/calendar" ? "underline" : ""
        } underline-offset-4 decoration-primary`}
      >
        Calendar
      </Link>
      <Link
        href="/app/dashboard"
        className={`h-full flex items-center ${
          pathname === "/app/dashboard" ? "underline" : ""
        } underline-offset-4 decoration-primary`}
      >
        Dashboard
      </Link>
    </nav>
  );
}
