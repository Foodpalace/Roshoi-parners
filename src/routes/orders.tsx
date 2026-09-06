import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { OrderCard, type OrderView } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { listOrders } from "@/lib/server/api-orders";
import { useState } from "react";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const [scope, setScope] = useState<"live" | "history">("live");
  const q = useQuery({
    queryKey: ["orders", vendor.restaurantId, scope],
    queryFn: () => listOrders({ data: { restaurantId: vendor.restaurantId, scope } }),
    enabled: Boolean(vendor.restaurantId),
    refetchInterval: scope === "live" ? 4000 : false,
  });

  if (!vendor.restaurantId && !vendor.isPending) {
    return (
      <VendorShell title={t("nav.orders")}>
        <Card className="space-y-3">
          <p>{t("onboarding.title")}</p>
          <Button asChild>
            <Link to="/onboarding">{t("common.next")}</Link>
          </Button>
        </Card>
      </VendorShell>
    );
  }

  return (
    <VendorShell
      title={t("nav.orders")}
      dataLabel={q.data?.dataLabel ?? vendor.dataLabel}
      stale={q.isError}
      restaurantName={vendor.selected?.restaurantName}
    >
      <div className="flex gap-2">
        <Button variant={scope === "live" ? "primary" : "secondary"} onClick={() => setScope("live")}>
          {t("orders.live")}
        </Button>
        <Button variant={scope === "history" ? "primary" : "secondary"} onClick={() => setScope("history")}>
          {t("orders.history")}
        </Button>
      </div>
      <div className="grid gap-3">
        {(q.data?.orders.length ?? 0) === 0 ? (
          <Card className="text-sm text-muted">{t("orders.empty")}</Card>
        ) : (
          q.data?.orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o as unknown as OrderView}
              restaurantId={vendor.restaurantId}
              dataLabel={q.data?.dataLabel}
              onChanged={() => {
                void qc.invalidateQueries({ queryKey: ["orders"] });
                void qc.invalidateQueries({ queryKey: ["dashboard"] });
              }}
            />
          ))
        )}
      </div>
    </VendorShell>
  );
}
