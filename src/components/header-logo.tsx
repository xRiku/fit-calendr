import { Dumbbell } from "lucide-react";

export default function HeaderLogo() {
  return (
    <div className="text-lg font-bold tracking-wide flex gap-2 items-center">
      <Dumbbell className="sm:h-6 sm:w-6 h-8 w-8 text-vibrant-green" />{" "}
      <p className="text-white hidden sm:inline-block">
        <span className="text-vibrant-green">Fit</span>Calendr
      </p>
    </div>
  );
}
