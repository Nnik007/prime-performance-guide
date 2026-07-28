import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Users, Timer, Shuffle, Eye, Compass, Flame, Anchor, Sunrise, Skull, Mountain } from "lucide-react";

type Shift = {
  id: string;
  label: string;
  Icon: typeof Brain;
  eyebrow: string;
  headline: string;
  body: string;
  strategies: { title: string; body: string; Icon: typeof Brain }[];
  reframe: string;
};

const SHIFTS: Shift[] = [
  {
    id: "identity",
    label: "Identity",
    Icon: Compass,
    eyebrow: "Identity Shift",
    headline: "You're not \"getting back\" to the gym. You're returning to a place your body already knows.",
    body: "Five years of training didn't disappear. Muscle memory, technique, work ethic — all still there. The first two weeks feel awkward for everyone; then your body remembers. Nobody in the gym is watching you. They're all inside their own set.",
    strategies: [
      { title: "The 2-Minute Rule", Icon: Timer, body: "You don't have to train — you just have to walk through the door and do 2 minutes. 95% of the time you'll finish the session. Momentum beats motivation." },
      { title: "Anchor a Non-Negotiable Slot", Icon: Target, body: "Same time each gym day (e.g. 6 PM Tue/Wed/Fri/Sat). Calendar it as a meeting with yourself. Identity forms around what you consistently show up to." },
      { title: "One Set at a Time", Icon: Users, body: "Don't judge the whole workout. Judge the next set. Focus shrinks anxiety — you already know how to do these lifts." },
    ],
    reframe: "\"I'm the kind of person who trains.\" Every session you show up for is a vote for that identity. Six weeks of votes and the doubt is gone.",
  },
  {
    id: "process",
    label: "Process",
    Icon: Anchor,
    eyebrow: "Process over Outcome",
    headline: "Fall in love with the reps, not the result.",
    body: "The scale, the mirror, the body-fat number — those are lagging indicators. The lead indicators are: did I show up, did I hit my sets, did I eat protein, did I sleep. Own the process and the outcome takes care of itself.",
    strategies: [
      { title: "Score the Day, Not the Week", Icon: Target, body: "At night, ask: did I do 3 controllables today (train / eat / sleep)? 2 out of 3 is a win. Don't wait for weekly weigh-in dopamine." },
      { title: "Minimum Viable Session", Icon: Timer, body: "Bad day? Do the first two lifts at 70% and go home. A B-minus session compounds. A skipped one doesn't." },
      { title: "Compare to Yesterday-You", Icon: Users, body: "Not Instagram-you. Not 22-year-old-you. Just did I move a fraction better than the last time in this exact seat." },
    ],
    reframe: "\"The reps are the reward.\" Progress is a byproduct of loving the work.",
  },
  {
    id: "fear",
    label: "Fear",
    Icon: Eye,
    eyebrow: "Spotlight Fallacy",
    headline: "Everyone in that gym is thinking about themselves, not you.",
    body: "The 'spotlight effect' is a real cognitive bias — we massively overestimate how much others notice us. Meanwhile everyone else is counting their own reps, checking their own form, wondering if people are watching them. The room is full of self-focus, not judgement.",
    strategies: [
      { title: "Look Around Once", Icon: Eye, body: "Before your first set, scan the room. Everyone's on their phone or in a set. Prove to yourself the audience is imaginary." },
      { title: "Headphones = Tunnel", Icon: Timer, body: "One playlist, one focus. Music narrows your world to the bar in front of you." },
      { title: "Own Beginner Sets", Icon: Users, body: "Start light on purpose. The strongest lifters warm up with the empty bar. Ego lift is what draws eyes, not humility." },
    ],
    reframe: "\"The spotlight I feel isn't real.\" Confidence is what's left after you drop imaginary audiences.",
  },
  {
    id: "energy",
    label: "Energy",
    Icon: Flame,
    eyebrow: "Energy Reframe",
    headline: "You don't need motivation. You need to lower activation energy.",
    body: "Motivation is unreliable. What you can control is friction — bag packed, shoes by the door, playlist queued, gym on the way home instead of past it. Make training the easiest option, not the disciplined one.",
    strategies: [
      { title: "Pack the Night Before", Icon: Timer, body: "Gym bag by the door. Shaker filled. Clothes ready. Morning-you should have zero decisions to make." },
      { title: "Habit Stacking", Icon: Target, body: "Attach training to something you already do daily: 'After work I drive to the gym before going home.' No detour = no exit." },
      { title: "Pre-Session Ritual", Icon: Users, body: "Same 3 things every time — walk-in track, 5-min bike, 1st warm-up set. Rituals bypass willpower." },
    ],
    reframe: "\"Discipline is design.\" Build a life where showing up is the path of least resistance.",
  },
  {
    id: "stoic",
    label: "Stoic",
    Icon: Mountain,
    eyebrow: "Stoic Frame",
    headline: "The obstacle in the way becomes the way.",
    body: "The awkwardness of coming back is not something to avoid — it IS the training. Feeling out of place, weaker, uncertain — that discomfort is exactly the raw material that forges the person you want to become. Skip the discomfort, skip the growth.",
    strategies: [
      { title: "Voluntary Discomfort", Icon: Skull, body: "Choose the hard set. Choose the front squat over the leg press one day. Small chosen hardships build unshakable ones." },
      { title: "Amor Fati", Icon: Mountain, body: "'Love your fate.' Bad session? That was the session you needed. Learn from it and move on — never rewind it in your head." },
      { title: "Memento Mori for Reps", Icon: Timer, body: "You will not always be able to lift. This body, this hour, this rep — none of them are guaranteed. Train while you can." },
    ],
    reframe: "\"The work is the way.\" Nothing to fix, nothing to fear — just the next rep, and the next.",
  },
  {
    id: "growth",
    label: "Growth",
    Icon: Sunrise,
    eyebrow: "Growth Mindset",
    headline: "Weakness today is a data point, not a verdict.",
    body: "If the weight feels heavier than you remember, that's not who you are — it's where you're starting from. A skill you can't yet do is a skill you can't do YET. The brain grows most when the task is uncomfortable but doable.",
    strategies: [
      { title: "Add 'Yet'", Icon: Sunrise, body: "'I can't press 80 kg' → 'I can't press 80 kg yet.' One word turns a wall into a door." },
      { title: "Track Small Wins", Icon: Target, body: "One more rep, 2.5 kg heavier, one better set. Progress is measurable weekly if you write it down." },
      { title: "Ask 'What Would Help?'", Icon: Users, body: "Instead of 'why am I bad at this?' ask 'what one input would make this better?' Sleep? Warm-up? Form cue? Fix inputs, outcomes follow." },
    ],
    reframe: "\"Not yet\" is the mantra. Every plateau has a next step — you just haven't found it yet.",
  },
];

export function MindsetBoost() {
  const [shiftId, setShiftId] = useState<string>(SHIFTS[0].id);
  const surprise = () => {
    const others = SHIFTS.filter((s) => s.id !== shiftId);
    const pick = others[Math.floor(Math.random() * others.length)];
    setShiftId(pick.id);
  };
  const shift = SHIFTS.find((s) => s.id === shiftId) ?? SHIFTS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/15 p-2.5">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mindset Shifts</h2>
            <p className="text-sm text-muted-foreground">
              Six lenses to break through resistance. Pick one that fits today.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={surprise}
          className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <Shuffle className="h-3.5 w-3.5" /> Surprise me
        </button>
      </div>

      <Tabs value={shiftId} onValueChange={setShiftId} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-card p-1 md:grid-cols-6">
          {SHIFTS.map((s) => {
            const Icon = s.Icon;
            return (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex items-center gap-1.5 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-3.5 w-3.5" /> {s.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SHIFTS.map((s) => (
          <TabsContent key={s.id} value={s.id} className="mt-6 space-y-6">
            <Card className="overflow-hidden border-primary/40 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
              <CardContent className="pt-8 pb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{s.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug text-foreground md:text-3xl">
                  {s.headline}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {s.strategies.map((strat, i) => {
                const Icon = strat.Icon;
                return (
                  <Card key={strat.title} className="border-border/60 transition-colors hover:border-primary/40">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">
                          {i + 1}
                        </div>
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <CardTitle className="pt-2 text-lg">{strat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">{strat.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">One-line reframe:</span> {s.reframe}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}