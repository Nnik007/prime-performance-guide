import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Dumbbell, Apple, CheckCircle2, Brain, Footprints } from "lucide-react";
import { WorkoutPlan } from "@/components/dashboard/WorkoutPlan";
import { MealPlan } from "@/components/dashboard/MealPlan";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { RecoveryEssentials } from "@/components/dashboard/RecoveryPlan";
import { MindsetBoost } from "@/components/dashboard/MindsetBoost";
import { RunningGuide } from "@/components/dashboard/RunningGuide";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { TodaySummary } from "@/components/dashboard/TodaySummary";
import heroImg from "@/assets/hero-athlete.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const stats = [
  { label: "Current", value: "76.5 kg", sub: "16% BF" },
  { label: "Target", value: "72 kg", sub: "10–12% BF" },
  { label: "Height", value: "167 cm", sub: "" },
  { label: "Weekly load", value: "5 sessions", sub: "2 football · 3 gym" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt=""
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Flame className="h-4 w-4" />
            Forge Protocol
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Leaner, stronger,<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              built around your week.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            A complete training, nutrition, recovery, and mindset system tailored to your football schedule and 5 years in the gym.
          </p>

          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-card/60 p-3 backdrop-blur"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-lg font-bold text-foreground">{s.value}</div>
                {s.sub && <div className="text-xs text-muted-foreground">{s.sub}</div>}
              </div>
            ))}
          </div>

          <DailyQuote />
        </div>
      </header>

      {/* Dashboard */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <TodaySummary />
        </div>
        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-2 gap-1 bg-card p-1 md:grid-cols-5">
            <TabsTrigger value="workout" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dumbbell className="h-4 w-4" /> Training
            </TabsTrigger>
            <TabsTrigger value="running" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Footprints className="h-4 w-4" /> Running
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Apple className="h-4 w-4" /> Meals
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Tracker
            </TabsTrigger>
            <TabsTrigger value="mindset" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="h-4 w-4" /> Mindset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-8">
            <WorkoutPlan />
            <RecoveryEssentials />
          </TabsContent>
          <TabsContent value="running"><RunningGuide /></TabsContent>
          <TabsContent value="meals"><MealPlan /></TabsContent>
          <TabsContent value="habits"><HabitTracker /></TabsContent>
          <TabsContent value="mindset"><MindsetBoost /></TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Forge Protocol · Consistency compounds. Show up.
      </footer>
    </div>
  );
}
