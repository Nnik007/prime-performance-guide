import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ShoppingCart, RotateCcw, Copy, Check } from "lucide-react";

const GROCERY_KEY = "forge-grocery";

type Item = { name: string; qty: string };

const GROCERIES: { group: string; items: Item[] }[] = [
  {
    group: "Proteins",
    items: [
      { name: "Chicken breast", qty: "1.2 kg" },
      { name: "Salmon fillets", qty: "2–3 fillets" },
      { name: "Lean beef mince or steak", qty: "500 g" },
      { name: "Turkey breast", qty: "400 g" },
      { name: "Tofu / tempeh", qty: "1 block" },
      { name: "Greek yogurt", qty: "1 kg tub" },
      { name: "Whey protein", qty: "1 tub" },
      { name: "Eggs", qty: "12" },
    ],
  },
  {
    group: "Carbs",
    items: [
      { name: "Rice (basmati or jasmine)", qty: "1 kg" },
      { name: "Quinoa", qty: "500 g" },
      { name: "Sweet potatoes", qty: "1 kg" },
      { name: "Pasta (wholegrain)", qty: "500 g" },
      { name: "Potatoes", qty: "1 kg" },
      { name: "Rice cakes", qty: "1 pack" },
      { name: "Bananas", qty: "7" },
      { name: "Oats", qty: "500 g" },
    ],
  },
  {
    group: "Produce",
    items: [
      { name: "Mixed salad greens", qty: "2 bags" },
      { name: "Broccoli / green beans", qty: "600 g" },
      { name: "Bell peppers", qty: "4" },
      { name: "Tomatoes & cucumber", qty: "500 g each" },
      { name: "Berries (fresh or frozen)", qty: "500 g" },
      { name: "Apples", qty: "6" },
      { name: "Avocado", qty: "3" },
      { name: "Lemons", qty: "3" },
    ],
  },
  {
    group: "Fats & Extras",
    items: [
      { name: "Extra virgin olive oil", qty: "500 ml" },
      { name: "Mixed nuts (almonds / walnuts)", qty: "300 g" },
      { name: "Honey", qty: "1 jar" },
      { name: "Sea salt & pepper", qty: "as needed" },
      { name: "Garlic & ginger", qty: "1 bulb + thumb" },
    ],
  },
  {
    group: "Hydration",
    items: [
      { name: "Sparkling water", qty: "6 × 1.5 L" },
      { name: "Herbal / green tea", qty: "1 box" },
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
      g.items.filter((i) => !checked[i.name]).map((i) => `- ${i.name} — ${i.qty}`),
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
          Derived from your meal plan · Tick items as you buy them · {gotCount}/{totalItems} in the basket.
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
                  <li key={item.name}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md p-1.5 -m-1.5 transition-colors hover:bg-muted/40">
                      <Checkbox
                        checked={!!checked[item.name]}
                        onCheckedChange={(v) =>
                          setChecked((prev) => ({ ...prev, [item.name]: !!v }))
                        }
                        className="mt-0.5"
                      />
                      <span className="flex flex-1 items-baseline justify-between gap-2 leading-snug">
                        <span
                          className={`text-sm ${
                            checked[item.name]
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`shrink-0 text-[11px] tabular-nums ${
                            checked[item.name]
                              ? "text-muted-foreground/70 line-through"
                              : "text-primary"
                          }`}
                        >
                          {item.qty}
                        </span>
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