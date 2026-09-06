import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChefHat,
  ClipboardList,
  Clock3,
  Home,
  Languages,
  LineChart,
  MoreHorizontal,
  Settings,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wallet,
  Star,
  Tag,
} from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useClientState } from "@/lib/client-state";
import { can, type Permission } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { DataBanner } from "./data-banner";
import { OfflineBanner } from "./offline-banner";
import { RoshoiMark } from "./mark";
import { useT } from "./use-t";
import { useVendor } from "./use-vendor";
import type { ReactNode } from "react";

export const PRIMARY_NAV = [
  { to: "/dashboard", key: "nav.home", icon: Home, perm: "dashboard.view" as Permission },
  { to: "/orders", key: "nav.orders", icon: ClipboardList, perm: "orders.view" as Permission },
  { to: "/kitchen", key: "nav.kitchen", icon: ChefHat, perm: "kitchen.view" as Permission },
  { to: "/menu", key: "nav.menu", icon: UtensilsCrossed, perm: "menu.view" as Permission },
] as const;

export const MORE_NAV = [
  { to: "/promotions", key: "nav.promotions", icon: Tag, perm: "promotions.view" as Permission },
  { to: "/settlements", key: "nav.settlements", icon: Wallet, perm: "settlements.view" as Permission },
  { to: "/analytics", key: "nav.analytics", icon: LineChart, perm: "analytics.view" as Permission },
  { to: "/reviews", key: "nav.reviews", icon: Star, perm: "reviews.view" as Permission },
  { to: "/hours", key: "nav.hours", icon: Clock3, perm: "hours.edit" as Permission },
  { to: "/assistant", key: "nav.assistant", icon: Sparkles, perm: "assistant.use" as Permission },
  { to: "/notifications", key: "nav.notifications", icon: Bell, perm: "notifications.view" as Permission },
  { to: "/onboarding", key: "nav.onboarding", icon: Store, perm: "onboarding.edit" as Permission },
  { to: "/settings", key: "nav.settings", icon: Settings, perm: "settings.view" as Permission },
] as const;

export function VendorShell({
  children,
  title,
  dataLabel,
  stale,
  restaurantName,
}: {
  children: ReactNode;
  title: string;
  dataLabel?: string | null;
  stale?: boolean;
  restaurantName?: string;
}) {
  const t = useT();
  const { user, isPending } = useCurrentUserState();
  const vendor = useVendor();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = useClientState((s) => s.lang);
  const setLang = useClientState((s) => s.setLang);
  const role = vendor.role;
  const primary = PRIMARY_NAV.filter((item) => !role || can(role, item.perm));
  const more = MORE_NAV.filter((item) => !role || can(role, item.perm));
  const mobilePrimary = (primary.length >= 4 ? primary : [...primary, ...more]).slice(0, 4);

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg p-6">
        <div className="mx-auto max-w-md space-y-3">
          <div className="font-display text-xl text-ink">{t("app.name")}</div>
          <div className="h-10 w-40 animate-pulse rounded-full bg-line" />
          <div className="h-32 animate-pulse rounded-[24px] bg-line" />
          <div className="h-32 animate-pulse rounded-[24px] bg-line" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line p-4 md:flex">
          <div className="mb-6 flex items-center gap-2">
            <RoshoiMark className="size-8 text-chili" />
            <div>
              <div className="font-display text-base leading-tight">{t("app.name")}</div>
              <div className="text-xs text-muted">{restaurantName ?? t("app.tagline")}</div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
            {primary.map((item) => (
              <NavLink key={item.to} to={item.to} active={pathname.startsWith(item.to)} icon={item.icon}>
                {t(item.key)}
              </NavLink>
            ))}
            <div className="my-3 h-px bg-line" />
            {more.map((item) => (
              <NavLink key={item.to} to={item.to} active={pathname.startsWith(item.to)} icon={item.icon}>
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <UserButton />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3 md:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 md:hidden">
                <RoshoiMark className="size-7 shrink-0 text-chili" />
                <span className="truncate font-display text-lg">{restaurantName ?? t("app.name")}</span>
              </div>
              <h1 className="hidden font-display text-2xl md:block">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-1 rounded-[12px] border border-line bg-surface px-3 text-sm"
                onClick={() => setLang(lang === "en" ? "bn" : "en")}
                aria-label={t("settings.language")}
              >
                <Languages className="size-4" />
                {lang === "en" ? "বাং" : "EN"}
              </button>
              {(!role || can(role, "notifications.view")) && (
                <Link
                  to="/notifications"
                  className="grid size-11 place-items-center rounded-[12px] border border-line bg-surface"
                  aria-label={t("nav.notifications")}
                >
                  <Bell className="size-4" />
                </Link>
              )}
              <div className="hidden md:block">
                <UserButton />
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-4 px-4 py-4 md:px-6">
            <h1 className="font-display text-2xl md:hidden">{title}</h1>
            <div className="space-y-3">
              <OfflineBanner stale={stale} />
              <DataBanner label={dataLabel} />
            </div>
            {children}
          </main>
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Mobile"
      >
        {mobilePrimary.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
              pathname.startsWith(item.to) ? "text-chili" : "text-muted",
            )}
          >
            <item.icon className="size-5" />
            {t(item.key)}
          </Link>
        ))}
        <Link
          to="/more"
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
            pathname === "/more" || more.some((m) => pathname.startsWith(m.to)) ? "text-chili" : "text-muted",
          )}
        >
          <MoreHorizontal className="size-5" />
          {t("nav.more")}
        </Link>
      </nav>
    </div>
  );
}

function NavLink({
  to,
  active,
  icon: Icon,
  children,
}: {
  to: string;
  active: boolean;
  icon: typeof Home;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-[12px] px-3 text-sm",
        active ? "bg-chili-soft text-chili-dark" : "text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon className="size-4" />
      {children}
    </Link>
  );
}
