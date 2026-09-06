import { createFileRoute, Link } from "@tanstack/react-router";
import { VendorShell, MORE_NAV } from "@/components/vendor-shell";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { can } from "@/lib/rbac";
import { UserButton } from "@/lib/auth/gates";

export const Route = createFileRoute("/more")({ component: MorePage });

function MorePage() {
  const t = useT();
  const vendor = useVendor();
  const role = vendor.role;
  const items = MORE_NAV.filter((item) => !role || can(role, item.perm));

  return (
    <VendorShell title={t("nav.more")} dataLabel={vendor.dataLabel} restaurantName={vendor.selected?.restaurantName}>
      <div className="grid gap-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-h-14 items-center gap-3 rounded-[16px] border border-line bg-surface px-4"
          >
            <item.icon className="size-5 text-chili" />
            <span className="font-medium">{t(item.key)}</span>
          </Link>
        ))}
      </div>
      <div className="md:hidden">
        <UserButton />
      </div>
    </VendorShell>
  );
}
