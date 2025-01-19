import CheckDialog from "@/components/check-dialog";
import LoggedHeader from "@/components/logged-header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoggedHeader />
      <main className="flex flex-col justify-center flex-1 gap-4 p-8 pt-6 ">
        {children}
      </main>
      <CheckDialog />
      <Toaster />
    </>
  );
}
