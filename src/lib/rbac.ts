export const RESTAURANT_ROLES = [
  "OWNER",
  "MANAGER",
  "STAFF",
  "ACCOUNTANT",
  "MULTI_OUTLET_MANAGER",
] as const;

export type RestaurantRole = (typeof RESTAURANT_ROLES)[number];

/** Platform-only. Never granted to restaurant users in this app. */
export const PLATFORM_ROLES = ["SUPER_ADMIN"] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const PERMISSIONS = [
  "dashboard.view",
  "orders.view",
  "orders.accept",
  "orders.reject",
  "orders.prepare",
  "orders.ready",
  "kitchen.view",
  "menu.view",
  "menu.edit",
  "availability.edit",
  "hours.edit",
  "promotions.view",
  "promotions.edit",
  "settlements.view",
  "settlements.export",
  "analytics.view",
  "reviews.view",
  "reviews.respond",
  "notifications.view",
  "assistant.use",
  "settings.view",
  "settings.financial",
  "settings.staff",
  "onboarding.edit",
  "documents.upload",
  "outlets.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL: Permission[] = [...PERMISSIONS];

const ROLE_PERMISSIONS: Record<RestaurantRole, readonly Permission[]> = {
  OWNER: ALL,
  MULTI_OUTLET_MANAGER: ALL.filter((p) => p !== "settings.financial"),
  MANAGER: [
    "dashboard.view",
    "orders.view",
    "orders.accept",
    "orders.reject",
    "orders.prepare",
    "orders.ready",
    "kitchen.view",
    "menu.view",
    "menu.edit",
    "availability.edit",
    "hours.edit",
    "promotions.view",
    "promotions.edit",
    "analytics.view",
    "reviews.view",
    "reviews.respond",
    "notifications.view",
    "assistant.use",
    "settings.view",
    "settings.staff",
    "onboarding.edit",
    "documents.upload",
  ],
  STAFF: [
    "dashboard.view",
    "orders.view",
    "orders.accept",
    "orders.reject",
    "orders.prepare",
    "orders.ready",
    "kitchen.view",
    "menu.view",
    "availability.edit",
    "notifications.view",
  ],
  ACCOUNTANT: [
    "dashboard.view",
    "settlements.view",
    "settlements.export",
    "analytics.view",
    "notifications.view",
    "settings.view",
  ],
};

export function isRestaurantRole(value: string): value is RestaurantRole {
  return (RESTAURANT_ROLES as readonly string[]).includes(value);
}

export function permissionsFor(role: RestaurantRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function can(role: RestaurantRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertCan(role: RestaurantRole, permission: Permission): void {
  if (!can(role, permission)) {
    const err = new Error("Forbidden");
    (err as Error & { status: number }).status = 403;
    throw err;
  }
}
