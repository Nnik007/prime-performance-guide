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
import { Dumbbell, Trophy, History, ChevronDown, ChevronUp, Check, TrendingUp, TrendingDown, Target } from "lucide-react";

type Day = {
  day: string;
  focus: string;
  type: "gym" | "football" | "rest";
  duration: string;
  blocks: { name: string; details: string; alternatives?: string[] }[];
};

const week: Day[] = [
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
      { name: "Zone 2 conditioning", details: "20 min steady bike/row (nasal-breathing pace)", alternatives: ["Incline treadmill walk 20 min", "Easy jog 20 min", "Ski erg 20 min"] },
      { name: "Core", details: "Hanging Leg Raise 3 × 12 + Pallof Press 3 × 10/side", alternatives: ["Ab Wheel + Side Plank 45s", "Cable Crunch + Dead Bug"] },
    ],
  },
  {
    day: "Wednesday",
    focus: "Hybrid — Lower Power + Sprint Intervals",
    type: "gym",
    duration: "80–90 min",
    blocks: [
      { name: "Box Jumps", details: "5 × 3 (max intent, full rest) — power output", alternatives: ["Broad Jumps 5 × 3", "Depth Jumps 4 × 3", "Trap-Bar Jump 4 × 3"] },
      { name: "Back Squat", details: "5 × 4 (heavy, leave 2 in tank — football tomorrow)", alternatives: ["Front Squat", "Safety-Bar Squat", "Hack Squat"] },
      { name: "Romanian Deadlift", details: "4 × 6", alternatives: ["Trap-Bar RDL", "Single-Leg RDL", "Good Morning"] },
      { name: "Bulgarian Split Squat", details: "3 × 8 / leg", alternatives: ["Reverse Lunge", "Step-Ups (weighted)", "Split Squat (Smith)"] },
      { name: "Nordic Curl or Leg Curl", details: "3 × 8", alternatives: ["Glute-Ham Raise", "Seated Leg Curl", "Swiss Ball Curl"] },
      { name: "Sprint intervals", details: "6 × 30 m @ 90% + walk-back rest (or 6 × 20s bike sprints)", alternatives: ["Hill sprints 6 × 20s", "Assault bike 6 × 20s / 90s", "Rower 6 × 150 m max"] },
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
      { name: "Trap-Bar Deadlift", details: "5 × 3 (moderately heavy, fast concentric)", alternatives: ["Conventional Deadlift", "Rack Pulls", "Sumo Deadlift"] },
      { name: "Weighted Dip", details: "4 × 6", alternatives: ["Close-Grip Bench", "Ring Dip", "Machine Dip"] },
      { name: "DB Bench Press", details: "3 × 10", alternatives: ["Barbell Bench", "Machine Chest Press", "Weighted Push-Ups"] },
      { name: "Walking Lunge (loaded)", details: "3 × 10 / leg", alternatives: ["Reverse Lunge", "Step-Ups", "Sled Push"] },
      { name: "Cable Row", details: "3 × 12", alternatives: ["DB Row", "Machine Row", "Inverted Row"] },
      { name: "Metcon finisher", details: "5 rounds for time: 15 KB swings / 10 push-ups / 200 m row", alternatives: ["EMOM 12: 12 cal bike + 8 goblet squats", "5 × 250 m row + 15 swings", "Battle ropes 6 × 30s / 30s + 10 burpees"] },
    ],
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

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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
  if (!suggestion) return null;
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
        {suggestion.kind === "start"
          ? suggestion.note
          : `${suggestion.weight} kg × ${suggestion.reps} · ${suggestion.note}`}
      </div>
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
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/15 p-2.5">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Weekly Training Plan</h2>
          <p className="text-sm text-muted-foreground">
            Goal: lean out + build muscle. Balanced around your football sessions — hard gym days sit away from match load.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {week.map((d) => (
          <Card key={d.day} className="border-border/60 transition-colors hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{d.day}</CardTitle>
                <Badge variant="outline" className={typeStyles[d.type]}>
                  {d.type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-3.5 w-3.5" />
                <span>{d.focus}</span>
                <span className="ml-auto text-xs">{d.duration}</span>
              </div>
            </CardHeader>
            <CardContent>
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
              {d.type === "gym" && <DayHistory day={d.day} log={log} />}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Coach note:</span> With 5 years experience, keep the last rep of each working set 1–2 reps short of failure. Progress load or reps weekly. On football days, don't chase extra gym volume — recover instead.
        </CardContent>
      </Card>
    </div>
  );
}