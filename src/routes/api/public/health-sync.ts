import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Shortcuts often sends numbers as localised text ("1,089", "1 089 steps",
 * "76.5 kg") or as an empty string when a sample is missing. Normalise that
 * into a number, or `undefined` when there is genuinely no value.
 */
const num = (min: number, max: number, int = false) =>
  z
    .preprocess((input) => {
      let v: unknown = Array.isArray(input) ? input[0] : input;
      if (v === null || v === undefined) return undefined;
      if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
      if (typeof v !== "string") return undefined;
      const cleaned = v.replace(/[^0-9.,-]/g, "").replace(/,(?=\d{3}(\D|$))/g, "").replace(/,/g, ".");
      if (!/\d/.test(cleaned)) return undefined;
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : undefined;
    }, z.number().min(min).max(max).optional())
    .transform((n) => (n === undefined ? undefined : int ? Math.round(n) : n));

const payloadSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  weight_kg: num(1, 400),
  waist_cm: num(1, 300),
  steps: num(0, 200000, true),
  active_energy_kcal: num(0, 20000, true),
  exercise_minutes: num(0, 1440, true),
  sleep_hours: num(0, 24),
  resting_hr: num(20, 220, true),
  hrv_ms: num(0, 500),
  vo2max: num(0, 100),
  workout_minutes: num(0, 1440, true),
  distance_km: num(0, 500),
});

export const Route = createFileRoute("/api/public/health-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = (process.env["HEALTH_SYNC_TOKEN"] ?? "").trim();
        const url = new URL(request.url);
        const candidates = [
          request.headers.get("x-health-token"),
          request.headers.get("X-Health-Token"),
          request.headers.get("x-health-sync-token"),
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, ""),
          url.searchParams.get("token"),
        ]
          .map((v) => (v ?? "").trim().replace(/^["']|["']$/g, ""))
          .filter((v) => v.length > 0);

        const matched = expected.length > 0 && candidates.some((v) => v === expected);
        if (!matched) {
          return new Response(
            JSON.stringify({
              error: "Unauthorized",
              reason: expected.length === 0 ? "server_token_not_configured" : candidates.length === 0 ? "no_token_provided" : "token_mismatch",
            }),
            {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
          );
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Invalid payload", issues: parsed.error.issues.map((i) => i.path.join(".")) }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const { day, ...metrics } = parsed.data;
        const row = {
          day: day ?? new Date().toISOString().slice(0, 10),
          ...Object.fromEntries(Object.entries(metrics).filter(([, v]) => v !== undefined && !Number.isNaN(v))),
          source: "apple_health",
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: saved, error } = await supabaseAdmin
          .from("health_days")
          .upsert(row, { onConflict: "day" })
          .select()
          .single();
        if (error) {
          return new Response(JSON.stringify({ error: "Save failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Echo the stored row so the Shortcut result shows exactly what was saved.
        return new Response(JSON.stringify({ ok: true, day: row.day, saved }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});