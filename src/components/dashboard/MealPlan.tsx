import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Flame, Beef, Droplet, Wheat } from "lucide-react";
import { GroceryList } from "./GroceryList";

const macros = [
  { label: "Calories", value: "≈ 2,250 kcal", detail: "~400 kcal deficit · split across 3 meals", icon: Flame, color: "text-accent" },
  { label: "Protein", value: "170 g", detail: "2.2 g / kg body weight", icon: Beef, color: "text-primary" },
  { label: "Carbs", value: "220 g", detail: "Bulk of carbs at lunch & dinner", icon: Wheat, color: "text-accent" },
  { label: "Fats", value: "65 g", detail: "Hormone & recovery", icon: Droplet, color: "text-primary" },
];

const meals = [
  {
    name: "Lunch",
    time: "12:30 – 1:30 PM",
    kcal: "≈ 850 kcal",
    items: [
      "180 g chicken breast, grilled salmon, or lean beef",
      "1.5 cups cooked rice / quinoa / sweet potato",
      "Big mixed salad + 1 tbsp olive oil",
      "1 piece of fruit",
    ],
  },
  {
    name: "Snack",
    time: "4:00 – 5:00 PM (or 60–90 min pre-training)",
    kcal: "≈ 350 kcal",
    items: [
      "200 g Greek yogurt + berries + 1 tbsp honey",
      "Or whey shake + 1 banana + rice cake",
      "Or 40 g nuts + apple",
      "Water + pinch of salt on football days",
    ],
  },
  {
    name: "Dinner",
    time: "Within 90 min after training / 7:30 – 9:00 PM",
    kcal: "≈ 1,050 kcal",
    items: [
      "200 g lean protein (chicken, fish, tofu, turkey, lean beef)",
      "1.5 cups carbs (rice / potatoes / pasta)",
      "2 cups vegetables + olive oil / avocado",
      "Optional 150 g Greek yogurt if still hungry pre-bed",
    ],
  },
];

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

      <div className="grid gap-4 md:grid-cols-2">
        {meals.map((meal) => (
          <Card key={meal.name} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{meal.name}</CardTitle>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  {meal.kcal}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{meal.time}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {meal.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}