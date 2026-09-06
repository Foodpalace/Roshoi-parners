import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoneyText } from "@/components/money-text";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getAnalytics } from "@/lib/server/api-finance";
import { can } from "@/lib/rbac";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const t = useT();
  const vendor = useVendor();
  const [range, setRange] = useState<"day" | "week" | "month">("week");
  const allowed = vendor.role ? can(vendor.role, "analytics.view") : false;
  const q = useQuery({
    queryKey: ["analytics", vendor.restaurantId, range],
    queryFn: () => getAnalytics({ data: { restaurantId: vendor.restaurantId, range } }),
    enabled: Boolean(vendor.restaurantId) && allowed,
  });

  if (vendor.role && !allowed) {
    return (
      <VendorShell title={t("nav.analytics")}>
        <Card>{t("settings.financialLocked")}</Card>
      </VendorShell>
    );
  }

  const s = q.data?.summary;

  return (
    <VendorShell title={t("nav.analytics")} dataLabel={q.data?.dataLabel ?? vendor.dataLabel}>
      <div className="rounded-[12px] bg-info-soft px-3 py-2 text-xs font-semibold tracking-wide text-info">
        {q.data?.dataKind ?? t("analytics.simulated")}
      </div>
      <div className="flex gap-2">
        {(["day", "week", "month"] as const).map((r) => (
          <Button key={r} variant={range === r ? "primary" : "secondary"} onClick={() => setRange(r)}>
            {t(r === "day" ? "common.today" : r === "week" ? "common.week" : "common.month")}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3">
          <div className="text-xs text-muted">{t("analytics.orders")}</div>
          <div className="font-display text-2xl tabular">{s?.orders ?? "—"}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted">{t("dashboard.sales")}</div>
          <div className="font-display text-2xl">{s ? <MoneyText paise={s.salesPaise} /> : "—"}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted">{t("dashboard.aov")}</div>
          <div className="font-display text-2xl">{s ? <MoneyText paise={s.aovPaise} /> : "—"}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted">{t("analytics.avgPrep")}</div>
          <div className="font-display text-2xl tabular">{q.data?.avgPrepMinutes ?? "—"}</div>
        </Card>
      </div>
      <Card className="h-64">
        <h2 className="mb-2 font-display text-lg">{t("analytics.peak")}</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={q.data?.hours ?? []}>
            <XAxis dataKey="hour" stroke="var(--color-muted)" />
            <YAxis allowDecimals={false} stroke="var(--color-muted)" />
            <Tooltip />
            <Bar dataKey="orders" fill="var(--color-chili)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg">{t("analytics.best")}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {(q.data?.items ?? []).slice(0, 5).map((i) => (
              <li key={i.name} className="flex justify-between">
                <span>{i.name}</span>
                <span className="tabular text-muted">{i.qty}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-lg">{t("analytics.low")}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {(q.data?.items ?? [])
              .slice()
              .reverse()
              .slice(0, 5)
              .map((i) => (
                <li key={i.name} className="flex justify-between">
                  <span>{i.name}</span>
                  <span className="tabular text-muted">{i.qty}</span>
                </li>
              ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h2 className="font-display text-lg">{t("analytics.promos")}</h2>
        <p className="mt-2 text-sm">
          {t("promotions.restaurantFunded")}:{" "}
          {q.data ? <MoneyText paise={q.data.promotions.restaurantFundedPaise} /> : "—"}
        </p>
        <p className="text-sm">
          {t("promotions.platformFunded")}:{" "}
          {q.data ? <MoneyText paise={q.data.promotions.platformFundedPaise} /> : "—"}
        </p>
      </Card>
    </VendorShell>
  );
}
