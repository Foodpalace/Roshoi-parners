import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoneyText } from "@/components/money-text";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getDashboard } from "@/lib/server/api-orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const t = useT();
  const vendor = useVendor();
  const dash = useQuery({
    queryKey: ["dashboard", vendor.restaurantId],
    queryFn: () => getDashboard({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
    refetchInterval: 8000,
  });

  if (!vendor.isPending && vendor.memberships.length === 0) {
    return (
      <VendorShell title={t("dashboard.greeting")}>
        <Card className="space-y-3">
          <p>{t("onboarding.title")}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/onboarding">{t("onboarding.realCta")}</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/onboarding">{t("onboarding.demoCta")}</Link>
            </Button>
          </div>
        </Card>
      </VendorShell>
    );
  }

  const d = dash.data;
  const stale = dash.isError;

  return (
    <VendorShell
      title={d?.restaurantName ?? t("nav.home")}
      dataLabel={d?.dataLabel ?? vendor.dataLabel}
      stale={stale}
      restaurantName={d?.restaurantName}
    >
      <p className="text-sm text-muted">
        {t("dashboard.today")}
        {" · "}
        {d?.isOpen ? t("dashboard.open") : t("dashboard.closed")}
      </p>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={t("dashboard.orders")} value={d?.today.orders ?? "—"} />
        <Stat label={t("dashboard.sales")} value={d ? <MoneyText paise={d.today.salesPaise} /> : "—"} />
        <Stat label={t("dashboard.aov")} value={d ? <MoneyText paise={d.today.aovPaise} /> : "—"} />
        <Stat label={t("dashboard.pending")} value={d?.today.pending ?? "—"} warn={Boolean(d && d.today.pending > 0)} />
        <Stat label={t("dashboard.accepted")} value={d?.today.accepted ?? "—"} />
        <Stat label={t("dashboard.cancelled")} value={d?.today.cancelled ?? "—"} />
        <Stat label={t("dashboard.refunds")} value={d ? <MoneyText paise={d.today.refundsPaise} /> : "—"} />
        <Stat label={t("dashboard.settlement")} value={d ? <MoneyText paise={d.today.settlementPaise} /> : "—"} />
        <Stat
          label={t("dashboard.rating")}
          value={d?.today.rating != null ? `${d.today.rating} (${d.today.ratingCount})` : "—"}
        />
        <Stat label={t("dashboard.unavailable")} value={d?.today.unavailableItems ?? "—"} />
        <Stat
          label={t("dashboard.repeat")}
          value={d?.today.repeatPct != null ? `${d.today.repeatPct}%` : "—"}
        />
      </section>

      {d && d.today.pending > 0 ? (
        <Button asChild size="lg" className="w-full md:w-auto">
          <Link to="/orders">{t("dashboard.seeOrders")}</Link>
        </Button>
      ) : null}

      <Card>
        <h2 className="font-display text-xl">{t("dashboard.attention")}</h2>
        <ul className="mt-3 space-y-2">
          {(d?.attention.length ?? 0) === 0 ? (
            <li className="text-sm text-muted">{t("dashboard.noAttention")}</li>
          ) : (
            d?.attention.map((a) => (
              <li
                key={a.id}
                className={cn(
                  "rounded-[12px] border-l-4 px-3 py-2 text-sm",
                  a.tone === "danger" && "border-danger bg-danger-soft text-danger",
                  a.tone === "warn" && "border-warn bg-warn-soft text-warn",
                  a.tone === "info" && "border-info bg-info-soft text-info",
                )}
              >
                {t(a.key, { n: a.n ?? 0, status: a.status ?? "" })}
              </li>
            ))
          )}
        </ul>
      </Card>
    </VendorShell>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: ReactNode;
  warn?: boolean;
}) {
  return (
    <Card className={cn("min-h-[5.5rem] p-3", warn && "border-danger")}>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-display text-2xl leading-tight tabular">{value}</div>
    </Card>
  );
}
