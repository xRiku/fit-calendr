import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto h-full">
      <section className="flex items-center justify-between w-full">
        <Card className="w-auto border-2 border-green-600 rounded-xl h-full">
          <CardContent className="flex flex-col items-start justify-center gap-2 py-8 px-8">
            <span className="text-5xl font-medium">Week xx of 20xx</span>
            <p className="text-4xl font-medium flex items-center gap-2 font-mono">
              <span className="text-6xl text-green-600 ">0</span> Cheat meals
              this week
            </p>
          </CardContent>
        </Card>
        <Card className="w-auto border-2 border-green-600 rounded-xl h-full">
          <CardContent className="flex flex-col items-start justify-center gap-2 py-8 px-8">
            <span className="text-5xl font-medium">xx/yy/zzzz</span>
            <p className="text-4xl font-medium flex items-center gap-2 font-mono">
              <span className="text-6xl text-green-600 ">0</span> Cheat meals
              today
            </p>
          </CardContent>
        </Card>
        <Card className="w-auto border-2 border-green-600 rounded-xl">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8 px-8">
            <p className="text-4xl font-medium flex items-center gap-2 font-mono ">
              <span className="text-8xl text-green-600 ">0</span>
            </p>
            <span className="text-3xl font-medium">
              Days since last cheat meal
            </span>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
