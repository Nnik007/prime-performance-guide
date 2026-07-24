Three additions to the dashboard, all frontend + localStorage (no backend needed).

## 1. Grocery List (Meals tab)

Add a new "Weekly Grocery List" section at the bottom of `MealPlan.tsx`, derived from the meal plan.

- Static default list grouped by aisle: **Proteins** (chicken breast, salmon, lean beef, turkey, tofu, Greek yogurt, whey, eggs), **Carbs** (rice, quinoa, sweet potato, pasta, potatoes, rice cakes, bananas), **Produce** (mixed salad greens, seasonal veg, berries, apples, avocado, lemons), **Fats & Extras** (olive oil, nuts, honey, salt), **Hydration** (sparkling water).
- Each item has a checkbox — checked state persists in localStorage (`forge-grocery`).
- "Reset list" button to clear checks. "Copy list" button to copy the unchecked (still-needed) items to clipboard for shopping.
- Small note that it's derived from the current meal plan.

## 2. Workout Logging (Workout tab)

Extend `WorkoutPlan.tsx` so each exercise block becomes loggable.

- Under each exercise, add a compact "Log" row (expand/collapse via a small button to keep the card clean):
  - Dropdown selecting the exercise variant used (the main exercise + its listed alternatives).
  - Three inputs: **Sets**, **Reps**, **Weight (kg)**.
  - "Save" button stores an entry keyed by `{weekStart, day, exerciseName}` in localStorage (`forge-workout-log`).
- Show the last-logged entry inline beneath the row (e.g., "Last: Incline Barbell Press · 4×8 @ 40 kg — Mon 20 Jul") so progression is visible.
- A "History" toggle at the top of each day card reveals all past entries for that day's exercises.
- No changes to the exercise data itself.

## 3. Progress Charts (Tracker tab)

Add charts to `HabitTracker.tsx` using the already-installed `recharts` (via shadcn `chart` component if present, otherwise plain `recharts`).

- Below the "Latest weight / Latest waist" cards and above the weekly log table, add two line charts side-by-side (stack on mobile):
  - **Weight over time** (kg) — X: week, Y: weight, primary color line.
  - **Waist over time** (cm) — X: week, Y: waist, accent color line.
- Both include a subtle horizontal target line for weight (72 kg) on the weight chart.
- Empty state when fewer than 2 data points: "Log at least 2 weeks to see the trend."
- Data source: existing `forge-measures` localStorage; no schema change.

## Technical details

- New file: `src/components/dashboard/GroceryList.tsx`, rendered inside `MealPlan.tsx`.
- Edits: `WorkoutPlan.tsx` (add logging UI + localStorage helpers), `HabitTracker.tsx` (add recharts line charts).
- Verify `recharts` is in `package.json`; if missing, install it before adding the charts.
- All persistence via localStorage — no Cloud/DB, matches existing pattern.
- No route or navigation changes.
