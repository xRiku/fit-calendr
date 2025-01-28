import H1 from "@/components/h1";

export default function MarketingPage() {
  return (
    <main className="flex w-full flex-col items-center p-4">
      <section className="block sm:hidden ">
        <H1 className="text-[28px] leading-7">
          Simplify your fitness journey: <br /> log{" "}
          <span className="decoration-dashed underline decoration-primary">
            workouts
          </span>{" "}
          and treats!
        </H1>
      </section>
      <section className="hidden sm:block">
        <H1>
          Simplify your fitness journey: <br /> log{" "}
          <span className="decoration-dashed underline decoration-primary">
            workouts
          </span>{" "}
          and treats!
        </H1>
      </section>
    </main>
  );
}
