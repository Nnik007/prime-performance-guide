import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Moon, Waves } from "lucide-react";

const days = [
  { day: "Mon", after: "Football", protocol: "10-min cool-down jog + full-body static stretch (hips, calves, hamstrings). Cold shower. Foam roll quads 3 min." },
  { day: "Tue", after: "Gym — Push", protocol: "5 min easy bike. Stretch chest & shoulders 5 min. 10 min screens-off wind-down." },
  { day: "Wed", after: "Gym — Legs", protocol: "Contrast shower (30s cold / 60s warm × 4). Elevate legs 10 min. Extra 300 ml water + electrolytes. Sleep 8+ hrs." },
  { day: "Thu", after: "Football", protocol: "10-min walk cool-down. Ice or cold shower on knees/ankles if sore. Magnesium before bed." },
  { day: "Fri", after: "Gym — Pull", protocol: "Lat + upper-back stretch 5 min. Nasal-breathing walk 15 min. Early bedtime — Saturday is heavy." },
  { day: "Sat", after: "Gym — Full Body", protocol: "Contrast shower. Full-body foam roll 10 min. High-protein dinner. Sauna if available (15 min)." },
  { day: "Sun", after: "Rest", protocol: "Full mobility flow 20 min. Optional easy walk 30–45 min. Meal prep. Lights out by 22:30." },
];

const pillars = [
  {
    icon: Moon,
    title: "Sleep",
    target: "7.5–9 hrs",
    tips: [
      "Same bedtime ± 30 min, 7 days a week",
      "Room cool (18°C), dark, phone out of reach",
      "No caffeine after 2 PM",
    ],
  },
  {
    icon: Waves,
    title: "Soft-Tissue & Mobility",
    target: "10 min daily",
    tips: [
      "Foam roll quads, glutes, T-spine",
      "Hip 90/90 + ankle rocks pre-lower-body",
      "Band pull-aparts pre-upper day",
    ],
  },
  {
    icon: HeartPulse,
    title: "Nervous System",
    target: "Daily",
    tips: [
      "5 min box breathing on stressful days",
      "Watch resting HR — if 5+ bpm high, ease intensity",
      "1 full rest day (Sunday) is non-negotiable",
    ],
  },
];

export function RecoveryPlan() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2.5">
          <HeartPulse className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recovery Plan</h2>
          <p className="text-sm text-muted-foreground">
            5 hard sessions per week is high load. Recovery is the multiplier — treat it like training.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p.icon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </div>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  {p.target}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {p.tips.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Daily Recovery Protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {days.map((d) => (
              <div key={d.day} className="flex gap-4 rounded-md border border-border/50 bg-muted/30 p-3">
                <div className="w-12 shrink-0">
                  <div className="text-sm font-bold text-primary">{d.day}</div>
                  <div className="text-xs text-muted-foreground">{d.after}</div>
                </div>
                <p className="text-sm text-muted-foreground">{d.protocol}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Deload every 5–6 weeks:</span> drop gym volume by ~40% for one week. It's not lost progress — it's how your body locks in the gains.
        </CardContent>
      </Card>
    </div>
  );
}