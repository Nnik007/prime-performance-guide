import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Flame, Beef, Droplet, Wheat } from "lucide-react";

const macros = [
  { label: "Calories", value: "≈ 2,250 kcal", detail: "~400 kcal deficit", icon: Flame, color: "text-accent" },
  { label: "Protein", value: "170 g", detail: "2.2 g / kg body weight", icon: Beef, color: "text-primary" },
  { label: "Carbs", value: "220 g", detail: "Fuel training days", icon: Wheat, color: "text-accent" },
  { label: "Fats", value: "65 g", detail: "Hormone & recovery", icon: Droplet, color: "text-primary" },
];

const meals = [
  {
    name: "Breakfast",
    time: "7:30 – 8:30 AM",
    kcal: "≈ 500 kcal",
    items: [
      "3 whole eggs + 3 egg whites, scrambled",
      "1 slice sourdough or 60 g oats",
      "1 handful berries",
      "Black coffee or green tea",
    ],
  },
  {
    name: "Lunch",
    time: "12:30 – 1:30 PM",
    kcal: "≈ 650 kcal",
    items: [
      "150 g chicken breast, grilled salmon, or lean beef",
      "1 cup cooked rice / quinoa / sweet potato",
      "Big mixed salad + 1 tbsp olive oil",
    ],
  },
  {
    name: "Pre-Training Snack",
    time: "60–90 min before session",
    kcal: "≈ 250 kcal",
    items: [
      "1 banana + 1 rice cake with honey",
      "Or Greek yogurt + berries",
      "Water + pinch of salt on football days",
    ],
  },
  {
    name: "Post-Training / Dinner",
    time: "Within 90 min after training",
    kcal: "≈ 700 kcal",
    items: [
      "180 g lean protein (chicken, fish, tofu, turkey)",
      "1 cup carbs (rice / potatoes / pasta)",
      "2 cups vegetables + olive oil / avocado",
    ],
  },
  {
    name: "Evening Snack (optional)",
    time: "1–2 hrs before bed",
    kcal: "≈ 150 kcal",
    items: [
      "200 g Greek yogurt + cinnamon",
      "Or casein shake + almonds",
      "Skip if already at calorie target",
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
          <p><span className="font-semibold text-foreground">Weekend flex:</span> One social meal (~800 kcal) is fine — stay in weekly average.</p>
          <p><span className="font-semibold text-foreground">Weigh-in:</span> Same time Monday & Friday. Track 7-day average, not daily fluctuations.</p>
        </CardContent>
      </Card>
    </div>
  );
}