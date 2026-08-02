import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, HeartPulse, Footprints, CalendarCheck, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { week } from "./WorkoutPlan";
import { WEEKLY_ROTATIONS, getWeekInfo } from "./MealPlan";
import { days as recoveryDays } from "./RecoveryPlan";

export function TodaySummary() {
  const [open, setOpen] = useState(true);
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
    <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardHeader className="pb-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Today at a glance</CardTitle>
              <p className="text-xs text-muted-foreground">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workout && (
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
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
      <CardContent className="grid gap-4 md:grid-cols-3">
        {/* Training */}
        <div className="rounded-lg border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Dumbbell className="h-4 w-4 text-primary" /> Training
          </div>
          <div className="mt-2 font-bold">{workout?.focus ?? "—"}</div>
          {workout?.duration && (
            <div className="text-xs text-muted-foreground">{workout.duration}</div>
          )}
          {workout && workout.blocks.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm">
              {workout.blocks.slice(0, 4).map((b) => (
                <li key={b.name} className="text-muted-foreground">
                  <span className="text-foreground">{b.name}</span> — {b.details}
                </li>
              ))}
              {workout.blocks.length > 4 && (
                <li className="text-xs text-muted-foreground">+ {workout.blocks.length - 4} more in the Workout tab</li>
              )}
            </ul>
          )}
          {workout?.type === "football" && (
            <p className="mt-3 text-sm text-muted-foreground">Football session tonight — fuel up and skip extra leg volume.</p>
          )}
          {workout?.run && (
            <div className="mt-3 rounded-md border border-accent/30 bg-accent/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                <Footprints className="h-3.5 w-3.5" /> Separate run
              </div>
              <div className="mt-1 text-sm font-semibold">{workout.run.title}</div>
              <div className="text-xs text-muted-foreground">{workout.run.details}</div>
              <div className="mt-1 text-xs text-muted-foreground">{workout.run.pacing.effort} · {workout.run.pacing.rpe}</div>
            </div>
          )}
        </div>

        {/* Meals */}
        <div className="rounded-lg border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Apple className="h-4 w-4 text-accent" /> Meals
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{meal?.focus}</div>
          <ul className="mt-3 space-y-2 text-sm">
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
          <div className="mt-3 text-xs text-muted-foreground">Target: ≈2,250 kcal · 170 g protein</div>
        </div>

        {/* Recovery */}
        <div className="rounded-lg border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <HeartPulse className="h-4 w-4 text-accent" /> Recovery
          </div>
          <div className="mt-2 text-xs text-muted-foreground">After {recovery?.after}</div>
          <p className="mt-2 text-sm text-muted-foreground">{recovery?.protocol ?? "—"}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Moon className="h-3.5 w-3.5 text-primary" /> Sleep target 7.5–9 hrs · 3 L water
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
}
