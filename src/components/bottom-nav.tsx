"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Settings, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Calendar",
            href: "/app/calendar",
            icon: CalendarDays,
        },
        {
            name: "Dashboard",
            href: "/app/dashboard",
            icon: BarChart2,
        },
        {
            name: "Settings",
            href: "/app/settings",
            icon: Settings,
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
            <nav className="flex justify-around items-center h-16 px-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                                isActive
                                    ? "text-vibrant-green"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Icon className="size-6" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
