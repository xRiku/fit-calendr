import { cn } from "@/lib/utils";

export default function H2({
  children,
  className,
}: {
  children: string | React.ReactNode;
  className?: string;
}) {
  return <h1 className={cn("text-5xl font-bold", className)}>{children}</h1>;
}
