import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dumbbell, Trophy, History, ChevronDown, ChevronUp, Check, TrendingUp, TrendingDown, Target, Footprints, HeartPulse } from "lucide-react";
import { days as recoveryDays } from "./RecoveryPlan";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type Day = {
  day: string;
  focus: string;
  type: "gym" | "football" | "rest";
  duration: string;
  blocks: { name: string; details: string; alternatives?: string[] }[];
  run?: {
    title: string;
    details: string;
    when: string;
    pacing: { effort: string; hr: string; talkTest: string; rpe: string };
  };
};

export const week: Day[] = [
  {
    day: "Monday",
    focus: "Football",
    type: "football",
    duration: "",
    blocks: [],
  },
  {
    day: "Tuesday",
    focus: "Hybrid — Upper Strength + Zone 2",
    type: "gym",
    duration: "75–85 min",
    blocks: [
      { name: "Med-ball Slams + Band Pull-Aparts", details: "3 × 8 slams / 15 pulls (power primer)", alternatives: ["Plyo Push-Up + Face Pull", "KB High Pull + Band Row"] },
      { name: "Incline Barbell Press", details: "5 × 5 (heavy, RPE 8)", alternatives: ["Incline DB Press", "Incline Smith Press", "Weighted Dip 5 × 5"] },
      { name: "Weighted Pull-Up", details: "4 × 6", alternatives: ["Lat Pulldown (heavy)", "Neutral-Grip Chin-Up", "Assisted Pull-Up"] },
      { name: "Seated DB Shoulder Press", details: "3 × 8", alternatives: ["Standing Overhead Press", "Landmine Press", "Machine Shoulder Press"] },
      { name: "Chest-Supported Row", details: "3 × 10", alternatives: ["Barbell Row", "Cable Row", "Seal Row"] },
      { name: "Core", details: "Hanging Leg Raise 3 × 12 + Pallof Press 3 × 10/side", alternatives: ["Ab Wheel + Side Plank 45s", "Cable Crunch + Dead Bug"] },
    ],
    run: {
      title: "Easy Run (Zone 2)",
      details: "25–30 min conversational pace, nasal-breathing, ~65–75% MHR",
      when: "Separate session — morning or 6+ hrs before gym",
      pacing: {
        effort: "Easy",
        hr: "Zone 2 · ~65–75% MHR (≈125–145 bpm)",
        talkTest: "Full sentences, nasal breathing possible",
        rpe: "RPE 3–4 / 10",
      },
    },
  },
  {
    day: "Wednesday",
    focus: "Hybrid — Lower Power + Sprint Intervals",
    type: "gym",
    duration: "80–90 min",
    blocks: [
      { name: "Box Jumps", details: "5 × 3 (max intent, full rest) — power output", alternatives: ["Broad Jumps 5 × 3", "Depth Jumps 4 × 3", "Trap-Bar Jump 4 × 3"] },
      { name: "Back Squat", details: "5 × 4 (heavy, leave 2 in tank — football tomorrow)", alternatives: ["Front Squat", "Safety-Bar Squat", "Hack Squat"] },
      { name: "Cable Pull-Through", details: "4 × 10 (hinge, squeeze glutes hard)", alternatives: ["45° Back Extension (weighted)", "Hip Thrust", "Kettlebell Swing 4 × 12"] },
      { name: "Bulgarian Split Squat", details: "3 × 8 / leg", alternatives: ["Reverse Lunge", "Step-Ups (weighted)", "Split Squat (Smith)"] },
      { name: "Nordic Curl or Leg Curl", details: "3 × 8", alternatives: ["Glute-Ham Raise", "Seated Leg Curl", "Swiss Ball Curl"] },
      { name: "Sprint intervals (bike/rower)", details: "6 × 20s max @ 90s rest — non-impact conditioning", alternatives: ["Assault bike 6 × 20s", "Rower 6 × 150 m max", "Ski erg 6 × 20s"] },
    ],
  },
  {
    day: "Thursday",
    focus: "Football",
    type: "football",
    duration: "",
    blocks: [],
  },
  {
    day: "Friday",
    focus: "Hybrid — Upper Hypertrophy + Core",
    type: "gym",
    duration: "75 min",
    blocks: [
      { name: "Push Press", details: "4 × 5 (explosive drive)", alternatives: ["Landmine Push Press", "Log/DB Push Press", "Standing Overhead Press"] },
      { name: "Flat DB Press", details: "4 × 8–10", alternatives: ["Barbell Bench", "Machine Chest Press", "Weighted Push-Ups"] },
      { name: "Chest-Supported Row", details: "4 × 10", alternatives: ["Barbell Row", "T-Bar Row", "Seal Row"] },
      { name: "Lat Pulldown (neutral)", details: "3 × 12", alternatives: ["Straight-Arm Pulldown", "Single-Arm Cable Pulldown"] },
      { name: "Face Pull + Cable Lateral Raise", details: "3 × 15 superset", alternatives: ["Reverse Pec Deck + DB Lateral", "Band Pull-Apart + Machine Lateral"] },
      { name: "Arms superset", details: "Incline DB Curl 3 × 10 / Rope Pushdown 3 × 12", alternatives: ["Barbell Curl / Skull Crushers", "Hammer Curl / Close-Grip Bench"] },
      { name: "Core carry", details: "Farmer's Carry 4 × 40 m heavy", alternatives: ["Suitcase Carry 4 × 40 m/side", "Sled Push 4 × 20 m"] },
    ],
  },
  {
    day: "Saturday",
    focus: "Hybrid — Full-Body Strength + Metcon",
    type: "gym",
    duration: "70–80 min",
    blocks: [
      { name: "Barbell Hip Thrust", details: "5 × 5 (heavy, controlled — hinge power without pulling from the floor)", alternatives: ["Cable Pull-Through (heavy)", "45° Back Extension (weighted)", "Reverse Hyper"] },
      { name: "Weighted Dip", details: "4 × 6", alternatives: ["Close-Grip Bench", "Ring Dip", "Machine Dip"] },
      { name: "DB Bench Press", details: "3 × 10", alternatives: ["Barbell Bench", "Machine Chest Press", "Weighted Push-Ups"] },
      { name: "Walking Lunge (loaded)", details: "3 × 10 / leg", alternatives: ["Reverse Lunge", "Step-Ups", "Sled Push"] },
      { name: "Cable Row", details: "3 × 12", alternatives: ["DB Row", "Machine Row", "Inverted Row"] },
      { name: "Metcon finisher", details: "5 rounds for time: 15 KB swings / 10 push-ups / 200 m row", alternatives: ["EMOM 12: 12 cal bike + 8 goblet squats", "5 × 250 m row + 15 swings", "Battle ropes 6 × 30s / 30s + 10 burpees"] },
    ],
    run: {
      title: "Tempo Run",
      details: "4 × 400 m @ 5k pace / 90s jog rest, or 20 min steady tempo run",
      when: "Separate session — morning, before gym",
      pacing: {
        effort: "Tempo",
        hr: "Zone 4 · ~85–90% MHR (≈160–175 bpm)",
        talkTest: "Short phrases only — 'comfortably hard'",
        rpe: "RPE 7–8 / 10",
      },
    },
  },
  {
    day: "Sunday",
    focus: "Full Rest / Active Recovery",
    type: "rest",
    duration: "20–30 min optional",
    blocks: [
      { name: "Optional walk", details: "30–45 min easy outdoor", alternatives: ["Easy bike 30 min", "Swim 20 min"] },
      { name: "Mobility flow", details: "Hips, ankles, thoracic — 15 min", alternatives: ["Yin yoga 20 min", "Foam roll full body 15 min"] },
      { name: "Sleep priority", details: "8+ hours tonight — Monday hits hard", alternatives: ["Nap 20–30 min if under-slept", "Screens off 60 min before bed"] },
    ],
  },
];

const typeStyles: Record<Day["type"], string> = {
  gym: "bg-primary/15 text-primary border-primary/30",
  football: "bg-accent/15 text-accent border-accent/30",
  rest: "bg-muted text-muted-foreground border-border",
};

const LOG_KEY = "forge-workout-log";
const RUN_LOG_KEY = "forge-run-log";

type LogEntry = {
  id: string;
  ts: number;
  day: string;
  exercise: string; // planned exercise name
  variant: string; // actual variant used
  sets: string;
  reps: string;
  weight: string;
};

function useWorkoutLog() {
  const [log, setLog] = useState<LogEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (raw) setLog(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch {
      /* ignore */
    }
  }, [log]);
  return [log, setLog] as const;
}

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

function useRunLog() {
  const [log, setLog] = useState<RunEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RUN_LOG_KEY);
      if (raw) setLog(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(RUN_LOG_KEY, JSON.stringify(log));
    } catch { /* ignore */ }
  }, [log]);
  return [log, setLog] as const;
}

const FEEL_OPTIONS: { value: RunEntry["feel"]; label: string; emoji: string }[] = [
  { value: "great", label: "Great", emoji: "🔥" },
  { value: "solid", label: "Solid", emoji: "💪" },
  { value: "ok", label: "OK", emoji: "😐" },
  { value: "rough", label: "Rough", emoji: "😮‍💨" },
];

function RunLogger({
  day,
  run,
  log,
  setLog,
}: {
  day: string;
  run: NonNullable<Day["run"]>;
  log: RunEntry[];
  setLog: React.Dispatch<React.SetStateAction<RunEntry[]>>;
}) {
  const entries = useMemo(
    () => [...log].filter((e) => e.day === day).sort((a, b) => b.ts - a.ts),
    [log, day],
  );
  const last = entries[0];
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [distanceKm, setDistanceKm] = useState("");
  const [timeMin, setTimeMin] = useState("");
  const [feel, setFeel] = useState<RunEntry["feel"]>("");
  const [notes, setNotes] = useState("");
  const [rpe, setRpe] = useState("");
  const [hrZone, setHrZone] = useState<string>("");
  const [saved, setSaved] = useState(false);

  const pace = useMemo(() => {
    const d = Number(distanceKm);
    const t = Number(timeMin);
    if (!d || !t) return null;
    const paceMin = t / d;
    const m = Math.floor(paceMin);
    const s = Math.round((paceMin - m) * 60);
    return `${m}:${String(s).padStart(2, "0")} /km`;
  }, [distanceKm, timeMin]);

  const save = () => {
    if (!distanceKm && !timeMin && !feel) return;
    setLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ts: Date.now(),
        day,
        runTitle: run.title,
        distanceKm,
        timeMin,
        feel,
        notes,
        rpe,
        hrZone,
      },
    ]);
    setDistanceKm("");
    setTimeMin("");
    setFeel("");
    setNotes("");
    setRpe("");
    setHrZone("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="mt-3 border-t border-accent/20 pt-3">
      <div className="grid grid-cols-1 gap-1.5 text-[11px] text-muted-foreground sm:grid-cols-2">
        <div>
          <span className="font-semibold text-accent">Effort:</span> {run.pacing.effort}
        </div>
        <div>
          <span className="font-semibold text-accent">HR:</span> {run.pacing.hr}
        </div>
        <div>
          <span className="font-semibold text-accent">Talk test:</span> {run.pacing.talkTest}
        </div>
        <div>
          <span className="font-semibold text-accent">RPE:</span> {run.pacing.rpe}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent hover:underline"
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {open ? "Hide run log" : "Log this run"}
        </button>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => setHistoryOpen((o) => !o)}
            className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <History className="h-3 w-3" />
            {historyOpen ? "Hide history" : `History (${entries.length})`}
          </button>
        )}
      </div>
      {last && !open && (
        <div className="mt-1 text-[11px] text-muted-foreground">
          Last: {last.distanceKm || "?"} km · {last.timeMin || "?"} min
          {last.feel ? ` · ${FEEL_OPTIONS.find((f) => f.value === last.feel)?.emoji ?? ""}` : ""} —{" "}
          {formatDate(last.ts)}
        </div>
      )}
      {open && (
        <div className="mt-2 space-y-2 rounded-md border border-accent/30 bg-background/40 p-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="Distance (km)"
              inputMode="decimal"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
            <Input
              className="h-8 text-xs"
              placeholder="Time (min)"
              inputMode="decimal"
              value={timeMin}
              onChange={(e) => setTimeMin(e.target.value)}
            />
          </div>
          {pace && (
            <div className="text-[11px] text-muted-foreground">
              Avg pace: <span className="font-semibold text-foreground">{pace}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {FEEL_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFeel(feel === f.value ? "" : f.value)}
                className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                  feel === f.value
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1">{f.emoji}</span>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="RPE (1-10)"
              inputMode="decimal"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
            />
            <Select value={hrZone} onValueChange={(v) => setHrZone(v === "none" ? "" : v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="HR zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="Z1">Z1 · Recovery</SelectItem>
                <SelectItem value="Z2">Z2 · Easy</SelectItem>
                <SelectItem value="Z3">Z3 · Steady</SelectItem>
                <SelectItem value="Z4">Z4 · Threshold</SelectItem>
                <SelectItem value="Z5">Z5 · VO2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            className="h-8 text-xs"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button size="sm" onClick={save} className="h-7 w-full text-xs">
            {saved ? (
              <>
                <Check className="mr-1 h-3 w-3" /> Saved
              </>
            ) : (
              "Save run"
            )}
          </Button>
        </div>
      )}
      {historyOpen && entries.length > 0 && (
        <ul className="mt-2 space-y-1 rounded-md border border-border/60 bg-muted/20 p-2 text-[11px]">
          {entries.map((e) => {
            const d = Number(e.distanceKm);
            const t = Number(e.timeMin);
            const paceStr = d && t
              ? (() => {
                  const p = t / d;
                  const m = Math.floor(p);
                  const s = Math.round((p - m) * 60);
                  return `${m}:${String(s).padStart(2, "0")}/km`;
                })()
              : null;
            const feelOpt = FEEL_OPTIONS.find((f) => f.value === e.feel);
            return (
              <li key={e.id} className="text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <span className="truncate">
                    <span className="text-foreground">
                      {e.distanceKm || "?"} km · {e.timeMin || "?"} min
                    </span>
                    {paceStr ? ` · ${paceStr}` : ""}
                    {feelOpt ? ` · ${feelOpt.emoji} ${feelOpt.label}` : ""}
                  </span>
                  <span className="shrink-0">{formatDate(e.ts)}</span>
                </div>
                {e.notes && <div className="italic">{e.notes}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isoWeekKey(ts: number): string {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  // Monday as start of week
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function RunTrends({ log }: { log: RunEntry[] }) {
  const [weeks, setWeeks] = useState<4 | 8>(4);

  const data = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const day = (now.getDay() + 6) % 7;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - day);

    const buckets: {
      key: string;
      start: number;
      distance: number;
      timeMin: number;
      rpeSum: number;
      rpeCount: number;
      zoneCounts: Record<string, number>;
      runs: number;
    }[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const start = new Date(thisMonday);
      start.setDate(thisMonday.getDate() - i * 7);
      buckets.push({
        key: `${start.getDate()}/${start.getMonth() + 1}`,
        start: start.getTime(),
        distance: 0,
        timeMin: 0,
        rpeSum: 0,
        rpeCount: 0,
        zoneCounts: {},
        runs: 0,
      });
    }
    const minStart = buckets[0].start;
    for (const e of log) {
      if (e.ts < minStart) continue;
      const idx = Math.floor((e.ts - minStart) / (7 * 24 * 60 * 60 * 1000));
      if (idx < 0 || idx >= buckets.length) continue;
      const b = buckets[idx];
      const d = Number(e.distanceKm) || 0;
      const t = Number(e.timeMin) || 0;
      b.distance += d;
      b.timeMin += t;
      if (e.rpe) {
        const r = Number(e.rpe);
        if (!Number.isNaN(r)) {
          b.rpeSum += r;
          b.rpeCount += 1;
        }
      }
      if (e.hrZone) b.zoneCounts[e.hrZone] = (b.zoneCounts[e.hrZone] || 0) + 1;
      b.runs += 1;
    }
    return buckets.map((b) => {
      const pace = b.distance > 0 && b.timeMin > 0 ? b.timeMin / b.distance : null;
      const dominantZone =
        Object.entries(b.zoneCounts).sort((a, z) => z[1] - a[1])[0]?.[0] ?? "—";
      return {
        week: b.key,
        distance: Number(b.distance.toFixed(1)),
        timeMin: Math.round(b.timeMin),
        pace: pace ? Number(pace.toFixed(2)) : null,
        paceLabel: pace
          ? `${Math.floor(pace)}:${String(Math.round((pace - Math.floor(pace)) * 60)).padStart(2, "0")}/km`
          : "—",
        rpe: b.rpeCount ? Number((b.rpeSum / b.rpeCount).toFixed(1)) : null,
        zone: dominantZone,
        runs: b.runs,
      };
    });
  }, [log, weeks]);

  const hasAny = data.some((d) => d.runs > 0);

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
            <Footprints className="h-4 w-4" /> Run Trends
          </CardTitle>
          <div className="flex gap-1 rounded-md border border-border/60 p-0.5">
            {[4, 8].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeeks(w as 4 | 8)}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  weeks === w ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {w}w
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasAny ? (
          <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
            Log a few runs to see your distance, pace, RPE, and zone trends here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Weekly distance (km)
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    formatter={(v: number, _n, p: any) => [`${v} km · ${p.payload.timeMin} min`, "Distance"]}
                  />
                  <Bar dataKey="distance" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Avg pace (min/km) — lower is faster
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RLineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    domain={["auto", "auto"]}
                    reversed
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    formatter={(_v: number, _n, p: any) => [p.payload.paceLabel, "Pace"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="pace"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </RLineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Avg RPE (1–10)
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RLineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rpe"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </RLineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Weekly summary
              </div>
              <ul className="space-y-1 text-xs">
                {data.map((d) => (
                  <li
                    key={d.week}
                    className="flex items-center justify-between gap-2 border-b border-border/40 py-1 last:border-b-0"
                  >
                    <span className="text-muted-foreground">Wk {d.week}</span>
                    <span className="flex-1 text-right text-foreground">
                      {d.runs} run{d.runs === 1 ? "" : "s"} · {d.distance} km · {d.paceLabel}
                    </span>
                    <span className="w-16 shrink-0 text-right text-muted-foreground">
                      RPE {d.rpe ?? "—"} · {d.zone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function parseTargetReps(details: string): number | null {
  const m = details.match(/(\d+)\s*[×x]\s*(\d+)/);
  return m ? Number(m[2]) : null;
}

function weightIncrement(w: number): number {
  // Small isolation loads → smaller jumps
  if (w < 20) return 1;
  if (w < 40) return 2.5;
  return 2.5;
}

type Suggestion =
  | { kind: "overload"; weight: number; reps: number; note: string }
  | { kind: "repeat"; weight: number; reps: number; note: string }
  | { kind: "deload"; weight: number; reps: number; note: string }
  | { kind: "start"; note: string }
  | null;

function suggestNext(
  entries: LogEntry[],
  targetReps: number | null,
): Suggestion {
  const numeric = entries
    .filter((e) => e.weight && !isNaN(Number(e.weight)) && e.reps && !isNaN(Number(e.reps)))
    .sort((a, b) => a.ts - b.ts);

  if (numeric.length === 0) {
    return { kind: "start", note: "Log your first working set to unlock progression." };
  }

  const last = numeric[numeric.length - 1];
  const lastW = Number(last.weight);
  const lastR = Number(last.reps);
  const inc = weightIncrement(lastW);
  const target = targetReps ?? lastR;

  // Deload check: last 3 sessions same weight, reps not increasing.
  if (numeric.length >= 3) {
    const last3 = numeric.slice(-3);
    const sameWeight = last3.every((e) => Number(e.weight) === lastW);
    const notImproving = Number(last3[2].reps) <= Number(last3[0].reps);
    if (sameWeight && notImproving && lastR < target) {
      const deloadW = Math.round((lastW * 0.9) * 2) / 2; // nearest 0.5
      return {
        kind: "deload",
        weight: deloadW,
        reps: target,
        note: "3 stalled sessions — deload 10% and rebuild.",
      };
    }
  }

  if (lastR >= target) {
    return {
      kind: "overload",
      weight: lastW + inc,
      reps: target,
      note: `Hit target — add ${inc} kg.`,
    };
  }

  return {
    kind: "repeat",
    weight: lastW,
    reps: Math.min(target, lastR + 1),
    note: `Same weight — push for ${Math.min(target, lastR + 1)} reps.`,
  };
}

function SuggestionBadge({ suggestion }: { suggestion: Suggestion }) {
  if (!suggestion || suggestion.kind === "start") return null;
  const config = {
    overload: {
      cls: "border-primary/40 bg-primary/10 text-primary",
      icon: TrendingUp,
      label: "Progressive overload",
    },
    deload: {
      cls: "border-accent/40 bg-accent/10 text-accent",
      icon: TrendingDown,
      label: "Deload",
    },
    repeat: {
      cls: "border-border bg-muted/40 text-foreground",
      icon: Target,
      label: "Push reps",
    },
    start: {
      cls: "border-border bg-muted/40 text-muted-foreground",
      icon: Target,
      label: "Start",
    },
  }[suggestion.kind];
  const Icon = config.icon;
  return (
    <div className={`mt-1 flex items-start gap-1.5 rounded-md border px-2 py-1 text-[11px] ${config.cls}`}>
      <Icon className="mt-0.5 h-3 w-3 shrink-0" />
      <div className="flex-1 leading-snug">
        <span className="font-semibold uppercase tracking-wider">{config.label}:</span>{" "}
        {`${suggestion.weight} kg × ${suggestion.reps} · ${suggestion.note}`}
      </div>
    </div>
  );
}

function AltList({ alternatives }: { alternatives: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[11px] font-semibold uppercase tracking-wider text-accent hover:underline"
      >
        {open ? "Hide alternatives" : `Alternatives (${alternatives.length})`}
      </button>
      {open && (
        <div className="mt-1 text-xs text-muted-foreground">{alternatives.join(" · ")}</div>
      )}
    </div>
  );
}

function RecoveryNote({ after, protocol }: { after: string; protocol: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-md border border-border/60 bg-muted/30 p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <HeartPulse className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1 truncate">Recovery after {after}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="mt-1.5 text-sm text-muted-foreground">{protocol}</p>}
    </div>
  );
}

function ExerciseLogger({
  day,
  exercise,
  targetReps,
  options,
  log,
  setLog,
}: {
  day: string;
  exercise: string;
  targetReps: number | null;
  options: string[];
  log: LogEntry[];
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}) {
  const entries = useMemo(
    () =>
      [...log]
        .filter((e) => e.day === day && e.exercise === exercise)
        .sort((a, b) => a.ts - b.ts),
    [log, day, exercise],
  );
  const last = entries[entries.length - 1];
  const suggestion = useMemo(() => suggestNext(entries, targetReps), [entries, targetReps]);

  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState(last?.variant ?? exercise);
  const suggestedWeight =
    suggestion && suggestion.kind !== "start" ? String(suggestion.weight) : "";
  const suggestedReps =
    suggestion && suggestion.kind !== "start" ? String(suggestion.reps) : "";
  const [sets, setSets] = useState(last?.sets ?? "");
  const [reps, setReps] = useState(last?.reps ?? suggestedReps);
  const [weight, setWeight] = useState(last?.weight ?? suggestedWeight);
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!sets && !reps && !weight) return;
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: Date.now(),
      day,
      exercise,
      variant,
      sets,
      reps,
      weight,
    };
    setLog((prev) => [...prev, entry]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="mt-2">
      <SuggestionBadge suggestion={suggestion} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {open ? "Hide log" : "Log this exercise"}
      </button>
      {last && !open && (
        <div className="mt-1 text-[11px] text-muted-foreground">
          Last: {last.variant} · {last.sets || "?"}×{last.reps || "?"}
          {last.weight ? ` @ ${last.weight} kg` : ""} — {formatDate(last.ts)}
        </div>
      )}
      {open && (
        <div className="mt-2 rounded-md border border-border/60 bg-muted/20 p-2.5 space-y-2">
          {suggestion && suggestion.kind !== "start" && (
            <button
              type="button"
              onClick={() => {
                setWeight(String(suggestion.weight));
                setReps(String(suggestion.reps));
              }}
              className="text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              Use suggested {suggestion.weight} kg × {suggestion.reps}
            </button>
          )}
          <Select value={variant} onValueChange={setVariant}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o} className="text-xs">
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-3 gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="Sets"
              inputMode="numeric"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
            <Input
              className="h-8 text-xs"
              placeholder="Reps"
              inputMode="numeric"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <Input
              className="h-8 text-xs"
              placeholder="kg"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={save} className="h-7 w-full text-xs">
            {saved ? (
              <>
                <Check className="mr-1 h-3 w-3" /> Saved
              </>
            ) : (
              "Save set"
            )}
          </Button>
          {last && (
            <div className="text-[11px] text-muted-foreground">
              Last: {last.variant} · {last.sets || "?"}×{last.reps || "?"}
              {last.weight ? ` @ ${last.weight} kg` : ""} — {formatDate(last.ts)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DayHistory({ day, log }: { day: string; log: LogEntry[] }) {
  const [open, setOpen] = useState(false);
  const entries = useMemo(
    () => [...log].filter((e) => e.day === day).sort((a, b) => b.ts - a.ts),
    [log, day],
  );
  if (entries.length === 0) return null;
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <History className="h-3 w-3" />
        {open ? "Hide history" : `History (${entries.length})`}
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-md border border-border/60 bg-muted/20 p-2 text-[11px]">
          {entries.map((e) => (
            <li key={e.id} className="flex justify-between gap-2 text-muted-foreground">
              <span className="truncate">
                <span className="text-foreground">{e.variant}</span> · {e.sets || "?"}×
                {e.reps || "?"}
                {e.weight ? ` @ ${e.weight} kg` : ""}
              </span>
              <span className="shrink-0">{formatDate(e.ts)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WorkoutPlan() {
  const [log, setLog] = useWorkoutLog();
  const [runLog, setRunLog] = useRunLog();
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [openDay, setOpenDay] = useState<string | null>(
    () => week.find((d) => d.day === todayName)?.day ?? week[0].day,
  );
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/15 p-2.5">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Weekly Training Plan</h2>
          <p className="text-sm text-muted-foreground">
            Hybrid athlete build — strength, power, and conditioning across four gym days, wrapped around your football sessions.
          </p>
        </div>
      </div>

      <RunTrends log={runLog} />

      <div className="grid gap-3 md:grid-cols-2">
        {week.map((d) => {
          const isOpen = openDay === d.day;
          return (
          <Card
            key={d.day}
            className={`border-border/60 transition-colors hover:border-primary/40 ${isOpen ? "border-primary/40 md:col-span-2" : ""}`}
          >
            <CardHeader className={isOpen ? "pb-3" : "py-3"}>
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : d.day)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <CardTitle className="text-lg">
                  {d.day}
                  {d.day === todayName && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
                      Today
                    </span>
                  )}
                </CardTitle>
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className={typeStyles[d.type]}>
                    {d.type.toUpperCase()}
                  </Badge>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>
              {isOpen && d.type !== "football" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{d.focus}</span>
                  {d.duration && <span className="ml-auto text-xs">{d.duration}</span>}
                </div>
              )}
            </CardHeader>
            {isOpen && (
            <CardContent>
              {d.type === "football" ? (
                <div className="flex items-center gap-2 text-base font-semibold text-accent">
                  <Trophy className="h-4 w-4" />
                  Football
                </div>
              ) : (
              <ul className="space-y-2 text-sm">
                {d.blocks.map((b) => (
                  <li key={b.name} className="flex flex-col border-l-2 border-primary/40 pl-3">
                    <span className="font-medium text-foreground">{b.name}</span>
                    <span className="text-xs text-muted-foreground">{b.details}</span>
                    {b.alternatives && b.alternatives.length > 0 && (
                      <span className="mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-accent">Alt:</span>{" "}
                        {b.alternatives.join(" · ")}
                      </span>
                    )}
                    {d.type === "gym" && (
                      <ExerciseLogger
                        day={d.day}
                        exercise={b.name}
                        targetReps={parseTargetReps(b.details)}
                        options={[b.name, ...(b.alternatives ?? [])]}
                        log={log}
                        setLog={setLog}
                      />
                    )}
                  </li>
                ))}
              </ul>
              )}
              {d.type === "gym" && d.run && (
                <div className="mt-3 rounded-md border border-accent/40 bg-accent/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <Footprints className="h-3.5 w-3.5" />
                    Run session (separate)
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">{d.run.title}</div>
                  <div className="text-xs text-muted-foreground">{d.run.details}</div>
                  <div className="mt-1 text-[11px] italic text-muted-foreground">{d.run.when}</div>
                  <RunLogger day={d.day} run={d.run} log={runLog} setLog={setRunLog} />
                </div>
              )}
              {d.type === "gym" && <DayHistory day={d.day} log={log} />}
              {(() => {
                const rec = recoveryDays.find((r) => r.day === d.day.slice(0, 3));
                if (!rec) return null;
                return (
                  <div className="mt-3 rounded-md border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <HeartPulse className="h-3.5 w-3.5 text-accent" />
                      Recovery after {rec.after}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{rec.protocol}</p>
                  </div>
                );
              })()}
            </CardContent>
            )}
          </Card>
          );
        })}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Coach note:</span> With 5 years experience, keep the last rep of each working set 1–2 reps short of failure. Progress load or reps weekly. On football days, don't chase extra gym volume — recover instead.
        </CardContent>
      </Card>
    </div>
  );
}