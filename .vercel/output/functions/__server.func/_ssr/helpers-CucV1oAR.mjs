import { r as __exportAll } from "../_runtime.mjs";
import { r as isRestaurantRole, t as assertCan } from "./rbac-inyuxmFx.mjs";
import { c as __exportAll$1, i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as getSql } from "./middleware-N6mvOH4Q.mjs";
import { a as newId } from "./utils-BZJZXT5Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-CucV1oAR.js
var helpers_CucV1oAR_exports = /* @__PURE__ */ __exportAll({
	a: () => loadMemberships,
	i: () => writeAudit,
	n: () => notifyInApp,
	o: () => createServerRpc,
	r: () => withVendor,
	t: () => helpers_exports
});
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var IsolationError = class extends Error {
	status;
	constructor(message, status = 403) {
		super(message);
		this.name = "IsolationError";
		this.status = status;
	}
};
async function loadMemberships(sql, userId) {
	return (await sql`
    select s.restaurant_id, s.outlet_id, s.role,
           r.display_name as restaurant_name,
           r.data_label, r.verification_status, r.commission_bps
    from restaurant_staff s
    join restaurants r on r.id = s.restaurant_id
    where s.user_id = ${userId} and s.is_active = true
    order by s.created_at asc
  `).filter((row) => isRestaurantRole(row.role)).map((row) => ({
		userId,
		restaurantId: row.restaurant_id,
		outletId: row.outlet_id,
		role: row.role,
		restaurantName: row.restaurant_name,
		dataLabel: row.data_label ?? "REAL",
		verificationStatus: row.verification_status,
		commissionBps: Number(row.commission_bps)
	}));
}
async function requireRestaurant(sql, userId, restaurantId, permission) {
	const memberships = await loadMemberships(sql, userId);
	if (memberships.length === 0) throw new IsolationError("No restaurant membership", 404);
	const ctx = restaurantId ? memberships.find((m) => m.restaurantId === restaurantId) : memberships[0];
	if (!ctx) throw new IsolationError("Restaurant not found for this user", 404);
	assertCan(ctx.role, permission);
	return ctx;
}
var helpers_exports = /* @__PURE__ */ __exportAll$1({
	notifyInApp: () => notifyInApp,
	requireRestaurant: () => requireRestaurant,
	withVendor: () => withVendor,
	writeAudit: () => writeAudit
});
async function withVendor(userId, restaurantId, permission, fn) {
	const sql = await getSql();
	return fn(sql, await requireRestaurant(sql, userId, restaurantId, permission));
}
async function writeAudit(sql, input) {
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
async function notifyInApp(sql, input) {
	await sql`
    insert into notifications (id, restaurant_id, type, title, body)
    values (${newId("ntf")}, ${input.restaurantId}, ${input.type}, ${input.title}, ${input.body})
  `;
}
//#endregion
export { withVendor as a, notifyInApp as i, helpers_CucV1oAR_exports as n, writeAudit as o, loadMemberships as r, createServerRpc as t };
