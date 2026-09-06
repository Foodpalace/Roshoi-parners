import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getNotifications, markNotificationsRead } from "@/lib/server/api-more";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["ntf", vendor.restaurantId],
    queryFn: () => getNotifications({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });

  return (
    <VendorShell title={t("nav.notifications")} dataLabel={vendor.dataLabel}>
      <div className="flex flex-wrap gap-2 text-xs">
        {q.data?.channels.map((c) => (
          <span
            key={c.channel}
            className={c.connected ? "rounded-full bg-leaf-soft px-2 py-1 text-leaf" : "rounded-full bg-warn-soft px-2 py-1 text-warn"}
          >
            {c.channel}: {c.connected ? "in-app" : t("app.notConnected")}
          </span>
        ))}
      </div>
      <Button
        variant="secondary"
        onClick={() =>
          void markNotificationsRead({ data: { restaurantId: vendor.restaurantId } }).then(() =>
            qc.invalidateQueries({ queryKey: ["ntf"] }),
          )
        }
      >
        {t("notifications.markRead")}
      </Button>
      {(q.data?.notifications.length ?? 0) === 0 ? (
        <Card className="text-sm text-muted">{t("notifications.empty")}</Card>
      ) : (
        q.data?.notifications.map((n) => (
          <Card key={n.id} className={n.isRead ? "opacity-70" : ""}>
            <div className="text-xs uppercase text-muted">{n.type}</div>
            <div className="font-medium">{n.title}</div>
            <p className="text-sm text-muted">{n.body}</p>
          </Card>
        ))
      )}
    </VendorShell>
  );
}
