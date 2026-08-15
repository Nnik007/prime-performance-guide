import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, HeartPulse, Footprints, CalendarCheck, Moon, ChevronDown, Scale, Activity } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHealthDays } from "@/lib/health.functions";
import { week } from "./WorkoutPlan";
import { WEEKLY_ROTATIONS, getWeekInfo } from "./MealPlan";
import { days as recoveryDays } from "./RecoveryPlan";

export function TodaySummary() {
  const [open, setOpen] = useState(true);
  const { data: healthDays = [] } = useQuery({
    queryKey: ["health-days"],
    queryFn: () => getHealthDays(),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  const latest = healthDays[healthDays.length - 1];
  const metrics = [
    { label: "Weight", value: latest?.weight_kg != null ? `${Number(latest.weight_kg).toFixed(1)} kg` : "—", Icon: Scale },
    { label: "Steps", value: latest?.steps != null ? String(latest.steps) : "—", Icon: Footprints },
    { label: "Sleep", value: latest?.sleep_hours != null ? `${Number(latest.sleep_hours).toFixed(1)} h` : "—", Icon: Moon },
    { label: "Resting HR", value: latest?.resting_hr != null ? `${latest.resting_hr} bpm` : "—", Icon: HeartPulse },
  ];
  const now = new Date();
  const long = now.toLocaleDateString("en-US", { weekday: "long" });
  const short = now.toLocaleDateString("en-US", { weekday: "short" });

  const workout = week.find((d) => d.day === long);
  const { weekNo } = getWeekInfo();
  const rotationIndex = ((weekNo % WEEKLY_ROTATIONS.length) + WEEKLY_ROTATIONS.length) % WEEKLY_ROTATIONS.length;
  const meal = WEEKLY_ROTATIONS[rotationIndex].find((d) => d.day === short);
  const recovery = recoveryDays.find((d) => d.day === short);

  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardHeader className="pb-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
        >
          <div className="flex min-w-0 items-center gap-2">
            <CalendarCheck className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <CardTitle className="text-base">Today</CardTitle>
              <p className="truncate text-xs text-muted-foreground">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workout && (
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[11px] text-primary">
                {workout.type === "football" ? "Football day" : workout.type === "rest" ? "Rest day" : "Gym day"}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      </CardHeader>
      {open && (
      <>
      <div className="mx-6 mb-3 rounded-2xl border border-border/60 bg-background/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-primary" />
          {latest ? `Apple Health · synced ${new Date(`${latest.day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "Apple Health · set up the Shortcut in the Health tab"}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {metrics.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-xl border border-border/50 bg-card/70 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="mt-1 font-display text-lg font-bold leading-none">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <CardContent className="grid divide-y divide-border/50 md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* Training */}
        <div className="py-3.5 md:px-4 md:py-0 md:first:pl-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Dumbbell className="h-3.5 w-3.5 text-primary" /> Training
          </div>
          <div className="mt-1.5 text-sm font-bold">{workout?.focus ?? "—"}</div>
          {workout?.duration && (
            <div className="text-xs text-muted-foreground">{workout.duration}</div>
          )}
          {workout && workout.blocks.length > 0 && (
            <ul className="mt-2.5 space-y-1 text-sm">
              {workout.blocks.slice(0, 3).map((b) => (
                <li key={b.name} className="text-muted-foreground">
                  <span className="text-foreground">{b.name}</span> — {b.details}
                </li>
              ))}
              {workout.blocks.length > 3 && (
                <li className="text-xs text-muted-foreground">+ {workout.blocks.length - 3} more in Training</li>
              )}
            </ul>
          )}
          {workout?.type === "football" && (
            <p className="mt-2.5 text-sm text-muted-foreground">Football session tonight — fuel up and skip extra leg volume.</p>
          )}
          {workout?.run && (
            <div className="mt-2.5 rounded-md border border-accent/30 bg-accent/10 p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <Footprints className="h-3.5 w-3.5" /> Separate run
              </div>
              <div className="mt-0.5 text-sm font-semibold">{workout.run.title}</div>
              <div className="text-xs text-muted-foreground">{workout.run.details}</div>
              <div className="text-xs text-muted-foreground">{workout.run.pacing.effort} · {workout.run.pacing.rpe}</div>
            </div>
          )}
        </div>

        {/* Meals */}
        <div className="py-3.5 md:px-4 md:py-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Apple className="h-3.5 w-3.5 text-accent" /> Meals
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">{meal?.focus}</div>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {[
              { label: "Lunch", value: meal?.lunch },
              { label: "Snack", value: meal?.snack },
              { label: "Dinner", value: meal?.dinner },
            ].map((m) => (
              <li key={m.label}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{m.label}</div>
                <div className="text-muted-foreground">{m.value ?? "—"}</div>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 text-xs text-muted-foreground">Target: ≈2,250 kcal · 170 g protein</div>
        </div>

        {/* Recovery */}
        <div className="py-3.5 md:px-4 md:py-0 md:last:pr-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HeartPulse className="h-3.5 w-3.5 text-accent" /> Recovery
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">After {recovery?.after}</div>
          <p className="mt-1.5 text-sm text-muted-foreground">{recovery?.protocol ?? "—"}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Moon className="h-3.5 w-3.5 text-primary" /> Sleep target 7.5–9 hrs · 3 L water
          </div>
        </div>
      </CardContent>
      </>
      )}
    </Card>
  );
}
