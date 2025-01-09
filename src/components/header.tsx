import { ModeToggle } from "./theme-toggle";
import MainNav from "./main-nav";

export default function Header() {
  return (
    <header className="w-full px-10 py-6 flex justify-between items-center mb-10 backdrop-blur border-b bg-white/5">
      <h1 className="text-5xl font-bold tracking-widest">CHEAT MEAL TRACKER</h1>
      <div className="flex items-center gap-20 h-full">
        <MainNav />
        <ModeToggle />
      </div>
    </header>
  );
}
