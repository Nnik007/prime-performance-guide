import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Flame, Beef, Droplet, Wheat, CalendarDays, ChefHat, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { GroceryList } from "./GroceryList";

const macros = [
  { label: "Calories", value: "≈ 2,250 kcal", detail: "~400 kcal deficit · split across 3 meals", icon: Flame, color: "text-accent" },
  { label: "Protein", value: "170 g", detail: "2.2 g / kg body weight", icon: Beef, color: "text-primary" },
  { label: "Carbs", value: "220 g", detail: "Bulk of carbs at lunch & dinner", icon: Wheat, color: "text-accent" },
  { label: "Fats", value: "65 g", detail: "Hormone & recovery", icon: Droplet, color: "text-primary" },
];

export type DayPlan = {
  day: string;
  focus: string;
  lunch: string;
  snack: string;
  dinner: string;
};

// 4-week rotation. Each week's 7 days cycle deterministically by ISO week number.
export const WEEKLY_ROTATIONS: DayPlan[][] = [
  [
    { day: "Mon", focus: "Football night — carbs up", lunch: "Grilled chicken + basmati rice + roasted peppers & broccoli + olive oil", snack: "Greek yogurt + berries + honey + rice cake", dinner: "Salmon + sweet potato mash + sautéed spinach + lemon" },
    { day: "Tue", focus: "Gym (push)", lunch: "Lean beef stir-fry + jasmine rice + mixed veg", snack: "Whey shake + banana + 20 g almonds", dinner: "Turkey meatballs + wholegrain pasta + tomato sauce + side salad" },
    { day: "Wed", focus: "Gym (pull)", lunch: "Chicken quinoa bowl + avocado + cherry tomatoes + feta", snack: "Cottage cheese + apple + cinnamon", dinner: "Grilled steak + baked potato + green beans + chimichurri" },
    { day: "Thu", focus: "Football night — carbs up", lunch: "Tuna & white bean salad + olive oil + wholegrain toast", snack: "Rice cakes + peanut butter + banana", dinner: "Chicken thighs + jasmine rice + roasted courgette & carrots" },
    { day: "Fri", focus: "Gym (legs)", lunch: "Salmon poke bowl — rice, edamame, cucumber, avocado, soy-lime", snack: "Greek yogurt + granola + berries", dinner: "Lean beef burger patty (no bun) + sweet potato wedges + big salad" },
    { day: "Sat", focus: "Gym (upper)", lunch: "Chicken shawarma bowl + rice + hummus + tomato-cucumber salad", snack: "Whey shake + 1 pear", dinner: "Baked cod + herby potatoes + roasted asparagus + olive oil" },
    { day: "Sun", focus: "Rest — lighter carbs", lunch: "Omelette (4 eggs) + smoked salmon + sourdough + rocket", snack: "40 g mixed nuts + apple", dinner: "Roast chicken + quinoa tabbouleh + roasted veg" },
  ],
  [
    { day: "Mon", focus: "Football night — carbs up", lunch: "Chicken teriyaki + jasmine rice + steamed broccoli", snack: "Greek yogurt + honey + granola", dinner: "Beef & sweet potato chili + brown rice + avocado" },
    { day: "Tue", focus: "Gym (push)", lunch: "Turkey wrap (wholegrain) + hummus + spinach + tomato", snack: "Whey shake + rice cake + peanut butter", dinner: "Grilled salmon + couscous + roasted Mediterranean veg" },
    { day: "Wed", focus: "Gym (pull)", lunch: "Chicken caesar bowl (light dressing) + quinoa + parmesan", snack: "Cottage cheese + berries + honey", dinner: "Stir-fried tofu + rice noodles + pak choi + cashews" },
    { day: "Thu", focus: "Football night — carbs up", lunch: "Beef tacos (2) + rice + black beans + salsa + avocado", snack: "Banana + 20 g almonds", dinner: "Baked chicken + basmati rice + roasted carrots & parsnips" },
    { day: "Fri", focus: "Gym (legs)", lunch: "Salmon + wild rice + roasted beets + feta + rocket", snack: "Greek yogurt + granola + apple", dinner: "Lean pork loin + mashed potatoes + green beans" },
    { day: "Sat", focus: "Gym (upper)", lunch: "Chicken souvlaki + pita + tzatziki + tomato-onion salad", snack: "Whey shake + 1 orange", dinner: "Prawn & chicken paella + side salad" },
    { day: "Sun", focus: "Rest — lighter carbs", lunch: "Poached eggs + avocado toast + smoked salmon + rocket", snack: "40 g walnuts + pear", dinner: "Slow-cooked beef stew + small portion rice + steamed veg" },
  ],
  [
    { day: "Mon", focus: "Football night — carbs up", lunch: "Chicken burrito bowl — rice, black beans, corn, salsa, avocado", snack: "Greek yogurt + berries + honey", dinner: "Salmon + jasmine rice + stir-fried tenderstem broccoli" },
    { day: "Tue", focus: "Gym (push)", lunch: "Beef & broccoli stir-fry + basmati rice", snack: "Whey shake + banana + rice cake", dinner: "Chicken thighs + roasted new potatoes + roasted courgette" },
    { day: "Wed", focus: "Gym (pull)", lunch: "Turkey chili + brown rice + Greek yogurt on top", snack: "Cottage cheese + peach", dinner: "Grilled sea bass + quinoa + roasted peppers + olive oil" },
    { day: "Thu", focus: "Football night — carbs up", lunch: "Chicken pesto pasta (wholegrain) + cherry tomatoes + rocket", snack: "Rice cakes + almond butter + banana", dinner: "Steak + baked sweet potato + garlic spinach" },
    { day: "Fri", focus: "Gym (legs)", lunch: "Tuna nicoise — potatoes, eggs, olives, green beans, olive oil", snack: "Greek yogurt + granola + berries", dinner: "Chicken katsu (baked) + rice + shredded cabbage slaw" },
    { day: "Sat", focus: "Gym (upper)", lunch: "Lamb kofta + rice + hummus + tomato-cucumber salad", snack: "Whey shake + 20 g cashews", dinner: "Baked cod + mashed potato + peas + lemon butter" },
    { day: "Sun", focus: "Rest — lighter carbs", lunch: "Scrambled eggs + turkey bacon + sourdough + avocado", snack: "40 g almonds + apple", dinner: "Roast turkey breast + quinoa + roasted root veg" },
  ],
  [
    { day: "Mon", focus: "Football night — carbs up", lunch: "Chicken fajita bowl — rice, peppers, onions, avocado", snack: "Greek yogurt + berries + honey", dinner: "Salmon fishcakes + new potatoes + steamed greens" },
    { day: "Tue", focus: "Gym (push)", lunch: "Grilled chicken + couscous + roasted aubergine & tomato", snack: "Whey shake + rice cake + peanut butter", dinner: "Beef stir-fry + udon noodles + veg + sesame" },
    { day: "Wed", focus: "Gym (pull)", lunch: "Chicken & quinoa power bowl + kale + tahini dressing", snack: "Cottage cheese + berries", dinner: "Tuna steak + brown rice + roasted broccoli + chili flakes" },
    { day: "Thu", focus: "Football night — carbs up", lunch: "Turkey meatball sub (wholegrain) + salad", snack: "Banana + 20 g almonds + rice cake", dinner: "Chicken curry (light coconut) + basmati rice + spinach" },
    { day: "Fri", focus: "Gym (legs)", lunch: "Salmon teriyaki + jasmine rice + edamame + cucumber", snack: "Greek yogurt + granola + apple", dinner: "Lean beef bolognese + wholegrain spaghetti + parmesan" },
    { day: "Sat", focus: "Gym (upper)", lunch: "Chicken pita + hummus + tabbouleh + olives", snack: "Whey shake + 1 banana", dinner: "Grilled prawns + garlic rice + roasted asparagus" },
    { day: "Sun", focus: "Rest — lighter carbs", lunch: "Shakshuka (3 eggs) + sourdough + feta", snack: "40 g mixed nuts + pear", dinner: "Roast chicken + sweet potato mash + green salad" },
  ],
];

const BATCH_TIPS = [
  { title: "Sunday cook-up (90 min)", detail: "Roast a full tray of chicken breasts + a tray of sweet potato & veg. Boil a big pot of rice or quinoa. That's 3–4 lunches done." },
  { title: "Portion into containers", detail: "Split into 200 g protein + 1.5 cups carbs + veg containers. Grab-and-go stops mid-week takeaways." },
  { title: "Sauce = variety", detail: "Same chicken + rice tastes new with 3 sauces: teriyaki, salsa + avocado, tahini-lemon. Rotate to avoid boredom." },
  { title: "Fast proteins on hand", detail: "Boiled eggs, Greek yogurt, tuna tins, whey — always in the fridge for the snack window or a rushed dinner." },
  { title: "Freeze half", detail: "Cook Wednesday's dinner in a double batch — freeze one portion for a busy night in week 2." },
  { title: "Prep veg once", detail: "Wash + chop peppers, cucumbers, carrots on Sunday. Salads take 2 minutes all week." },
];

export function getWeekInfo() {
  const now = new Date();
  // ISO week number
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  // Monday of current week (local)
  const monday = new Date(now);
  const localDay = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - localDay);
  return { weekNo, monday };
}

const weekendOut = [
  {
    setting: "Burger / Grill spot",
    picks: [
      "Single beef or chicken burger, no mayo, swap fries for salad or sweet potato",
      "Grilled chicken or steak + veg side + small rice/potato",
      "Skip sugary drinks — sparkling water, diet soda, or black coffee",
    ],
  },
  {
    setting: "Italian / Pizza",
    picks: [
      "Thin-crust pizza, 4–6 slices, load with veg + lean protein topping",
      "Pasta with tomato/protein sauce (bolognese, chicken) — skip creamy",
      "Share a starter instead of ordering your own",
    ],
  },
  {
    setting: "Asian (sushi / Thai / Chinese)",
    picks: [
      "Sushi: sashimi + 1 roll, edamame, miso — skip tempura",
      "Thai: grilled chicken/beef + steamed rice + stir-fried veg, easy on peanut sauce",
      "Chinese: steamed dumplings, chicken & broccoli, plain rice — skip sweet-and-sour",
    ],
  },
  {
    setting: "Drinks / Bar night",
    picks: [
      "Cap at 2–3 drinks: vodka soda, gin & slim tonic, dry wine, light beer",
      "Eat a protein-heavy meal beforehand so you don't over-snack",
      "Water between every drink — cuts calories and next-day damage",
    ],
  },
];

export function MealPlan() {
  const { weekNo, monday } = useMemo(() => getWeekInfo(), []);
  const [offset, setOffset] = useState(0);
  const todayShort = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const [openDay, setOpenDay] = useState<string | null>(todayShort);
  const activeWeek = weekNo + offset;
  const rotationIndex = ((activeWeek % WEEKLY_ROTATIONS.length) + WEEKLY_ROTATIONS.length) % WEEKLY_ROTATIONS.length;
  const plan = WEEKLY_ROTATIONS[rotationIndex];
  const weekLabel = useMemo(() => {
    const start = new Date(monday);
    start.setDate(start.getDate() + offset * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, [monday, offset]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2.5">
          <Apple className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nutrition Plan</h2>
          <p className="text-sm text-muted-foreground">
            76.5 kg → 72 kg, 16% → 10–12% BF. Slow, sustainable cut — enough protein and carbs to keep muscle and training intensity.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {macros.map((m) => (
          <Card key={m.label} className="border-border/60">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <m.icon className={`h-4 w-4 ${m.color}`} />
                {m.label}
              </div>
              <div className="mt-2 text-2xl font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.detail}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">This week's plan</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Week {activeWeek} · {weekLabel} · Rotation {rotationIndex + 1} of {WEEKLY_ROTATIONS.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setOffset((o) => o - 1)}>Prev</Button>
              <Button size="sm" variant="outline" onClick={() => setOffset(0)} disabled={offset === 0}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> This week
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOffset((o) => o + 1)}>Next</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {plan.map((d) => {
              const isOpen = openDay === d.day;
              return (
              <div
                key={d.day}
                className={`rounded-lg border bg-card/60 p-3 transition-colors ${isOpen ? "border-primary/40" : "border-border/60"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenDay(isOpen ? null : d.day)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-2 text-left"
                >
                  <div className="text-sm font-bold">
                    {d.day}
                    {d.day === todayShort && (
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary">Today</span>
                    )}
                  </div>
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-[10px] text-accent">
                      {d.focus}
                    </Badge>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-primary">Lunch · ≈850 kcal</dt>
                    <dd className="text-muted-foreground">{d.lunch}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-primary">Snack · ≈350 kcal</dt>
                    <dd className="text-muted-foreground">{d.snack}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-primary">Dinner · ≈1,050 kcal</dt>
                    <dd className="text-muted-foreground">{d.dinner}</dd>
                  </div>
                </dl>
                )}
              </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Batch cooking playbook</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Do these once a week and mid-week eating gets 10× easier.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {BATCH_TIPS.map((t) => (
              <div key={t.title} className="rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="text-sm font-semibold">{t.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
          <p><span className="font-semibold text-foreground">Hydration:</span> 3–3.5 L water/day, more on football & double-session days.</p>
          <p><span className="font-semibold text-foreground">Weekend flex:</span> One social meal up to ~1,000 kcal is fine — pull back slightly the day before and after.</p>
          <p><span className="font-semibold text-foreground">Weigh-in:</span> Same time Monday & Friday. Track 7-day average, not daily fluctuations.</p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-bold tracking-tight">Weekend / Eating Out — Smart Swaps</h3>
        <p className="text-sm text-muted-foreground">
          Order like this and you can go out without derailing the week.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {weekendOut.map((w) => (
          <Card key={w.setting} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{w.setting}</CardTitle>
                <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
                  Smart pick
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {w.picks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <GroceryList />
    </div>
  );
}