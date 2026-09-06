import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { i as listOrders } from "./api-orders-BtUWcMc2.mjs";
import { t as OrderCard } from "./order-card-Di-jywXa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BSlPrrZS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const [scope, setScope] = (0, import_react.useState)("live");
	const q = useQuery({
		queryKey: [
			"orders",
			vendor.restaurantId,
			scope
		],
		queryFn: () => listOrders({ data: {
			restaurantId: vendor.restaurantId,
			scope
		} }),
		enabled: Boolean(vendor.restaurantId),
		refetchInterval: scope === "live" ? 4e3 : false
	});
	if (!vendor.restaurantId && !vendor.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorShell, {
		title: t("nav.orders"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("onboarding.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/onboarding",
					children: t("common.next")
				})
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.orders"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		stale: q.isError,
		restaurantName: vendor.selected?.restaurantName,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: scope === "live" ? "primary" : "secondary",
				onClick: () => setScope("live"),
				children: t("orders.live")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: scope === "history" ? "primary" : "secondary",
				onClick: () => setScope("history"),
				children: t("orders.history")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: (q.data?.orders.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "text-sm text-muted",
				children: t("orders.empty")
			}) : q.data?.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderCard, {
				order: o,
				restaurantId: vendor.restaurantId,
				dataLabel: q.data?.dataLabel,
				onChanged: () => {
					qc.invalidateQueries({ queryKey: ["orders"] });
					qc.invalidateQueries({ queryKey: ["dashboard"] });
				}
			}, o.id))
		})]
	});
}
//#endregion
export { OrdersPage as component };
