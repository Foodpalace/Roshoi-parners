import { n as can } from "./rbac-inyuxmFx.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as UserButton, r as VendorShell, t as MORE_NAV, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-CI8WKCSO.js
var import_jsx_runtime = require_jsx_runtime();
function MorePage() {
	const t = useT();
	const vendor = useVendor();
	const role = vendor.role;
	const items = MORE_NAV.filter((item) => !role || can(role, item.perm));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.more"),
		dataLabel: vendor.dataLabel,
		restaurantName: vendor.selected?.restaurantName,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: "flex min-h-14 items-center gap-3 rounded-[16px] border border-line bg-surface px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-chili" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: t(item.key)
				})]
			}, item.to))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
		})]
	});
}
//#endregion
export { MorePage as component };
