import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { a as newId, n as asInt, t as asBool } from "./utils-BZJZXT5Z.mjs";
import { i as paise } from "./money-CtWHgB0v.mjs";
import { a as withVendor, o as writeAudit, t as createServerRpc } from "./helpers-CucV1oAR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-menu-BvlNySAs.js
var getMenu_createServerFn_handler = createServerRpc({
	id: "90df5330afa2cbcd2b36a57205c2e5ed0c049d75f39bdaf478558027f404a733",
	name: "getMenu",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => getMenu.__executeServer(opts));
var getMenu = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getMenu_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.view", async (sql, ctx) => {
		const categories = await sql`
        select id, name, sort_order, is_active from categories
        where restaurant_id = ${ctx.restaurantId}
        order by sort_order, name
      `;
		const items = await sql`
        select id, category_id, name, description, diet, tags, recommended, best_seller,
               prep_minutes, sort_order, is_active, image_url
        from items where restaurant_id = ${ctx.restaurantId}
        order by sort_order, name
      `;
		const variants = await sql`
        select id, item_id, name, price_paise, sort_order, is_active
        from variants where restaurant_id = ${ctx.restaurantId}
        order by sort_order
      `;
		const addons = await sql`
        select id, name, price_paise, is_active from addons where restaurant_id = ${ctx.restaurantId}
      `;
		const links = await sql`
        select ia.item_id, ia.addon_id
        from item_addons ia
        join items i on i.id = ia.item_id
        where i.restaurant_id = ${ctx.restaurantId}
      `;
		const availability = await sql`
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
					isActive: asBool(v.is_active)
				})),
				addonIds: links.filter((l) => l.item_id === it.id).map((l) => l.addon_id)
			})),
			addons: addons.map((a) => ({
				...a,
				pricePaise: asInt(a.price_paise),
				isActive: asBool(a.is_active)
			}))
		};
	});
});
var saveCategory_createServerFn_handler = createServerRpc({
	id: "30348f87e619f8662a5dc036d60ed7e183c489fbec3f309705a699417ef37726",
	name: "saveCategory",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => saveCategory.__executeServer(opts));
var saveCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveCategory_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
		const name = data.name.trim();
		if (!name) throw new Error("Category name is required");
		if (data.id) {
			await sql`
          update categories set name = ${name}, sort_order = ${asInt(data.sortOrder)}
          where id = ${data.id} and restaurant_id = ${ctx.restaurantId}
        `;
			return {
				ok: true,
				id: data.id
			};
		}
		const id = newId("cat");
		await sql`
        insert into categories (id, restaurant_id, name, sort_order)
        values (${id}, ${ctx.restaurantId}, ${name}, ${asInt(data.sortOrder)})
      `;
		return {
			ok: true,
			id
		};
	});
});
var reorderCategories_createServerFn_handler = createServerRpc({
	id: "8f3bd1d440450ed0f5ff607231bade0c9ea707f61649577cdadedb57e4871fc8",
	name: "reorderCategories",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => reorderCategories.__executeServer(opts));
var reorderCategories = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(reorderCategories_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
		let i = 0;
		for (const id of data.orderedIds) {
			await sql`
          update categories set sort_order = ${i}
          where id = ${id} and restaurant_id = ${ctx.restaurantId}
        `;
			i += 1;
		}
		return { ok: true };
	});
});
var saveItem_createServerFn_handler = createServerRpc({
	id: "e24ee3b4736407944027093846ccfd445668fe7163d100966d8e70a992df4621",
	name: "saveItem",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => saveItem.__executeServer(opts));
var saveItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveItem_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
		const name = data.name.trim();
		if (!name) throw new Error("Item name is required");
		if (!data.variants.length) throw new Error("At least one variant is required");
		for (const v of data.variants) paise(v.pricePaise);
		if (!(await sql`
        select id from categories where id = ${data.categoryId} and restaurant_id = ${ctx.restaurantId}
      `)[0]) throw new Error("Category not found");
		let itemId = data.id;
		if (itemId) {
			if (!(await sql`
          select id from items where id = ${itemId} and restaurant_id = ${ctx.restaurantId}
        `)[0]) throw new Error("Item not found");
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
		const existing = await sql`
        select id from variants where item_id = ${itemId} and restaurant_id = ${ctx.restaurantId}
      `;
		const keep = /* @__PURE__ */ new Set();
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
		for (const e of existing) if (!keep.has(e.id)) await sql`
            update variants set is_active = false
            where id = ${e.id} and restaurant_id = ${ctx.restaurantId}
          `;
		await sql`delete from item_addons where item_id = ${itemId}`;
		for (const aid of data.addonIds ?? []) await sql`
          insert into item_addons (item_id, addon_id)
          select ${itemId}, id from addons where id = ${aid} and restaurant_id = ${ctx.restaurantId}
        `;
		await writeAudit(sql, {
			restaurantId: ctx.restaurantId,
			actorUserId: context.userId,
			action: data.id ? "item_update" : "item_create",
			entityType: "item",
			entityId: itemId,
			detail: "Menu change does not alter historical order snapshots"
		});
		return {
			ok: true,
			id: itemId
		};
	});
});
var duplicateItem_createServerFn_handler = createServerRpc({
	id: "d0b4a08bc3197fd2c0f70f1d93767554271eed24e61cb7d1c0eabe6affca330f",
	name: "duplicateItem",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => duplicateItem.__executeServer(opts));
var duplicateItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(duplicateItem_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
		if (!(await sql`
        select id from items where id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `)[0]) throw new Error("Item not found");
		const nid = newId("itm");
		await sql`
        insert into items (
          id, restaurant_id, category_id, name, description, diet, tags, recommended, prep_minutes, sort_order
        )
        select ${nid}, restaurant_id, category_id, name || ' (copy)', description, diet, tags, false, prep_minutes, sort_order + 1
        from items where id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `;
		const variants = await sql`
        select name, price_paise, sort_order from variants
        where item_id = ${data.itemId} and restaurant_id = ${ctx.restaurantId}
      `;
		for (const v of variants) await sql`
          insert into variants (id, item_id, restaurant_id, name, price_paise, sort_order)
          values (${newId("var")}, ${nid}, ${ctx.restaurantId}, ${v.name}, ${v.price_paise}, ${v.sort_order})
        `;
		await sql`
        insert into item_availability (item_id, restaurant_id, status)
        values (${nid}, ${ctx.restaurantId}, 'available')
      `;
		await sql`
        insert into item_addons (item_id, addon_id)
        select ${nid}, addon_id from item_addons where item_id = ${data.itemId}
      `;
		return {
			ok: true,
			id: nid
		};
	});
});
var setAvailability_createServerFn_handler = createServerRpc({
	id: "d78318627b6eb20ff3dacb22c44fa8c7ab2037754a98ad850b00a4934a40db14",
	name: "setAvailability",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => setAvailability.__executeServer(opts));
var setAvailability = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setAvailability_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "availability.edit", async (sql, ctx) => {
		for (const itemId of data.itemIds) await sql`
          insert into item_availability (item_id, restaurant_id, status, next_available_at, updated_at)
          select id, restaurant_id, ${data.status}, ${data.nextAvailableAt ?? null}, now()
          from items where id = ${itemId} and restaurant_id = ${ctx.restaurantId}
          on conflict (item_id) do update set
            status = excluded.status,
            next_available_at = excluded.next_available_at,
            updated_at = now()
        `;
		return { ok: true };
	});
});
var saveAddon_createServerFn_handler = createServerRpc({
	id: "765c2a93c0fe4e4b8f84db58633134e6422b1ca2937720ecacf437e3eb7d37ef",
	name: "saveAddon",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => saveAddon.__executeServer(opts));
var saveAddon = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveAddon_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "menu.edit", async (sql, ctx) => {
		paise(data.pricePaise);
		const name = data.name.trim();
		if (!name) throw new Error("Add-on name is required");
		if (data.id) {
			await sql`
          update addons set name = ${name}, price_paise = ${data.pricePaise}
          where id = ${data.id} and restaurant_id = ${ctx.restaurantId}
        `;
			return {
				ok: true,
				id: data.id
			};
		}
		const id = newId("add");
		await sql`
        insert into addons (id, restaurant_id, name, price_paise)
        values (${id}, ${ctx.restaurantId}, ${name}, ${data.pricePaise})
      `;
		return {
			ok: true,
			id
		};
	});
});
var listPublicCatalog_createServerFn_handler = createServerRpc({
	id: "835cba97c2ad33288b1f0ea6e71244c3df82c8ccd59de419540727374753a8fe",
	name: "listPublicCatalog",
	filename: "src/lib/server/api-menu.ts"
}, (opts) => listPublicCatalog.__executeServer(opts));
var listPublicCatalog = createServerFn({ method: "GET" }).handler(listPublicCatalog_createServerFn_handler, async () => {
	const { getSql } = await import("./middleware-N6mvOH4Q.mjs").then((n) => n.a).then((n) => n.n);
	return {
		apiVersion: "v1",
		restaurants: await (await getSql())`
    select id, display_name, cuisine, diet, address, data_label, verification_status, logo_url
    from restaurants
    where verification_status = 'VERIFIED'
      and data_label in ('REAL','VERIFIED')
    order by display_name
  `,
		note: "Only verified real kitchens. Simulated kitchens are excluded."
	};
});
//#endregion
export { duplicateItem_createServerFn_handler, getMenu_createServerFn_handler, listPublicCatalog_createServerFn_handler, reorderCategories_createServerFn_handler, saveAddon_createServerFn_handler, saveCategory_createServerFn_handler, saveItem_createServerFn_handler, setAvailability_createServerFn_handler };
