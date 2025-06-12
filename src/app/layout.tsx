import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "FitCalendr",
  description: "Track your workout frequency and cheat meals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${onest.variable}`}>
      <body
        className={
          "dark:bg-[#121212] bg-[#F5F5F5] antialiased min-h-screen onest"
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
