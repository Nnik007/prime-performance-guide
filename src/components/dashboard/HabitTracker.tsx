import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, RotateCcw, Sparkles, LineChart, Scale, Ruler, Trash2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

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

const MEASURES_KEY = "forge-measures";
type Measure = { week: string; weight: string; waist: string };

function currentWeekKey() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export function HabitTracker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [tipIdx, setTipIdx] = useState(0);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [waistInput, setWaistInput] = useState("");

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEASURES_KEY);
      if (raw) setMeasures(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MEASURES_KEY, JSON.stringify(measures));
    } catch {
      /* ignore */
    }
  }, [measures]);

  const saveMeasure = () => {
    if (!weightInput && !waistInput) return;
    const week = currentWeekKey();
    setMeasures((prev) => {
      const others = prev.filter((m) => m.week !== week);
      return [...others, { week, weight: weightInput, waist: waistInput }].sort((a, b) =>
        a.week.localeCompare(b.week),
      );
    });
    setWeightInput("");
    setWaistInput("");
  };

  const sortedMeasures = [...measures].sort((a, b) => b.week.localeCompare(a.week));
  const latest = sortedMeasures[0];
  const prev = sortedMeasures[1];
  const weightDelta =
    latest && prev && latest.weight && prev.weight
      ? Number(latest.weight) - Number(prev.weight)
      : null;
  const waistDelta =
    latest && prev && latest.waist && prev.waist
      ? Number(latest.waist) - Number(prev.waist)
      : null;

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
          <h2 className="text-2xl font-bold tracking-tight">Tracker</h2>
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

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <LineChart className="h-4 w-4 text-primary" /> Weekly Progress — Weight & Waist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Scale className="h-3.5 w-3.5 text-primary" /> Latest avg weight
              </div>
              <div className="mt-1 text-2xl font-bold">
                {latest?.weight ? `${latest.weight} kg` : "—"}
              </div>
              {weightDelta !== null && (
                <div className={`text-xs ${weightDelta <= 0 ? "text-primary" : "text-accent"}`}>
                  {weightDelta > 0 ? "+" : ""}
                  {weightDelta.toFixed(1)} kg vs previous week
                </div>
              )}
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Ruler className="h-3.5 w-3.5 text-accent" /> Latest waist
              </div>
              <div className="mt-1 text-2xl font-bold">
                {latest?.waist ? `${latest.waist} cm` : "—"}
              </div>
              {waistDelta !== null && (
                <div className={`text-xs ${waistDelta <= 0 ? "text-primary" : "text-accent"}`}>
                  {waistDelta > 0 ? "+" : ""}
                  {waistDelta.toFixed(1)} cm vs previous week
                </div>
              )}
            </div>
          </div>

          {sortedMeasures.length >= 2 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {(() => {
                const chartData = [...measures]
                  .sort((a, b) => a.week.localeCompare(b.week))
                  .map((m) => ({
                    week: m.week.slice(5),
                    weight: m.weight ? Number(m.weight) : null,
                    waist: m.waist ? Number(m.waist) : null,
                  }));
                return (
                  <>
                    <div className="rounded-lg border border-border/60 p-3">
                      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                        Weight trend (kg)
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        <RLineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 6,
                              fontSize: 12,
                            }}
                          />
                          <ReferenceLine y={72} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "Target 72", fill: "hsl(var(--accent))", fontSize: 10, position: "insideTopRight" }} />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            connectNulls
                          />
                        </RLineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                        Waist trend (cm)
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        <RLineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 6,
                              fontSize: 12,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="waist"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            connectNulls
                          />
                        </RLineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
              Log at least 2 weeks to see your weight & waist trends here.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="weight" className="text-xs uppercase tracking-wider text-muted-foreground">
                Avg weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 75.8"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="waist" className="text-xs uppercase tracking-wider text-muted-foreground">
                Waist (cm)
              </Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="e.g. 82"
                value={waistInput}
                onChange={(e) => setWaistInput(e.target.value)}
              />
            </div>
            <Button onClick={saveMeasure} className="sm:w-auto">
              Save this week
            </Button>
          </div>

          {sortedMeasures.length > 0 && (
            <div className="overflow-hidden rounded-md border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Week of</th>
                    <th className="px-3 py-2 text-left font-medium">Weight (kg)</th>
                    <th className="px-3 py-2 text-left font-medium">Waist (cm)</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {sortedMeasures.map((m) => (
                    <tr key={m.week} className="border-t border-border/60">
                      <td className="px-3 py-2 text-muted-foreground">{m.week}</td>
                      <td className="px-3 py-2 font-medium">{m.weight || "—"}</td>
                      <td className="px-3 py-2 font-medium">{m.waist || "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setMeasures((prev) => prev.filter((x) => x.week !== m.week))
                          }
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Log once a week — same day, same time (e.g. Monday morning). Trends matter more than daily swings.
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