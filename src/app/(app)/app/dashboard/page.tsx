import { fetchCheatMealsByYearGroupedByMonth } from "@/actions/actions";
import { auth } from "@/auth";
import H1 from "@/components/h1";
import { Calendar } from "@/components/ui/calendar";
import { add } from "date-fns";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const dataGroupedByMonth: { [key: string]: any } =
    await fetchCheatMealsByYearGroupedByMonth({
      id: session.user.id,
    });

  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto ">
      <H1 className="mb-8">Dashboard</H1>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-primary" /> Gym
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-secondary" /> Cheat Meal
        </div>
      </div>
      <div className="w-full flex items-start justify-start flex-wrap">
        {Array.from({ length: 12 }).map((_, i) => {
          return (
            <Calendar
              key={`calendar-${i}`}
              disableNavigation
              showOutsideDays={false}
              defaultMonth={add(new Date(2025, 0, 1), {
                months: i,
              })}
              modifiersArray={dataGroupedByMonth[i]?.map((item, i) => {
                return item.createdAt;
              })}
            />
          );
        })}
      </div>
    </main>
  );
}
