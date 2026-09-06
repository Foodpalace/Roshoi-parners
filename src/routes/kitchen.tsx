import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { OrderCard, type OrderView } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { useClientState } from "@/lib/client-state";
import { listOrders } from "@/lib/server/api-orders";
import { isFeatureEnabled } from "@/lib/platform-config";
import { Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/kitchen")({ component: KitchenPage });

const COLS = [
  { state: "PLACED", key: "kitchen.new" },
  { state: "ACCEPTED", key: "kitchen.accepted" },
  { state: "PREPARING", key: "kitchen.preparing" },
  { state: "READY", key: "kitchen.ready" },
  { state: "RIDER_ASSIGNED", key: "kitchen.pickup" },
] as const;

function playPing() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.18);
  } catch {
    /* ignore */
  }
}

function KitchenPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const soundOn = useClientState((s) => s.soundOn);
  const setSoundOn = useClientState((s) => s.setSoundOn);
  const q = useQuery({
    queryKey: ["orders", vendor.restaurantId, "live"],
    queryFn: () => listOrders({ data: { restaurantId: vendor.restaurantId, scope: "live" } }),
    enabled: Boolean(vendor.restaurantId),
    refetchInterval: 3000,
  });
  const pending = q.data?.orders.filter((o) => o.state === "PLACED").length ?? 0;
  const prev = useRef(pending);
  useEffect(() => {
    if (isFeatureEnabled("new_order_sound") && soundOn && pending > prev.current) playPing();
    prev.current = pending;
  }, [pending, soundOn]);

  return (
    <VendorShell
      title={t("kitchen.title")}
      dataLabel={q.data?.dataLabel ?? vendor.dataLabel}
      stale={q.isError}
      restaurantName={vendor.selected?.restaurantName}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{q.data ? `Updated ${new Date(q.data.serverTime).toLocaleTimeString()}` : t("common.loading")}</p>
        <Button
          variant="secondary"
          size="icon"
          aria-label={soundOn ? t("kitchen.soundOn") : t("kitchen.soundOff")}
          onClick={() => setSoundOn(!soundOn)}
        >
          {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
        {COLS.map((col) => {
          const items = (q.data?.orders ?? []).filter((o) =>
            col.state === "RIDER_ASSIGNED"
              ? ["RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY"].includes(o.state)
              : o.state === col.state,
          );
          return (
            <section key={col.state} className="w-[min(86vw,22rem)] shrink-0 snap-start space-y-2 lg:w-auto lg:min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide">{t(col.key)}</h2>
                <span className="tabular text-sm text-muted">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <Card className="text-sm text-muted">{t("kitchen.empty")}</Card>
              ) : (
                items.map((o) => (
                  <OrderCard
                    key={o.id}
                    large
                    order={o as unknown as OrderView}
                    restaurantId={vendor.restaurantId}
                    dataLabel={q.data?.dataLabel}
                    onChanged={() => void qc.invalidateQueries({ queryKey: ["orders"] })}
                  />
                ))
              )}
            </section>
          );
        })}
      </div>
    </VendorShell>
  );
}
