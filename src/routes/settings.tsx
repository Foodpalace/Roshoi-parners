import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { useClientState } from "@/lib/client-state";
import { addStaff, listStaff } from "@/lib/server/api-more";
import { can } from "@/lib/rbac";
import { platformConfig } from "@/lib/platform-config";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const lang = useClientState((s) => s.lang);
  const setLang = useClientState((s) => s.setLang);
  const staffQ = useQuery({
    queryKey: ["staff", vendor.restaurantId],
    queryFn: () => listStaff({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId) && Boolean(vendor.role && can(vendor.role, "settings.staff")),
  });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <VendorShell title={t("nav.settings")} dataLabel={vendor.dataLabel} restaurantName={vendor.selected?.restaurantName}>
      <Card className="space-y-3">
        <h2 className="font-display text-lg">{t("settings.language")}</h2>
        <div className="flex gap-2">
          <Button variant={lang === "en" ? "primary" : "secondary"} onClick={() => setLang("en")}>
            {t("settings.english")}
          </Button>
          <Button variant={lang === "bn" ? "primary" : "secondary"} onClick={() => setLang("bn")}>
            {t("settings.bengali")}
          </Button>
        </div>
      </Card>
      <Card className="space-y-2">
        <h2 className="font-display text-lg">{t("settings.commission")}</h2>
        {vendor.role && can(vendor.role, "settings.financial") ? (
          <p className="tabular text-2xl">{(vendor.selected?.commissionBps ?? 1000) / 100}%</p>
        ) : (
          <p className="text-sm text-muted">{t("settings.financialLocked")}</p>
        )}
        <p className="text-xs text-muted">
          {t("settings.snapshotHint")} {platformConfig.commission.targetBps / 100}%.
        </p>
      </Card>
      {vendor.role && can(vendor.role, "settings.staff") ? (
        <Card className="space-y-3">
          <h2 className="font-display text-lg">{t("settings.staff")}</h2>
          <ul className="text-sm">
            {staffQ.data?.staff.map((s) => (
              <li key={s.id} className="flex justify-between border-b border-line py-2">
                <span>{s.email ?? s.user_id}</span>
                <span className="text-muted">{s.role}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 md:grid-cols-[1fr_140px_auto]">
            <div>
              <Label>{t("auth.email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>{t("settings.role")}</Label>
              <select
                className="h-11 w-full rounded-[12px] border border-line bg-surface px-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>STAFF</option>
                <option>MANAGER</option>
                <option>ACCOUNTANT</option>
                <option>MULTI_OUTLET_MANAGER</option>
              </select>
            </div>
            <Button
              className="self-end"
              onClick={() =>
                void addStaff({
                  data: {
                    restaurantId: vendor.restaurantId,
                    email,
                    role: role as "STAFF",
                  },
                })
                  .then(() => {
                    setMsg("Saved");
                    setEmail("");
                    void qc.invalidateQueries({ queryKey: ["staff"] });
                  })
                  .catch((e) => setMsg(e instanceof Error ? e.message : "Failed"))
              }
            >
              {t("settings.add")}
            </Button>
          </div>
          {msg ? <p className="text-sm text-muted">{msg}</p> : null}
        </Card>
      ) : null}
      <Card className="text-sm text-muted">
        {t("settings.adapters")}: AI {vendor.adapters?.ai.provider}, SMS{" "}
        {vendor.adapters?.notifications.find((n) => n.channel === "sms")?.provider}, storage{" "}
        {vendor.adapters?.storage.provider}, dispatch {vendor.adapters?.dispatch.provider}.
      </Card>
    </VendorShell>
  );
}
