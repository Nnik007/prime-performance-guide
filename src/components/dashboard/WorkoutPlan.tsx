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
import { Dumbbell, Trophy, History, ChevronDown, ChevronUp, Check } from "lucide-react";

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
    focus: "Football Training",
    type: "football",
    duration: "60–90 min",
    blocks: [
      { name: "Dynamic warm-up", details: "Mobility, activation, 10 min", alternatives: ["Skipping rope 5 min + leg swings", "Bike 5 min + world's greatest stretch"] },
      { name: "Team session", details: "Sprints, drills, small-sided games", alternatives: ["Solo: 6 × 60m sprints + ball work", "Interval run 5 × 3 min hard / 2 min easy"] },
      { name: "Cool-down", details: "Light jog + static stretch, 10 min", alternatives: ["Foam roll 8 min", "Easy bike 8 min"] },
    ],
  },
  {
    day: "Tuesday",
    focus: "Upper Push + Core",
    type: "gym",
    duration: "75 min",
    blocks: [
      { name: "Incline DB Press", details: "4 × 8 (RPE 8)", alternatives: ["Incline Barbell Press", "Incline Smith Press", "Incline Machine Press"] },
      { name: "Flat Machine Press", details: "3 × 10", alternatives: ["Flat DB Press", "Push-Ups (weighted)", "Cable Chest Press"] },
      { name: "Seated DB Shoulder Press", details: "4 × 8", alternatives: ["Standing Overhead Press", "Machine Shoulder Press", "Landmine Press"] },
      { name: "Cable Lateral Raise", details: "4 × 12", alternatives: ["DB Lateral Raise", "Machine Lateral Raise"] },
      { name: "Triceps Rope Pushdown", details: "3 × 12", alternatives: ["Overhead DB Extension", "Close-Grip Bench", "Dips"] },
      { name: "Hanging Leg Raise + Cable Crunch", details: "3 × 12 superset", alternatives: ["Ab Wheel + Plank", "Decline Sit-Up + Russian Twist"] },
    ],
  },
  {
    day: "Wednesday",
    focus: "Lower Body (Quad Focus) + Conditioning",
    type: "gym",
    duration: "80 min",
    blocks: [
      { name: "Back Squat", details: "4 × 6 (heavy but leave 2 in tank — football tomorrow)", alternatives: ["Front Squat", "Hack Squat", "Safety-Bar Squat"] },
      { name: "Bulgarian Split Squat", details: "3 × 10 / leg", alternatives: ["Reverse Lunge", "Step-Ups", "Split Squat (Smith)"] },
      { name: "Leg Press", details: "3 × 12", alternatives: ["Goblet Squat", "Pendulum Squat", "Belt Squat"] },
      { name: "Leg Curl", details: "3 × 12", alternatives: ["Nordic Curl", "Seated Leg Curl", "Swiss Ball Curl"] },
      { name: "Standing Calf Raise", details: "4 × 15", alternatives: ["Seated Calf Raise", "Leg-Press Calf Raise"] },
      { name: "Finisher: Assault bike", details: "6 × 20s hard / 40s easy", alternatives: ["Rower intervals", "Ski erg", "Kettlebell swings 5 × 20"] },
    ],
  },
  {
    day: "Thursday",
    focus: "Football Training",
    type: "football",
    duration: "60–90 min",
    blocks: [
      { name: "Warm-up", details: "Mobility + activation", alternatives: ["Bike 5 min + dynamic drills", "Jump rope 3 min + hip openers"] },
      { name: "Team session", details: "Focus on quality, not extra volume", alternatives: ["Solo: technical drills + 4 × 40m sprints", "Small-sided 5v5 (30–40 min)"] },
      { name: "Recovery walk", details: "10 min easy after", alternatives: ["Easy bike 10 min", "Pool walk 10 min"] },
    ],
  },
  {
    day: "Friday",
    focus: "Upper Pull + Arms",
    type: "gym",
    duration: "75 min",
    blocks: [
      { name: "Weighted Pull-Up", details: "4 × 6", alternatives: ["Lat Pulldown (heavy)", "Assisted Pull-Up", "Neutral-Grip Chin-Up"] },
      { name: "Chest-Supported Row", details: "4 × 10", alternatives: ["Barbell Row", "T-Bar Row", "Seal Row"] },
      { name: "Lat Pulldown (neutral)", details: "3 × 12", alternatives: ["Straight-Arm Pulldown", "Single-Arm Cable Pulldown"] },
      { name: "Face Pull", details: "4 × 15", alternatives: ["Reverse Pec Deck", "Rear Delt DB Fly", "Band Pull-Apart"] },
      { name: "Incline DB Curl", details: "3 × 10", alternatives: ["Barbell Curl", "Cable Curl", "Hammer Curl"] },
      { name: "Overhead Cable Triceps", details: "3 × 12", alternatives: ["Skull Crushers", "Rope Pushdown", "Bench Dips"] },
    ],
  },
  {
    day: "Saturday",
    focus: "Full Body + Metabolic Finisher",
    type: "gym",
    duration: "70 min",
    blocks: [
      { name: "Trap-Bar Deadlift", details: "4 × 5", alternatives: ["Romanian Deadlift", "Conventional Deadlift", "Rack Pulls"] },
      { name: "DB Bench Press", details: "3 × 10", alternatives: ["Barbell Bench", "Machine Chest Press", "Weighted Push-Ups"] },
      { name: "Walking Lunge", details: "3 × 10 / leg", alternatives: ["Reverse Lunge", "Step-Ups", "Sled Push"] },
      { name: "Cable Row", details: "3 × 12", alternatives: ["DB Row", "Machine Row", "Inverted Row"] },
      { name: "Finisher: KB swings + push-ups", details: "5 rounds: 15 swings / 10 push-ups", alternatives: ["Rower 5 × 250 m", "Battle ropes 5 × 30s", "Assault bike 6 × 20s"] },
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

function ExerciseLogger({
  day,
  exercise,
  options,
  log,
  setLog,
}: {
  day: string;
  exercise: string;
  options: string[];
  log: LogEntry[];
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}) {
  const last = useMemo(
    () =>
      [...log]
        .filter((e) => e.day === day && e.exercise === exercise)
        .sort((a, b) => b.ts - a.ts)[0],
    [log, day, exercise],
  );

  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState(last?.variant ?? exercise);
  const [sets, setSets] = useState(last?.sets ?? "");
  const [reps, setReps] = useState(last?.reps ?? "");
  const [weight, setWeight] = useState(last?.weight ?? "");
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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline"
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