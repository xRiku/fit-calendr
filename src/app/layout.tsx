import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
	subsets: ["latin"],
	variable: "--font-onest",
});

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#F5F5F5" },
		{ media: "(prefers-color-scheme: dark)", color: "#121212" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
};

export const metadata: Metadata = {
	title: "FitCalendr - Registre Treinos e Hábitos",
	description:
		"Acompanhe a frequência dos seus treinos, sequências e refeições livres diariamente.",
	applicationName: "FitCalendr",
	appleWebApp: {
		capable: true,
		title: "FitCalendr",
		statusBarStyle: "black-translucent",
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		title: "FitCalendr",
		description: "Acompanhe a frequência dos seus treinos e refeições livres",
		type: "website",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "FitCalendr",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "FitCalendr",
		description: "Acompanhe a frequência dos seus treinos e refeições livres",
		images: ["/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className={`${onest.variable}`}>
			<body
				className={
					"dark:bg-[#121212] bg-[#F5F5F5] antialiased flex min-h-[100dvh] flex-col overscroll-none onest selection:bg-green-500/30"
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
