import CheckDialog from "@/components/check-dialog";
import LoggedHeader from "@/components/logged-header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoggedHeader />
      {children}
      <CheckDialog />
      <Toaster />
    </>
  );
}
