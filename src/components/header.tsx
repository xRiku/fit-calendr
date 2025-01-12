import HeaderLogo from "./header-logo";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="w-full px-4 xl:px-6 h-14 flex justify-between items-center mb-10 backdrop-blur border-b bg-white/5">
      <HeaderLogo />
      {children}
    </header>
  );
}
