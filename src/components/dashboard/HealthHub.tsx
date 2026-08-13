import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Footprints,
  HeartPulse,
  Moon,
  Flame,
  Scale,
  Timer,
  Smartphone,
  RefreshCw,
  Copy,
  Check,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getHealthDays, getSyncSetup, type HealthDay } from "@/lib/health.functions";

const fmt = (n: number | null | undefined, digits = 0, suffix = "") =>
  n === null || n === undefined ? "—" : `${Number(n).toFixed(digits)}${suffix}`;

function shortDay(day: string) {
  return new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function avg(rows: HealthDay[], key: keyof HealthDay) {
  const vals = rows.map((r) => r[key]).filter((v): v is number => typeof v === "number");
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function Tile({
  label,
  value,
  sub,
  Icon,
  tone = "primary",
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: typeof Activity;
  tone?: "primary" | "accent";
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card/70 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${tone === "primary" ? "text-primary" : "text-accent"}`} />
      </div>
      <div className="mt-2 font-display text-2xl font-bold leading-none">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function HealthHub() {
  const [copied, setCopied] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const { data: days = [], isLoading, refetch, isFetching, isError, error, dataUpdatedAt } = useQuery({
    queryKey: ["health-days"],
    queryFn: () => getHealthDays(),
    retry: 1,
  });

  const setup = useQuery({
    queryKey: ["health-sync-setup"],
    queryFn: () => getSyncSetup(),
    enabled: showToken,
  });

  const [endpoint, setEndpoint] = useState("/api/public/health-sync");
  useEffect(() => {
    setEndpoint(`${window.location.origin}/api/public/health-sync`);
  }, []);

  // Time-relative labels are computed after mount to keep SSR output stable.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const latest = days[days.length - 1];
  const last7 = days.slice(-7);
  const prev7 = days.slice(-14, -7);

  const weightSeries = useMemo(
    () => days.filter((d) => d.weight_kg !== null).map((d) => ({ day: shortDay(d.day), weight: Number(d.weight_kg) })),
    [days],
  );
  const stepSeries = useMemo(
    () => days.slice(-14).map((d) => ({ day: shortDay(d.day), steps: d.steps ?? 0 })),
    [days],
  );
  const recoverySeries = useMemo(
    () =>
      days
        .slice(-21)
        .map((d) => ({ day: shortDay(d.day), sleep: d.sleep_hours ?? null, rhr: d.resting_hr ?? null })),
    [days],
  );

  const wNow = avg(last7, "weight_kg");
  const wPrev = avg(prev7, "weight_kg");
  const wDelta = wNow !== null && wPrev !== null ? wNow - wPrev : null;

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const body = `{"weight_kg": WEIGHT, "steps": STEPS, "sleep_hours": SLEEP, "resting_hr": RHR, "active_energy_kcal": ENERGY, "exercise_minutes": EXERCISE, "workout_minutes": WORKOUT, "distance_km": DISTANCE, "hrv_ms": HRV}`;

  const lastSyncedAt = useMemo(() => {
    const stamps = days.map((d) => new Date(d.updated_at).getTime()).filter((t) => !Number.isNaN(t));
    return stamps.length ? Math.max(...stamps) : null;
  }, [days]);

  const hoursSince = lastSyncedAt !== null && mounted ? (Date.now() - lastSyncedAt) / 3_600_000 : null;
  const status: "error" | "loading" | "none" | "stale" | "ok" = isError
    ? "error"
    : isLoading
      ? "loading"
      : lastSyncedAt === null
        ? "none"
        : hoursSince !== null && hoursSince > 36
          ? "stale"
          : "ok";

  const relative = (ms: number) => {
    const h = (Date.now() - ms) / 3_600_000;
    if (h < 1) return `${Math.max(1, Math.round(h * 60))} min ago`;
    if (h < 24) return `${Math.round(h)} h ago`;
    return `${Math.round(h / 24)} d ago`;
  };

  const statusMeta = {
    error: {
      Icon: AlertTriangle,
      tone: "text-destructive",
      ring: "border-destructive/40 bg-destructive/10",
      label: "Sync failed",
      detail: (error as Error | null)?.message ?? "Could not reach your health data.",
    },
    loading: {
      Icon: RefreshCw,
      tone: "text-muted-foreground",
      ring: "border-border/60 bg-card/70",
      label: "Checking…",
      detail: "Reading your latest Apple Health data.",
    },
    none: {
      Icon: Smartphone,
      tone: "text-accent",
      ring: "border-accent/40 bg-accent/10",
      label: "Not connected",
      detail: "No data received yet — set up the iOS Shortcut below.",
    },
    stale: {
      Icon: Clock,
      tone: "text-accent",
      ring: "border-accent/40 bg-accent/10",
      label: "Out of date",
      detail:
        lastSyncedAt !== null
          ? `Last successful sync ${relative(lastSyncedAt)}. Run the Shortcut on your iPhone.`
          : "",
    },
    ok: {
      Icon: CheckCircle2,
      tone: "text-primary",
      ring: "border-primary/40 bg-primary/10",
      label: "Up to date",
      detail: lastSyncedAt !== null ? `Last successful sync ${relative(lastSyncedAt)}.` : "",
    },
  }[status];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/15 p-2.5">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold">Health</h2>
          <p className="text-sm text-muted-foreground">
            {latest ? `Last sync: ${shortDay(latest.day)}` : "No Apple Health data yet"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Sync status */}
      <div className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3.5 ${statusMeta.ring}`}>
        <statusMeta.Icon
          className={`h-5 w-5 shrink-0 ${statusMeta.tone} ${status === "loading" || isFetching ? "animate-spin" : ""}`}
        />
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-semibold ${statusMeta.tone}`}>Apple Health sync · {statusMeta.label}</div>
          <p className="text-xs text-muted-foreground">
            {statusMeta.detail}
            {mounted && lastSyncedAt !== null && status !== "loading" && (
              <>
                {" "}
                <span className="text-foreground">
                  {new Date(lastSyncedAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </>
            )}
          </p>
          {mounted && dataUpdatedAt > 0 && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">Dashboard checked {relative(dataUpdatedAt)}</p>
          )}
        </div>
        <Button size="sm" variant={status === "error" ? "destructive" : "outline"} onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          {status === "error" ? "Retry" : "Check now"}
        </Button>
      </div>

      {/* Bento metric grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Weight"
          value={fmt(latest?.weight_kg, 1, " kg")}
          sub={wDelta !== null ? `${wDelta > 0 ? "+" : ""}${wDelta.toFixed(1)} kg vs last week` : "7-day average pending"}
          Icon={Scale}
          className="col-span-2 lg:col-span-2"
        />
        <Tile label="Steps" value={fmt(latest?.steps, 0)} sub="today" Icon={Footprints} tone="accent" />
        <Tile label="Sleep" value={fmt(latest?.sleep_hours, 1, " h")} sub="last night" Icon={Moon} />
        <Tile label="Resting HR" value={fmt(latest?.resting_hr, 0, " bpm")} Icon={HeartPulse} tone="accent" />
        <Tile label="Active energy" value={fmt(latest?.active_energy_kcal, 0, " kcal")} Icon={Flame} />
        <Tile label="Exercise" value={fmt(latest?.exercise_minutes, 0, " min")} Icon={Timer} tone="accent" />
        <Tile label="HRV / VO₂max" value={`${fmt(latest?.hrv_ms, 0)} / ${fmt(latest?.vo2max, 1)}`} Icon={Gauge} />
      </div>

      {/* Charts */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Weight trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-52">
            {weightSeries.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="weight" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-14 text-center text-sm text-muted-foreground">
                {isLoading ? "Loading…" : "Sync a few days of weight to see the trend."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Daily steps · last 14 days
            </CardTitle>
          </CardHeader>
          <CardContent className="h-52">
            {stepSeries.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="steps" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-14 text-center text-sm text-muted-foreground">No step data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recovery · sleep vs resting HR
            </CardTitle>
          </CardHeader>
          <CardContent className="h-52">
            {recoverySeries.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recoverySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="l" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Line yAxisId="l" type="monotone" dataKey="sleep" stroke="var(--chart-1)" dot={false} connectNulls />
                  <Line yAxisId="r" type="monotone" dataKey="rhr" stroke="var(--chart-5)" dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-14 text-center text-sm text-muted-foreground">No recovery data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Setup */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="h-4 w-4 text-primary" /> Connect Apple Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Apple Health can't be read directly by a website, so your iPhone pushes the data here with a
            Shortcut — takes about 5 minutes once, then it runs automatically every day.
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Open the <span className="text-foreground">Shortcuts</span> app → new shortcut.</li>
            <li>
              Add <span className="text-foreground">Find Health Samples</span> actions for weight, steps, sleep,
              resting heart rate, active energy, exercise minutes and walking/running distance (today, latest value).
            </li>
            <li>
              Add <span className="text-foreground">Get Contents of URL</span>: method{" "}
              <Badge variant="secondary">POST</Badge>, headers{" "}
              <code className="text-foreground">Content-Type: application/json</code> and{" "}
              <code className="text-foreground">x-health-token: &lt;your token&gt;</code>, JSON body as below.
            </li>
            <li>
              In <span className="text-foreground">Automation</span>, run it daily at 23:30 — done.
            </li>
          </ol>

          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-2">
              <code className="flex-1 truncate text-xs text-foreground">{endpoint}</code>
              <Button size="sm" variant="ghost" onClick={() => copy(endpoint, "url")}>
                {copied === "url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/60 p-2">
              <pre className="overflow-x-auto text-[11px] text-foreground">{body}</pre>
              <Button size="sm" variant="ghost" className="mt-1" onClick={() => copy(body, "body")}>
                {copied === "body" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                Copy JSON body
              </Button>
            </div>

            {showToken ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-2">
                <code className="flex-1 truncate text-xs text-foreground">
                  {setup.isLoading ? "Loading…" : setup.data?.token || "unavailable"}
                </code>
                <Button size="sm" variant="ghost" onClick={() => copy(setup.data?.token ?? "", "token")}>
                  {copied === "token" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setShowToken(true)}>
                Show sync token
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}