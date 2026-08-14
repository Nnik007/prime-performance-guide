import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  weight_kg: z.coerce.number().positive().max(400).optional(),
  waist_cm: z.coerce.number().positive().max(300).optional(),
  steps: z.coerce.number().int().min(0).max(200000).optional(),
  active_energy_kcal: z.coerce.number().int().min(0).max(20000).optional(),
  exercise_minutes: z.coerce.number().int().min(0).max(1440).optional(),
  sleep_hours: z.coerce.number().min(0).max(24).optional(),
  resting_hr: z.coerce.number().int().min(20).max(220).optional(),
  hrv_ms: z.coerce.number().min(0).max(500).optional(),
  vo2max: z.coerce.number().min(0).max(100).optional(),
  workout_minutes: z.coerce.number().int().min(0).max(1440).optional(),
  distance_km: z.coerce.number().min(0).max(500).optional(),
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
        const { error } = await supabaseAdmin.from("health_days").upsert(row, { onConflict: "day" });
        if (error) {
          return new Response(JSON.stringify({ error: "Save failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ ok: true, day: row.day }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});