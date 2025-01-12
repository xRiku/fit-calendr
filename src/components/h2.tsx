export default function H2({
  children,
}: {
  children: string | React.ReactNode;
}) {
  return <h1 className="text-5xl font-bold">{children}</h1>;
}
