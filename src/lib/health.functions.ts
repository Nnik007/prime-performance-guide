import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type HealthDay = Database["public"]["Tables"]["health_days"]["Row"];

export const getHealthDays = createServerFn({ method: "GET" }).handler(async (): Promise<HealthDay[]> => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  const supabasePublic = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const since = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { data, error } = await supabasePublic
    .from("health_days")
    .select("*")
    .gte("day", since)
    .order("day", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
});

/**
 * Returns the Shortcut sync endpoint + token so the owner can configure the
 * iOS Shortcut. This is a single-user personal dashboard; the token only
 * allows writing daily health metrics.
 */
export const getSyncSetup = createServerFn({ method: "GET" }).handler(async () => {
  return { token: process.env["HEALTH_SYNC_TOKEN"] ?? "" };
});