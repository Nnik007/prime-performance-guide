# Finish the Apple Health redesign

The Health tab, sync endpoint and new visual theme are in place. What's still unfinished from the redesign: the other tabs still look and behave like the old dashboard, and none of them use the synced Health data yet. Plus there's a hydration warning on load from the sync URL being built from `window.location`.

## 1. Tracker becomes health-driven

- Weight and waist stop being manual-only: weekly averages are computed from the synced Health days, with manual entry kept as a fallback for waist (Apple Health rarely has it).
- Weight/waist charts read the same synced series, so the trend fills in automatically each day.
- Keep the habit checklist as-is, restyled to the new bento/card look.

## 2. Today panel gets live body data

- Add a top row of live metrics (weight, steps, sleep, resting HR) pulled from the latest synced day, next to today's training, meal and recovery actions.
- Show a subtle "synced <date>" line, or a prompt to set up the Shortcut when no data exists.

## 3. Visual pass on Training, Running, Meals, Tracker, Mindset

- Apply the Ink + Electric Blue tokens, Space Grotesk headings and rounded bento cards consistently: same card radius, uppercase micro-labels, tighter spacing as the Health tab.
- No changes to plan content, logging logic or progression rules.

## 4. Fix the load-time hydration warning

- Build the sync endpoint URL after mount instead of during render so the server and browser render the same text.

## Technical details

- `HabitTracker.tsx` and `TodaySummary.tsx` read `getHealthDays()` through the existing React Query keys; no new tables or endpoints.
- Weekly average = mean of non-null values per ISO week from `health_days`; manual `forge-measures` entries stay as a fallback and are merged when the synced value is missing.
- `HealthHub.tsx`: move `endpoint` into state set in `useEffect` (fixes the hydration mismatch).
- Styling only for the remaining tabs — no changes to workout/meal/run data structures.
