import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { MoneyText } from "@/components/money-text";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getPromotions, savePromotion } from "@/lib/server/api-finance";
import { rupeesToPaise } from "@/lib/money";
import { can } from "@/lib/rbac";

export const Route = createFileRoute("/promotions")({ component: PromotionsPage });

function PromotionsPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["promos", vendor.restaurantId],
    queryFn: () => getPromotions({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });
  const canEdit = vendor.role ? can(vendor.role, "promotions.edit") : false;
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("10");

  const rest = q.data?.promotions.filter((p) => p.funder === "RESTAURANT") ?? [];
  const plat = q.data?.promotions.filter((p) => p.funder === "PLATFORM") ?? [];

  return (
    <VendorShell title={t("nav.promotions")} dataLabel={q.data?.dataLabel ?? vendor.dataLabel}>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-2">
          <h2 className="font-display text-xl">{t("promotions.restaurantFunded")}</h2>
          {rest.map((p) => (
            <Card key={p.id} className="space-y-2">
              <div className="font-medium">{p.name}</div>
              <p className="text-sm text-muted">{p.estimate.narrative}</p>
              {canEdit ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    void savePromotion({
                      data: {
                        restaurantId: vendor.restaurantId,
                        id: p.id,
                        name: p.name,
                        funder: "RESTAURANT",
                        kind: p.kind as "percent",
                        percentOff: p.percent_off ?? undefined,
                        isActive: !p.isActive,
                      },
                    }).then(() => qc.invalidateQueries({ queryKey: ["promos"] }))
                  }
                >
                  {p.isActive ? t("promotions.pause") : t("promotions.activate")}
                </Button>
              ) : null}
            </Card>
          ))}
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl">{t("promotions.platformFunded")}</h2>
          {plat.map((p) => (
            <Card key={p.id} className="space-y-2">
              <div className="font-medium">{p.name}</div>
              <p className="text-sm text-muted">{p.estimate.narrative}</p>
              <MoneyText paise={p.estimate.estimatedDailyCostPaise} />
            </Card>
          ))}
        </section>
      </div>
      {canEdit ? (
        <Card className="space-y-3">
          <h3 className="font-display text-lg">{t("promotions.create")}</h3>
          <div>
            <Label>{t("menu.name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>{t("promotions.percent")}</Label>
            <Input value={percent} onChange={(e) => setPercent(e.target.value)} />
          </div>
          <Button
            onClick={() =>
              void savePromotion({
                data: {
                  restaurantId: vendor.restaurantId,
                  name,
                  funder: "RESTAURANT",
                  kind: "percent",
                  percentOff: Number(percent) || 0,
                  minOrderPaise: rupeesToPaise(150),
                  isActive: false,
                },
              }).then(() => {
                setName("");
                void qc.invalidateQueries({ queryKey: ["promos"] });
              })
            }
          >
            {t("promotions.create")}
          </Button>
        </Card>
      ) : null}
    </VendorShell>
  );
}
