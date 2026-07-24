import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ShoppingCart, RotateCcw, Copy, Check } from "lucide-react";

const GROCERY_KEY = "forge-grocery";

const GROCERIES: { group: string; items: string[] }[] = [
  {
    group: "Proteins",
    items: [
      "Chicken breast (1.2 kg)",
      "Salmon fillets (2–3)",
      "Lean beef mince or steak (500 g)",
      "Turkey breast (400 g)",
      "Tofu / tempeh (1 block)",
      "Greek yogurt (1 kg tub)",
      "Whey protein",
      "Eggs (dozen)",
    ],
  },
  {
    group: "Carbs",
    items: [
      "Rice (basmati or jasmine)",
      "Quinoa",
      "Sweet potatoes",
      "Pasta (wholegrain)",
      "Potatoes",
      "Rice cakes",
      "Bananas",
      "Oats (for shakes / snack)",
    ],
  },
  {
    group: "Produce",
    items: [
      "Mixed salad greens",
      "Broccoli / green beans",
      "Bell peppers",
      "Tomatoes & cucumber",
      "Berries (fresh or frozen)",
      "Apples",
      "Avocado (2–3)",
      "Lemons",
    ],
  },
  {
    group: "Fats & Extras",
    items: [
      "Extra virgin olive oil",
      "Mixed nuts (almonds / walnuts)",
      "Honey",
      "Sea salt & pepper",
      "Garlic & ginger",
    ],
  },
  {
    group: "Hydration",
    items: [
      "Sparkling water",
      "Herbal / green tea",
    ],
  },
];

export function GroceryList() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GROCERY_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GROCERY_KEY, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked]);

  const totalItems = GROCERIES.reduce((n, g) => n + g.items.length, 0);
  const gotCount = Object.values(checked).filter(Boolean).length;

  const copyRemaining = async () => {
    const remaining = GROCERIES.flatMap((g) =>
      g.items.filter((i) => !checked[i]).map((i) => `- ${i}`),
    ).join("\n");
    try {
      await navigator.clipboard.writeText(remaining || "All items checked off — good week ahead.");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-4 w-4 text-primary" />
            Weekly Grocery List
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyRemaining} className="text-muted-foreground hover:text-foreground">
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy remaining"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setChecked({})} className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Derived from your meal plan. {gotCount}/{totalItems} in the basket.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROCERIES.map((g) => (
            <div key={g.group}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {g.group}
              </div>
              <ul className="space-y-1.5">
                {g.items.map((item) => (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md p-1.5 -m-1.5 transition-colors hover:bg-muted/40">
                      <Checkbox
                        checked={!!checked[item]}
                        onCheckedChange={(v) =>
                          setChecked((prev) => ({ ...prev, [item]: !!v }))
                        }
                        className="mt-0.5"
                      />
                      <span
                        className={`text-sm leading-snug ${
                          checked[item] ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}