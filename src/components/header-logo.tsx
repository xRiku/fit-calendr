import { Dumbbell } from "lucide-react";

export default function HeaderLogo() {
  return (
    <div className="text-lg font-bold tracking-wide flex gap-2 items-center">
      <Dumbbell className="sm:h-6 sm:w-6 h-8 w-8 text-primary" />{" "}
      <p className="inline-block text-white">
        <span className="text-primary">Fit</span>Calendr
      </p>
    </div>
  );
}
