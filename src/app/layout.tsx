import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import "./globals.css";
import { ModeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cheat Meal Tracker",
  description: "Track your weekly cheat meals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark:bg-slate-950 bg-slate-50 antialiased min-h-screen `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="w-full px-10 py-6 flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold tracking-widest">
              CHEAT MEAL TRACKER
            </h1>
            <div className="flex items-center gap-20 h-full">
              <p className="text-xl font-semibold tracking-wider font-mono">
                Limit: 2/week
              </p>
              <ModeToggle />
              <Menu size={40} />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
