import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Users, Timer } from "lucide-react";

const strategies = [
  {
    icon: Timer,
    title: "The 2-Minute Rule",
    body: "You don't have to train — you just have to walk through the door and do 2 minutes. 95% of the time you'll finish the session. Momentum beats motivation.",
  },
  {
    icon: Target,
    title: "Anchor to a Non-Negotiable Slot",
    body: "Pick the same time each gym day (e.g. 6 PM Tue/Wed/Fri/Sat). Put it in your calendar as a meeting with yourself. Identity forms around what you consistently show up to.",
  },
  {
    icon: Users,
    title: "One Rep at a Time, One Set at a Time",
    body: "Don't judge the whole workout. Judge the next set. Focus shrinks anxiety — you already know how to do these lifts.",
  },
];

export function MindsetBoost() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/15 p-2.5">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Confidence Boost</h2>
          <p className="text-sm text-muted-foreground">
            The story you're telling yourself matters more than the weight on the bar today.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/40 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
        <CardContent className="pt-8 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Mindset Shift</p>
          <h3 className="mt-3 text-2xl font-bold leading-snug text-foreground md:text-3xl">
            You're not "getting back" to the gym. You're returning to a place your body already knows.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Five years of training didn't disappear. Muscle memory, technique, work ethic — all still there. The first two weeks feel awkward for everyone; then your body remembers. Nobody in the gym is watching you. They're all inside their own set.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {strategies.map((s, i) => (
          <Card key={s.title} className="border-border/60 transition-colors hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">
                  {i + 1}
                </div>
                <s.icon className="h-4 w-4 text-accent" />
              </div>
              <CardTitle className="pt-2 text-lg">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">One-line reframe:</span> "I'm the kind of person who trains." Every session you show up for is a vote for that identity. Six weeks of votes and the doubt is gone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}