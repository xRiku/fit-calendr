import { Menu } from "lucide-react";
import { ModeToggle } from "./theme-toggle";

export default function SiteHeader() {
  return (
    <header className="w-full px-10 py-6 flex justify-between items-center mb-10">
      <h1 className="text-5xl font-bold tracking-widest">CHEAT MEAL TRACKER</h1>
      <div className="flex items-center gap-20 h-full">
        <p className="text-xl font-semibold tracking-wider font-mono">
          Limit: 2/week
        </p>
        <ModeToggle />
        <Menu size={40} />
      </div>
    </header>
  );
}
