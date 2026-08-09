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

const tabs = [
  { value: "workout", label: "Training", Icon: Dumbbell },
  { value: "running", label: "Running", Icon: Footprints },
  { value: "meals", label: "Meals", Icon: Apple },
  { value: "habits", label: "Tracker", Icon: CheckCircle2 },
  { value: "mindset", label: "Mindset", Icon: Brain },
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
        <div className="relative mx-auto max-w-6xl px-5 py-9 md:px-6 md:py-14">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <Flame className="h-3.5 w-3.5" />
            Forge Protocol
          </div>
          <h1 className="mt-2.5 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">
            Leaner, stronger,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              built around your week.
            </span>
          </h1>
          <p className="mt-2.5 max-w-md text-sm text-muted-foreground">
            Training, nutrition, recovery and mindset — tuned to your football week.
          </p>

          <div className="mt-5 max-w-3xl divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur sm:flex sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5 sm:flex-1 sm:flex-col sm:items-start sm:gap-0.5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-foreground sm:text-lg">{s.value}</span>
                  {s.sub && <span className="text-xs text-muted-foreground">{s.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          <DailyQuote />
        </div>
      </header>

      {/* Dashboard */}
      <main className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-10">
        <div className="mb-5">
          <TodaySummary />
        </div>
        <Tabs defaultValue="workout" className="w-full">
          <div className="sticky top-0 z-20 -mx-5 mb-5 border-b border-border/60 bg-background/90 px-5 py-2 backdrop-blur md:-mx-6 md:px-6">
            <TabsList className="flex h-auto w-full gap-1 overflow-x-auto bg-card p-1">
              {tabs.map(({ value, label, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex flex-1 shrink-0 items-center justify-center gap-1.5 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="workout" className="space-y-6">
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
