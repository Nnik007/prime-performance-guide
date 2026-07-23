import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Trophy } from "lucide-react";

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

export function WorkoutPlan() {
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
                  </li>
                ))}
              </ul>
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