import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Pizza, BarChart4 } from "lucide-react";
import MotionDiv from "./motion-div";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="bg-black text-white py-8 p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="sm:text-6xl mb-6 font-extrabold tracking-tight underline-offset-8 text-3xl leading-9">
              Track Your{" "}
              <span className="decoration-dashed underline underline-offset-4 decoration-primary">
                Fitness
              </span>
              .
              <br /> Own Your{" "}
              <span className="decoration-dashed underline underline-offset-4 decoration-primary">
                Progress
              </span>
              .
            </h1>
            <p className="text-lg mb-6 max-w-md">
              FitCalendr helps you stay on top of your workouts and cheat meals
              with clear tracking and powerful analytics.
            </p>
            <Button className="bg-white text-black font-semibold hover:bg-neutral-200">
              Get Started
            </Button>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Card className="bg-black border border-neutral-800 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Dumbbell className="w-6 h-6 text-[#2adb7a]" />
                  <h2 className="text-xl font-bold">Workout Tracking</h2>
                </div>
                <p className="text-sm text-neutral-400">
                  Log and monitor your training sessions with ease.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border border-neutral-800 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Pizza className="w-6 h-6 text-[#2adb7a]" />
                  <h2 className="text-xl font-bold">Cheat Meal Frequency</h2>
                </div>
                <p className="text-sm text-neutral-400">
                  Stay mindful of your diet with simple cheat meal logs.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border border-neutral-800 text-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart4 className="w-6 h-6 text-[#2adb7a]" />
                  <h2 className="text-xl font-bold">Insightful Analytics</h2>
                </div>
                <p className="text-sm text-neutral-400">
                  Visualize patterns and optimize your health routine.
                </p>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </section>

      <section className=" py-8 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#2adb7a]">
            Why Choose FitCalendr?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            We combine simplicity, performance tracking, and behavioral
            awareness to help you build habits that stick.
          </p>

          <div className="grid md:grid-cols-3 gap-z'6 text-left">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                <span className="text-primary mr-2">✔</span>
                Easy Logging
              </h3>
              <p className="text-sm text-neutral-400">
                Quickly add workouts and meals in a few taps. Less typing, more
                doing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                <span className="text-primary mr-2">✔</span>
                Visual Feedback
              </h3>
              <p className="text-sm text-neutral-400">
                Charts and trends that make sense at a glance, keeping you
                engaged.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                <span className="text-primary mr-2">✔</span>
                Stay Accountable
              </h3>
              <p className="text-sm text-neutral-400">
                Get reminders and track consistency to hit your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
