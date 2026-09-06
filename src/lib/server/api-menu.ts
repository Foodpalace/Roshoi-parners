import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId, asInt, asBool } from "@/lib/utils";
import { paise } from "@/lib/money";
import { withVendor, writeAudit } from "./helpers";
import type { AvailabilityStatus, DietFlag } from "@/lib/contracts";

export const getMenu = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.view", async (sql, ctx) => {
      const categories = await sql<{ id: string; name: string; sort_order: number; is_active: boolean }>`
        select id, name, sort_order, is_active from categories
        where restaurant_id = ${ctx.restaurantId}
        order by sort_order, name
      `;
      const items = await sql<{
        id: string;
        category_id: string;
        name: string;
        description: string;
        diet: string;
        tags: string;
        recommended: boolean;
        best_seller: boolean;
        prep_minutes: number | null;
        sort_order: number;
        is_active: boolean;
        image_url: string | null;
      }>`
        select id, category_id, name, description, diet, tags, recommended, best_seller,
               prep_minutes, sort_order, is_active, image_url
        from items where restaurant_id = ${ctx.restaurantId}
        order by sort_order, name
      `;
      const variants = await sql<{
        id: string;
        item_id: string;
        name: string;
        price_paise: number;
        sort_order: number;
        is_active: boolean;
      }>`
        select id, item_id, name, price_paise, sort_order, is_active
        from variants where restaurant_id = ${ctx.restaurantId}
        order by sort_order
      `;
      const addons = await sql<{ id: string; name: string; price_paise: number; is_active: boolean }>`
        select id, name, price_paise, is_active from addons where restaurant_id = ${ctx.restaurantId}
      `;
      const links = await sql<{ item_id: string; addon_id: string }>`
        select ia.item_id, ia.addon_id
        from item_addons ia
        join items i on i.id = ia.item_id
        where i.restaurant_id = ${ctx.restaurantId}
      `;
      const availability = await sql<{
        item_id: string;
        status: string;
        next_available_at: string | null;
        note: string;
      }>`
        select item_id, status, next_available_at::text as next_available_at, note
        from item_availability where restaurant_id = ${ctx.restaurantId}
      `;
      return {
        restaurantId: ctx.restaurantId,
        role: ctx.role,
        dataLabel: ctx.dataLabel,
        categories,
        items: items.map((it) => ({
          ...it,
          recommended: asBool(it.recommended),
          bestSeller: asBool(it.best_seller),
          isActive: asBool(it.is_active),
          availability: availability.find((a) => a.item_id === it.id)?.status ?? "available",
          nextAvailableAt: availability.find((a) => a.item_id === it.id)?.next_available_at ?? null,
          variants: variants.filter((v) => v.item_id === it.id).map((v) => ({
            ...v,
            pricePaise: asInt(v.price_paise),
            isActive: asBool(v.is_active),
          })),
          addonIds: links.filter((l) => l.item_id === it.id).map((l) => l.addon_id),
        })),
        addons: addons.map((a) => ({ ...a, pricePaise: asInt(a.price_paise), isActive: asBool(a.is_active) })),
      };
    });
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; id?: string; name: string; sortOrder?: number }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
      const name = data.name.trim();
      if (!name) throw new Error("Category name is required");
      if (data.id) {
        await sql`
          update categories set name = ${name}, sort_order = ${asInt(data.sortOrder)}
          where id = ${data.id} and restaurant_id = ${ctx.restaurantId}
        `;
        return { ok: true as const, id: data.id };
      }
      const id = newId("cat");
      await sql`
        insert into categories (id, restaurant_id, name, sort_order)
        values (${id}, ${ctx.restaurantId}, ${name}, ${asInt(data.sortOrder)})
      `;
      return { ok: true as const, id };
    });
  });

export const reorderCategories = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; orderedIds: string[] }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
      let i = 0;
      for (const id of data.orderedIds) {
        await sql`
          update categories set sort_order = ${i}
          where id = ${id} and restaurant_id = ${ctx.restaurantId}
        `;
        i += 1;
      }
      return { ok: true as const };
    });
  });

export const saveItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    restaurantId?: string;
    id?: string;
    categoryId: string;
    name: string;
    description?: string;
    diet?: DietFlag;
    tags?: string;
    recommended?: boolean;
    prepMinutes?: number | null;
    variants: { id?: string; name: string; pricePaise: number }[];
    addonIds?: string[];
  }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
      const name = data.name.trim();
      if (!name) throw new Error("Item name is required");
      if (!data.variants.length) throw new Error("At least one variant is required");
      for (const v of data.variants) paise(v.pricePaise);

      const cat = await sql<{ id: string }>`
        select id from categories where id = ${data.categoryId} and restaurant_id = ${ctx.restaurantId}
      `;
      if (!cat[0]) throw new Error("Category not found");

      let itemId = data.id;
      if (itemId) {
        const owned = await sql<{ id: string }>`
          select id from items where id = ${itemId} and restaurant_id = ${ctx.restaurantId}
        `;
        if (!owned[0]) throw new Error("Item not found");
        await sql`
          update items set
            category_id = ${data.categoryId},
            name = ${name},
            description = ${data.description ?? ""},
            diet = ${data.diet ?? "NONVEG"},
            tags = ${data.tags ?? ""},
            recommended = ${Boolean(data.recommended)},
            prep_minutes = ${data.prepMinutes ?? null}
          where id = ${itemId} and restaurant_id = ${ctx.restaurantId}
        `;
      } else {
        itemId = newId("itm");
        await sql`
          insert into items (
            id, restaurant_id, category_id, name, description, diet, tags, recommended, prep_minutes
          ) values (
            ${itemId}, ${ctx.restaurantId}, ${data.categoryId}, ${name},
            ${data.description ?? ""}, ${data.diet ?? "NONVEG"}, ${data.tags ?? ""},
            ${Boolean(data.recommended)}, ${data.prepMinutes ?? null}
          )
        `;
        await sql`
          insert into item_availability (item_id, restaurant_id, status)
          values (${itemId}, ${ctx.restaurantId}, 'available')
        `;
      }

      const existing = await sql<{ id: string }>`
        select id from variants where item_id = ${itemId} and restaurant_id = ${ctx.restaurantId}
      `;
      const keep = new Set<string>();
      let sort = 0;
      for (const v of data.variants) {
        if (v.id && existing.some((e) => e.id === v.id)) {
          keep.add(v.id);
          await sql`
            update variants set name = ${v.name.trim()}, price_paise = ${v.pricePaise}, sort_order = ${sort}
            where id = ${v.id} and restaurant_id = ${ctx.restaurantId}
          `;
        } else {
          const vid = newId("var");
          keep.add(vid);
          await sql`
            insert into variants (id, item_id, restaurant_id, name, price_paise, sort_order)
            values (${vid}, ${itemId}, ${ctx.restaurantId}, ${v.name.trim()}, ${v.pricePaise}, ${sort})
          `;
        }
        sort += 1;
      }
      for (const e of existing) {
        if (!keep.has(e.id)) {
          await sql`
            update variants set is_active = false
            where id = ${e.id} and restaurant_id = ${ctx.restaurantId}
          `;
        }
      }

      await sql`delete from item_addons where item_id = ${itemId}`;
      for (const aid of data.addonIds ?? []) {
        await sql`
          insert into item_addons (item_id, addon_id)
          select ${itemId}, id from addons where id = ${aid} and restaurant_id = ${ctx.restaurantId}
        `;
      }
      await writeAudit(sql, {
        restaurantId: ctx.restaurantId,
        actorUserId: context.userId,
        action: data.id ? "item_update" : "item_create",
        entityType: "item",
        entityId: itemId,
        detail: "Menu change does not alter historical order snapshots",
      });
      return { ok: true as const, id: itemId };
    });
  });

export const duplicateItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; itemId: string }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
      const items = await sql<{ id: string }>`
        select id from items where id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `;
      if (!items[0]) throw new Error("Item not found");
      const nid = newId("itm");
      await sql`
        insert into items (
          id, restaurant_id, category_id, name, description, diet, tags, recommended, prep_minutes, sort_order
        )
        select ${nid}, restaurant_id, category_id, name || ' (copy)', description, diet, tags, false, prep_minutes, sort_order + 1
        from items where id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `;
      const variants = await sql<{
        name: string;
        price_paise: number;
        sort_order: number;
      }>`
        select name, price_paise, sort_order from variants
        where item_id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `;
      for (const v of variants) {
        await sql`
          insert into variants (id, item_id, restaurant_id, name, price_paise, sort_order)
          values (${newId("var")}, ${nid}, ${ctx.restaurantId}, ${v.name}, ${v.price_paise}, ${v.sort_order})
        `;
      }
      await sql`
        insert into item_availability (item_id, restaurant_id, status)
        values (${nid}, ${ctx.restaurantId}, 'available')
      `;
      await sql`
        insert into item_addons (item_id, addon_id)
        select ${nid}, addon_id from item_addons where item_id = ${data.itemId}
      `;
      return { ok: true as const, id: nid };
    });
  });

export const setAvailability = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    restaurantId?: string;
    itemIds: string[];
    status: AvailabilityStatus;
    nextAvailableAt?: string | null;
  }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "availability.edit", async (sql, ctx) => {
      for (const itemId of data.itemIds) {
        await sql`
          insert into item_availability (item_id, restaurant_id, status, next_available_at, updated_at)
          select id, restaurant_id, ${data.status}, ${data.nextAvailableAt ?? null}, now()
          from items where id = ${itemId} and restaurant_id = ${ctx.restaurantId}
          on conflict (item_id) do update set
            status = excluded.status,
            next_available_at = excluded.next_available_at,
            updated_at = now()
        `;
      }
      return { ok: true as const };
    });
  });

export const saveAddon = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; id?: string; name: string; pricePaise: number }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
      paise(data.pricePaise);
      const name = data.name.trim();
      if (!name) throw new Error("Add-on name is required");
      if (data.id) {
        await sql`
          update addons set name = ${name}, price_paise = ${data.pricePaise}
          where id = ${data.id} and restaurant_id = ${ctx.restaurantId}
        `;
        return { ok: true as const, id: data.id };
      }
      const id = newId("add");
      await sql`
        insert into addons (id, restaurant_id, name, price_paise)
        values (${id}, ${ctx.restaurantId}, ${name}, ${data.pricePaise})
      `;
      return { ok: true as const, id };
    });
  });

export const listPublicCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    display_name: string;
    cuisine: string;
    diet: string;
    address: string;
    data_label: string;
    verification_status: string;
    logo_url: string | null;
  }>`
    select id, display_name, cuisine, diet, address, data_label, verification_status, logo_url
    from restaurants
    where verification_status = 'VERIFIED'
      and data_label in ('REAL','VERIFIED')
    order by display_name
  `;
  return {
    apiVersion: "v1",
    restaurants: rows,
    note: "Only verified real kitchens. Simulated kitchens are excluded.",
  };
});
