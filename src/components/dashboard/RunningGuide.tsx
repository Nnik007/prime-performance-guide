import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footprints, Zap, Timer, Mountain, Wind, Repeat, HeartPulse, Lightbulb } from "lucide-react";

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

      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <HeartPulse className="h-4 w-4" /> Your weekly run recipe
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