import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Dumbbell, Apple, CheckCircle2, Brain, Footprints } from "lucide-react";
import { WorkoutPlan } from "@/components/dashboard/WorkoutPlan";
import { MealPlan } from "@/components/dashboard/MealPlan";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { RecoveryEssentials } from "@/components/dashboard/RecoveryPlan";
import { MindsetBoost } from "@/components/dashboard/MindsetBoost";
import { RunningGuide } from "@/components/dashboard/RunningGuide";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { TodaySummary } from "@/components/dashboard/TodaySummary";
import { HealthHub } from "@/components/dashboard/HealthHub";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Forge — Hybrid Training Hub with Apple Health Sync" },
      {
        name: "description",
        content:
          "Personal hybrid-athlete dashboard: weekly training, meals, run plans and habit tracking, synced with Apple Health metrics.",
      },
      { property: "og:title", content: "Forge — Hybrid Training Hub with Apple Health Sync" },
      {
        property: "og:description",
        content:
          "Weekly training, meals, running and habit tracking in one dashboard, powered by your Apple Health data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tabs = [
  { value: "health", label: "Health", Icon: Activity },
  { value: "workout", label: "Training", Icon: Dumbbell },
  { value: "running", label: "Running", Icon: Footprints },
  { value: "meals", label: "Meals", Icon: Apple },
  { value: "habits", label: "Tracker", Icon: CheckCircle2 },
  { value: "mindset", label: "Mindset", Icon: Brain },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-60"
        style={{ background: "radial-gradient(60% 100% at 20% 0%, var(--primary), transparent 70%)" }}
        aria-hidden
      />

      {/* Header */}
      <header className="relative border-b border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-7 md:px-6 md:py-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Forge · Hybrid Protocol
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.05] md:text-5xl">
            Train, eat, recover —{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              measured by your own body data.
            </span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            One dashboard for your football week, gym blocks, runs and meals — with Apple Health metrics
            flowing in from your iPhone.
          </p>
          <DailyQuote />
        </div>
      </header>

      {/* Dashboard */}
      <main className="relative mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-10">
        <div className="mb-5">
          <TodaySummary />
        </div>
        <Tabs defaultValue="health" className="w-full">
          <div className="sticky top-0 z-20 -mx-5 mb-5 border-b border-border/60 bg-background/90 px-5 py-2 backdrop-blur md:-mx-6 md:px-6">
            <TabsList className="grid h-auto w-full grid-cols-6 gap-1 rounded-xl bg-card/80 p-1">
              {tabs.map(({ value, label, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:flex-row md:gap-1.5 md:py-2 md:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="health"><HealthHub /></TabsContent>
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

      <footer className="relative border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Forge · Consistency compounds. Show up.
      </footer>
    </div>
  );
}
