import { r as __exportAll } from "../_runtime.mjs";
import { c as __exportAll$1 } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rbac-inyuxmFx.js
var rbac_inyuxmFx_exports = /* @__PURE__ */ __exportAll({
	i: () => rbac_exports,
	n: () => can,
	r: () => isRestaurantRole,
	t: () => assertCan
});
var rbac_exports = /* @__PURE__ */ __exportAll$1({
	PERMISSIONS: () => PERMISSIONS,
	RESTAURANT_ROLES: () => RESTAURANT_ROLES,
	assertCan: () => assertCan,
	can: () => can,
	isRestaurantRole: () => isRestaurantRole
});
var RESTAURANT_ROLES = [
	"OWNER",
	"MANAGER",
	"STAFF",
	"ACCOUNTANT",
	"MULTI_OUTLET_MANAGER"
];
var PERMISSIONS = [
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
	"outlets.manage"
];
var ALL = [...PERMISSIONS];
var ROLE_PERMISSIONS = {
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
		"documents.upload"
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
		"notifications.view"
	],
	ACCOUNTANT: [
		"dashboard.view",
		"settlements.view",
		"settlements.export",
		"analytics.view",
		"notifications.view",
		"settings.view"
	]
};
function isRestaurantRole(value) {
	return RESTAURANT_ROLES.includes(value);
}
function can(role, permission) {
	return ROLE_PERMISSIONS[role].includes(permission);
}
function assertCan(role, permission) {
	if (!can(role, permission)) {
		const err = /* @__PURE__ */ new Error("Forbidden");
		err.status = 403;
		throw err;
	}
}
//#endregion
export { rbac_inyuxmFx_exports as i, can as n, isRestaurantRole as r, assertCan as t };
