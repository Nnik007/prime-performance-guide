import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

const HABITS = [
  { id: "train", label: "Completed today's training / rest as planned", cat: "Training" },
  { id: "steps", label: "Hit 8k+ steps", cat: "Training" },
  { id: "protein", label: "Hit protein target (170 g)", cat: "Nutrition" },
  { id: "calories", label: "Stayed within calorie target", cat: "Nutrition" },
  { id: "water", label: "Drank 3+ L water", cat: "Nutrition" },
  { id: "veg", label: "Ate 2+ servings of vegetables", cat: "Nutrition" },
  { id: "sleep", label: "Slept 7.5+ hours last night", cat: "Recovery" },
  { id: "stretch", label: "10 min mobility / stretch", cat: "Recovery" },
  { id: "screens", label: "Screens off 30 min before bed", cat: "Recovery" },
  { id: "mindset", label: "Wrote 1 win from today", cat: "Mindset" },
];

const TIPS = [
  "Discipline beats motivation. Show up on the flat days — that's where the change happens.",
  "You're not starting from zero. Five years of training is a foundation, not a memory.",
  "Progress is a weekly average, not a daily win. Zoom out.",
  "Small streaks compound. Six good habits × 7 days = 42 wins a week.",
  "The gym doesn't care what mood you're in. Just start the warm-up.",
];

function todayKey() {
  return `forge-habits-${new Date().toISOString().slice(0, 10)}`;
}

export function HabitTracker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(todayKey());
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(todayKey(), JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked]);

  const completed = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completed / HABITS.length) * 100);

  const grouped = useMemo(() => {
    const g: Record<string, typeof HABITS> = {};
    for (const h of HABITS) (g[h.cat] ||= []).push(h);
    return g;
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/15 p-2.5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Daily Habit Tracker</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setChecked({})}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="pt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted-foreground">Today's completion</span>
            <span className="text-3xl font-bold text-primary">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {completed} of {HABITS.length} habits complete
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(grouped).map(([cat, items]) => (
          <Card key={cat} className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((h) => (
                <label
                  key={h.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md p-2 -m-2 transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={!!checked[h.id]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [h.id]: !!v }))
                    }
                    className="mt-0.5"
                  />
                  <span
                    className={`text-sm leading-snug ${
                      checked[h.id] ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {h.label}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" /> Motivational Nudge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base italic text-foreground">"{TIPS[tipIdx]}"</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-accent hover:text-accent"
            onClick={() => setTipIdx((i) => (i + 1) % TIPS.length)}
          >
            Next tip →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}