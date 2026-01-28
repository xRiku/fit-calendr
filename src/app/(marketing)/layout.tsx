import LandingPageHeader from "@/components/landing-page-header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<LandingPageHeader />
			{children}
			<Toaster />
		</>
	);
}
