import { getSql, type Sql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { Permission } from "@/lib/rbac";
import { loadMemberships, requireRestaurant, type StaffContext } from "./isolation";

export async function withVendor<T>(
  userId: string,
  restaurantId: string | undefined,
  permission: Permission,
  fn: (sql: Sql, ctx: StaffContext) => Promise<T>,
): Promise<T> {
  const sql = await getSql();
  const ctx = await requireRestaurant(sql, userId, restaurantId, permission);
  return fn(sql, ctx);
}

export async function writeAudit(
  sql: Sql,
  input: {
    restaurantId?: string | null;
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    detail?: string;
  },
): Promise<void> {
  await sql`
    insert into audit_logs (id, restaurant_id, actor_user_id, action, entity_type, entity_id, detail)
    values (
      ${newId("aud")},
      ${input.restaurantId ?? null},
      ${input.actorUserId ?? null},
      ${input.action},
      ${input.entityType},
      ${input.entityId ?? null},
      ${input.detail ?? ""}
    )
  `;
}

export async function notifyInApp(
  sql: Sql,
  input: { restaurantId: string; type: string; title: string; body: string },
): Promise<void> {
  await sql`
    insert into notifications (id, restaurant_id, type, title, body)
    values (${newId("ntf")}, ${input.restaurantId}, ${input.type}, ${input.title}, ${input.body})
  `;
}

export { loadMemberships, requireRestaurant };
export type { StaffContext };
