import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getOperatingSnapshot, saveHours } from "@/lib/server/api-orders";
import { hmToMinutes, minutesToHm } from "@/lib/hours";

export const Route = createFileRoute("/hours")({ component: HoursPage });

const DAYS = ["hours.day0", "hours.day1", "hours.day2", "hours.day3", "hours.day4", "hours.day5", "hours.day6"] as const;

function HoursPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["hours", vendor.restaurantId],
    queryFn: () => getOperatingSnapshot({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });
  const [emergency, setEmergency] = useState(false);
  const [vacation, setVacation] = useState(false);
  const [prep, setPrep] = useState("20");
  const [peak, setPeak] = useState("30");
  const [shifts, setShifts] = useState<{ weekday: number; open: string; close: string }[]>([]);

  useEffect(() => {
    if (!q.data) return;
    setEmergency(Boolean(q.data.restaurant?.emergency_closed));
    setVacation(Boolean(q.data.restaurant?.vacation_mode));
    setPrep(String(q.data.restaurant?.prep_minutes ?? 20));
    setPeak(String(q.data.restaurant?.peak_prep_minutes ?? 30));
    setShifts(
      q.data.hours.map((h) => ({
        weekday: h.weekday,
        open: minutesToHm(h.open_minutes),
        close: minutesToHm(h.close_minutes),
      })),
    );
  }, [q.data]);

  return (
    <VendorShell title={t("nav.hours")} dataLabel={q.data?.dataLabel ?? vendor.dataLabel}>
      <Card className="flex flex-wrap gap-3">
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
          {t("hours.emergency")}
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={vacation} onChange={(e) => setVacation(e.target.checked)} />
          {t("hours.vacation")}
        </label>
      </Card>
      <Card className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>{t("menu.prep")}</Label>
          <Input value={prep} onChange={(e) => setPrep(e.target.value)} />
        </div>
        <div>
          <Label>{t("hours.peak")}</Label>
          <Input value={peak} onChange={(e) => setPeak(e.target.value)} />
        </div>
      </Card>
      <Card className="space-y-3">
        {DAYS.map((d, i) => {
          const dayShifts = shifts.filter((s) => s.weekday === i);
          return (
            <div key={d} className="grid gap-2 border-b border-line pb-3 md:grid-cols-[80px_1fr]">
              <div className="font-medium">{t(d)}</div>
              <div className="space-y-2">
                {dayShifts.length === 0 ? <div className="text-sm text-muted">{t("hours.closed")}</div> : null}
                {dayShifts.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="time"
                      value={s.open}
                      onChange={(e) => {
                        const next = shifts.map((x) => (x === s ? { ...x, open: e.target.value } : x));
                        setShifts(next);
                      }}
                    />
                    <Input
                      type="time"
                      value={s.close}
                      onChange={(e) => {
                        const next = shifts.map((x) => (x === s ? { ...x, close: e.target.value } : x));
                        setShifts(next);
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setShifts([...shifts, { weekday: i, open: "11:00", close: "15:00" }])}
                >
                  {t("hours.split")}
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
      <Button
        onClick={() =>
          void saveHours({
            data: {
              restaurantId: vendor.restaurantId,
              emergencyClosed: emergency,
              vacationMode: vacation,
              prepMinutes: Number(prep) || 20,
              peakPrepMinutes: Number(peak) || 30,
              shifts: shifts.map((s) => ({
                weekday: s.weekday,
                openMinutes: hmToMinutes(s.open),
                closeMinutes: hmToMinutes(s.close),
              })),
            },
          }).then(() => qc.invalidateQueries({ queryKey: ["hours"] }))
        }
      >
        {t("hours.save")}
      </Button>
    </VendorShell>
  );
}
