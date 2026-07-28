import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footprints, Zap, Timer, Mountain, Wind, Repeat, HeartPulse, Lightbulb, Trophy, Target, Sparkles, BatteryLow, BatteryMedium, BatteryFull, Check } from "lucide-react";

const RUN_LOG_KEY = "forge-run-log";
const GOALS_KEY = "forge-run-goals";
const RECOVERY_KEY = "forge-run-recovery";

type RunEntry = {
  id: string;
  ts: number;
  day: string;
  runTitle: string;
  distanceKm: string;
  timeMin: string;
  feel: "great" | "solid" | "ok" | "rough" | "";
  notes: string;
  rpe?: string;
  hrZone?: string;
};

type Goals = {
  targetDistanceKm: string;
  targetPaceMinPerKm: string;
  targetWeeklyKm: string;
};

function paceString(distanceKm: number, timeMin: number) {
  if (!distanceKm || !timeMin) return null;
  const p = timeMin / distanceKm;
  const m = Math.floor(p);
  const s = Math.round((p - m) * 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

function paceMinutes(distanceKm: number, timeMin: number): number | null {
  if (!distanceKm || !timeMin) return null;
  return timeMin / distanceKm;
}

function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [key]);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
  }, [key, state]);
  return [state, setState] as const;
}

const RUN_TYPES = [
  {
    name: "Easy / Zone 2",
    icon: Footprints,
    effort: "Conversational · RPE 3–4 · HR 60–70%",
    duration: "25–60 min",
    frequency: "1–2× per week",
    why: "Builds aerobic base, capillary density, and fat oxidation without adding fatigue. The backbone of hybrid athletes.",
    how: "Nose-breathe if you can. If you can't hold a full sentence, slow down — even to a brisk walk on hills.",
    color: "primary",
  },
  {
    name: "Tempo / Threshold",
    icon: Wind,
    effort: "Comfortably hard · RPE 7 · HR 80–88%",
    duration: "20–40 min",
    frequency: "1× per week (max)",
    why: "Raises your lactate threshold so faster paces feel easier. Big carryover to 90-min football.",
    how: "10 min easy → 20 min steady 'hard but sustainable' → 10 min easy. Or 4 × 5 min at threshold w/ 90s jog.",
    color: "accent",
  },
  {
    name: "Intervals / VO₂",
    icon: Zap,
    effort: "Hard · RPE 8–9 · HR 90–95%",
    duration: "20–30 min total",
    frequency: "0–1× per week",
    why: "Boosts top-end speed and VO₂ max. Skip on weeks with heavy football load — overlap is high.",
    how: "4–6 × 400 m at 5k pace with 90s jog rest, or 5 × 3 min hard w/ 2 min easy jog.",
    color: "accent",
  },
  {
    name: "Sprints / Strides",
    icon: Timer,
    effort: "Max · RPE 9–10 · short bursts",
    duration: "10–15 min",
    frequency: "Tack onto easy runs",
    why: "Preserves fast-twitch fibres — key for football and looking athletic, not just skinny.",
    how: "6–8 × 15–20 s near max on flat ground or slight hill, full walk-back recovery.",
    color: "primary",
  },
  {
    name: "Hill Repeats",
    icon: Mountain,
    effort: "Hard · RPE 8 · leg-driven",
    duration: "20–30 min",
    frequency: "1× every 2 weeks",
    why: "Strength-endurance for calves, glutes, hamstrings. Low-impact vs flat sprinting.",
    how: "6–10 × 30–45 s hard uphill, jog/walk down for recovery.",
    color: "primary",
  },
  {
    name: "Long Run",
    icon: Repeat,
    effort: "Easy → steady · RPE 4–5",
    duration: "45–75 min",
    frequency: "Optional, not every week",
    why: "Aerobic depth for match stamina. Keep it easy — this is not a race.",
    how: "Only if legs are fresh. Skip during heavy football weeks. Fuel 30 g carbs mid-run if >60 min.",
    color: "accent",
  },
];

const TIPS = [
  {
    title: "80/20 rule",
    body: "~80% of your weekly running should feel easy. The remaining 20% is where you push. Most people do the opposite and stall.",
  },
  {
    title: "Separate runs from lifts",
    body: "If you must combine, lift first then run easy. Never do a hard run within 6 hrs of a heavy leg session — recovery tanks and both suffer.",
  },
  {
    title: "Cadence over stride",
    body: "Aim for 170–180 steps per minute. Shorter, quicker strides reduce impact on knees and hips vs long, heel-first strides.",
  },
  {
    title: "Warm up first 5–10 min",
    body: "Never start hard cold. Walk-jog for 3–5 min, then a couple of strides before any tempo or interval work.",
  },
  {
    title: "Fuel & hydrate",
    body: "For runs <45 min, water is fine. Longer or intervals: 20–30 g carbs 30 min before. Post-run: protein within an hour.",
  },
  {
    title: "Shoes matter",
    body: "Rotate 2 pairs if you can — a cushioned trainer for easy days and a lighter/plated shoe for tempo. Replace every 600–800 km.",
  },
  {
    title: "Track how you FEEL, not just pace",
    body: "Pace is affected by heat, sleep, football load. Legs feel heavy? Drop to easy. Consistency beats hero sessions.",
  },
  {
    title: "Deload every 4th week",
    body: "Cut running volume ~30% every 4th week. Adaptation happens during recovery, not during the hard weeks.",
  },
];

const WEEKLY_RECIPE = [
  { day: "Tue", run: "Easy Zone 2 — 25–30 min", note: "Fat-burn base. AM or 6+ hrs from gym." },
  { day: "Sat", run: "Tempo or Intervals — 25–35 min", note: "Alternate weekly. Skip if football legs are trashed." },
];

export function RunningGuide() {
  const [runs, setRuns] = useState<RunEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RUN_LOG_KEY);
      if (raw) setRuns(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const [goals, setGoals] = useLocalState<Goals>(GOALS_KEY, {
    targetDistanceKm: "",
    targetPaceMinPerKm: "",
    targetWeeklyKm: "",
  });
  const [recovery, setRecovery] = useLocalState<"fresh" | "ok" | "tired" | "">(RECOVERY_KEY, "");

  // PRs
  const prs = useMemo(() => {
    let longest: RunEntry | null = null;
    let fastest: { entry: RunEntry; pace: number } | null = null;
    let bestRpe: { entry: RunEntry; score: number } | null = null; // low RPE at solid pace
    for (const r of runs) {
      const d = Number(r.distanceKm);
      const t = Number(r.timeMin);
      if (d && (!longest || d > Number(longest.distanceKm))) longest = r;
      const p = paceMinutes(d, t);
      if (p && (!fastest || p < fastest.pace)) fastest = { entry: r, pace: p };
      const rpe = Number(r.rpe);
      if (rpe && p && d >= 3) {
        // Efficiency: pace × rpe — lower is better
        const score = p * rpe;
        if (!bestRpe || score < bestRpe.score) bestRpe = { entry: r, score };
      }
    }
    return { longest, fastest, bestRpe };
  }, [runs]);

  // Last 14 days signal for personalization
  const recent = useMemo(() => {
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const list = runs.filter((r) => r.ts >= cutoff);
    const rpeVals = list.map((r) => Number(r.rpe)).filter((n) => n > 0);
    const avgRpe = rpeVals.length ? rpeVals.reduce((a, b) => a + b, 0) / rpeVals.length : null;
    const zones = list.map((r) => r.hrZone).filter(Boolean) as string[];
    const highZoneShare = zones.length
      ? zones.filter((z) => z === "Z4" || z === "Z5").length / zones.length
      : 0;
    const roughCount = list.filter((r) => r.feel === "rough").length;
    const totalKm = list.reduce((sum, r) => sum + (Number(r.distanceKm) || 0), 0);
    return { count: list.length, avgRpe, highZoneShare, roughCount, totalKm };
  }, [runs]);

  const recommendation = useMemo(() => {
    // Personalized weekly run types based on recent + recovery
    const tired = recovery === "tired" || recent.roughCount >= 2 || (recent.avgRpe ?? 0) >= 7.5;
    const overCooked = recent.highZoneShare > 0.4 && recent.count >= 2;
    const fresh = recovery === "fresh" && (recent.avgRpe === null || recent.avgRpe <= 5);

    if (tired) {
      return {
        tone: "recover" as const,
        headline: "Pull back — recovery week",
        detail:
          "Your recent runs are running hot (high RPE / rough feel). Swap intensity for aerobic base this week.",
        plan: [
          { day: "Tue", run: "Easy Zone 2 — 20–25 min", note: "Keep HR under 145. Nose-breathe or slow to a walk on hills." },
          { day: "Sat", run: "Optional easy 25–30 min OR skip", note: "If legs still heavy, replace with a 40 min walk." },
        ],
      };
    }
    if (overCooked) {
      return {
        tone: "balance" as const,
        headline: "Rebalance the 80/20",
        detail:
          "Too much Zone 4/5 in your last 2 weeks. Bring aerobic base back to build a bigger engine.",
        plan: [
          { day: "Tue", run: "Easy Zone 2 — 35–40 min", note: "Long-ish easy day. HR stays 65–75%." },
          { day: "Sat", run: "Strides — 6 × 20s at easy 20 min", note: "Preserves speed without the systemic cost of intervals." },
        ],
      };
    }
    if (fresh) {
      return {
        tone: "push" as const,
        headline: "Green light — quality session",
        detail: "Recovery feels fresh and RPE has been moderate. Great time for a quality workout.",
        plan: [
          { day: "Tue", run: "Easy Zone 2 — 30 min", note: "Prime the legs." },
          { day: "Sat", run: "Intervals — 5 × 3 min hard / 2 min jog", note: "Push VO₂. Warm up 10 min, cool down 5 min." },
        ],
      };
    }
    return {
      tone: "steady" as const,
      headline: "Stay the course",
      detail: "Signals look balanced. Keep the standard hybrid recipe.",
      plan: WEEKLY_RECIPE,
    };
  }, [recovery, recent]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2.5">
          <Footprints className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Running Playbook</h2>
          <p className="text-sm text-muted-foreground">
            Run smarter, not more — the right sessions for a hybrid athlete juggling football, gym, and fat loss.
          </p>
        </div>
      </div>

      {/* Goals */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <Target className="h-4 w-4" /> Running goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Target distance (km)</label>
              <Input
                className="mt-1 h-9 text-sm"
                inputMode="decimal"
                placeholder="e.g. 10"
                value={goals.targetDistanceKm}
                onChange={(e) => setGoals({ ...goals, targetDistanceKm: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Target pace (min/km)</label>
              <Input
                className="mt-1 h-9 text-sm"
                inputMode="decimal"
                placeholder="e.g. 5.0"
                value={goals.targetPaceMinPerKm}
                onChange={(e) => setGoals({ ...goals, targetPaceMinPerKm: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Weekly volume (km)</label>
              <Input
                className="mt-1 h-9 text-sm"
                inputMode="decimal"
                placeholder="e.g. 20"
                value={goals.targetWeeklyKm}
                onChange={(e) => setGoals({ ...goals, targetWeeklyKm: e.target.value })}
              />
            </div>
          </div>
          {(goals.targetDistanceKm || goals.targetPaceMinPerKm || goals.targetWeeklyKm) && (
            <div className="grid gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs sm:grid-cols-3">
              {goals.targetDistanceKm && prs.longest && (
                <div>
                  <span className="text-muted-foreground">Longest run: </span>
                  <span className="font-semibold text-foreground">{prs.longest.distanceKm} km</span>
                  <span className="text-muted-foreground"> / {goals.targetDistanceKm} km</span>
                  {Number(prs.longest.distanceKm) >= Number(goals.targetDistanceKm) && (
                    <Check className="ml-1 inline h-3 w-3 text-primary" />
                  )}
                </div>
              )}
              {goals.targetPaceMinPerKm && prs.fastest && (
                <div>
                  <span className="text-muted-foreground">Fastest pace: </span>
                  <span className="font-semibold text-foreground">{paceString(Number(prs.fastest.entry.distanceKm), Number(prs.fastest.entry.timeMin))}</span>
                  <span className="text-muted-foreground"> / {goals.targetPaceMinPerKm} /km</span>
                  {prs.fastest.pace <= Number(goals.targetPaceMinPerKm) && (
                    <Check className="ml-1 inline h-3 w-3 text-primary" />
                  )}
                </div>
              )}
              {goals.targetWeeklyKm && (
                <div>
                  <span className="text-muted-foreground">Last 2 wk: </span>
                  <span className="font-semibold text-foreground">{recent.totalKm.toFixed(1)} km</span>
                  <span className="text-muted-foreground"> / {(Number(goals.targetWeeklyKm) * 2).toFixed(0)} km target</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PRs */}
      <Card className="border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
            <Trophy className="h-4 w-4" /> Personal records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-xs text-muted-foreground">Log runs in the Workout tab to start tracking PRs.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border/60 bg-card/60 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Longest distance</div>
                <div className="mt-1 text-xl font-bold text-foreground">
                  {prs.longest ? `${prs.longest.distanceKm} km` : "—"}
                </div>
                {prs.longest && (
                  <div className="text-[11px] text-muted-foreground">
                    {prs.longest.timeMin} min · {new Date(prs.longest.ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                )}
              </div>
              <div className="rounded-md border border-border/60 bg-card/60 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fastest pace</div>
                <div className="mt-1 text-xl font-bold text-foreground">
                  {prs.fastest ? paceString(Number(prs.fastest.entry.distanceKm), Number(prs.fastest.entry.timeMin)) : "—"}
                </div>
                {prs.fastest && (
                  <div className="text-[11px] text-muted-foreground">
                    {prs.fastest.entry.distanceKm} km · {new Date(prs.fastest.entry.ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                )}
              </div>
              <div className="rounded-md border border-border/60 bg-card/60 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Best effort ratio</div>
                <div className="mt-1 text-xl font-bold text-foreground">
                  {prs.bestRpe ? `RPE ${prs.bestRpe.entry.rpe}` : "—"}
                </div>
                {prs.bestRpe && (
                  <div className="text-[11px] text-muted-foreground">
                    {prs.bestRpe.entry.distanceKm} km @ {paceString(Number(prs.bestRpe.entry.distanceKm), Number(prs.bestRpe.entry.timeMin))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personalized recommendation */}
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-transparent to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> Personalized for this week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">How recovered do you feel?</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {([
                { v: "tired", label: "Beat up", Icon: BatteryLow },
                { v: "ok", label: "OK", Icon: BatteryMedium },
                { v: "fresh", label: "Fresh", Icon: BatteryFull },
              ] as const).map(({ v, label, Icon }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRecovery(recovery === v ? "" : v)}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    recovery === v
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-card/40 p-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  recommendation.tone === "recover"
                    ? "border-accent/40 text-accent"
                    : recommendation.tone === "push"
                    ? "border-primary/40 text-primary"
                    : "border-border text-muted-foreground"
                }
              >
                {recommendation.tone === "recover" ? "Recover" : recommendation.tone === "push" ? "Push" : recommendation.tone === "balance" ? "Rebalance" : "Steady"}
              </Badge>
              <div className="text-sm font-semibold text-foreground">{recommendation.headline}</div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{recommendation.detail}</p>
            {recent.count > 0 && (
              <div className="mt-2 text-[11px] text-muted-foreground">
                Last 2 wks: {recent.count} runs · {recent.totalKm.toFixed(1)} km · avg RPE {recent.avgRpe?.toFixed(1) ?? "—"} · {Math.round(recent.highZoneShare * 100)}% Z4/Z5
              </div>
            )}
            <ul className="mt-3 space-y-2">
              {recommendation.plan.map((r) => (
                <li key={r.day} className="flex items-center gap-3 rounded-md border border-border/60 bg-card/60 p-3">
                  <Badge variant="outline" className="border-primary/40 text-primary">{r.day}</Badge>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{r.run}</div>
                    <div className="text-xs text-muted-foreground">{r.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <HeartPulse className="h-4 w-4" /> Default weekly recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            With 2 football sessions and 3–4 gym days already loaded, <span className="font-semibold text-foreground">1–2 runs per week is the sweet spot</span>. More than that eats into recovery and strength.
          </p>
          <ul className="mt-3 space-y-2">
            {WEEKLY_RECIPE.map((r) => (
              <li key={r.day} className="flex items-center gap-3 rounded-md border border-border/60 bg-card/60 p-3">
                <Badge variant="outline" className="border-primary/40 text-primary">{r.day}</Badge>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{r.run}</div>
                  <div className="text-xs text-muted-foreground">{r.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Types of runs
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {RUN_TYPES.map((t) => {
            const Icon = t.icon;
            const isPrimary = t.color === "primary";
            return (
              <Card key={t.name} className="border-border/60 transition-colors hover:border-primary/40">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className={`h-4 w-4 ${isPrimary ? "text-primary" : "text-accent"}`} />
                      {t.name}
                    </CardTitle>
                    <Badge variant="outline" className={isPrimary ? "border-primary/40 text-primary" : "border-accent/40 text-accent"}>
                      {t.frequency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">Effort:</span> {t.effort}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Duration:</span> {t.duration}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Why it works: </span>
                    <span className="text-muted-foreground">{t.why}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">How to run it: </span>
                    <span className="text-muted-foreground">{t.how}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Lightbulb className="h-4 w-4 text-accent" /> Running tips
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="text-sm font-semibold text-foreground">{tip.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{tip.body}</div>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Coach note:</span> Football already gives you high-intensity running. Your added runs should mostly be <span className="text-primary font-semibold">easy</span> — that's what actually moves your aerobic ceiling and body composition. Save the hard efforts for one focused session per week.
        </CardContent>
      </Card>
    </div>
  );
}