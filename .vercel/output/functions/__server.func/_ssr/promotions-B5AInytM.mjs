import { o as __toESM } from "../_runtime.mjs";
import { n as can } from "./rbac-inyuxmFx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { o as rupeesToPaise } from "./money-CtWHgB0v.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { i as savePromotion, n as getPromotions } from "./api-finance-BKQbHxtM.mjs";
import { n as Label, t as Input } from "./input-Dj6qv6Kf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/promotions-B5AInytM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PromotionsPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["promos", vendor.restaurantId],
		queryFn: () => getPromotions({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	const canEdit = vendor.role ? can(vendor.role, "promotions.edit") : false;
	const [name, setName] = (0, import_react.useState)("");
	const [percent, setPercent] = (0, import_react.useState)("10");
	const rest = q.data?.promotions.filter((p) => p.funder === "RESTAURANT") ?? [];
	const plat = q.data?.promotions.filter((p) => p.funder === "PLATFORM") ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.promotions"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: t("promotions.restaurantFunded")
				}), rest.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: p.estimate.narrative
						}),
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => void savePromotion({ data: {
								restaurantId: vendor.restaurantId,
								id: p.id,
								name: p.name,
								funder: "RESTAURANT",
								kind: p.kind,
								percentOff: p.percent_off ?? void 0,
								isActive: !p.isActive
							} }).then(() => qc.invalidateQueries({ queryKey: ["promos"] })),
							children: p.isActive ? t("promotions.pause") : t("promotions.activate")
						}) : null
					]
				}, p.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: t("promotions.platformFunded")
				}), plat.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: p.estimate.narrative
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: p.estimate.estimatedDailyCostPaise })
					]
				}, p.id))]
			})]
		}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg",
					children: t("promotions.create")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("menu.name") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("promotions.percent") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: percent,
					onChange: (e) => setPercent(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void savePromotion({ data: {
						restaurantId: vendor.restaurantId,
						name,
						funder: "RESTAURANT",
						kind: "percent",
						percentOff: Number(percent) || 0,
						minOrderPaise: rupeesToPaise(150),
						isActive: false
					} }).then(() => {
						setName("");
						qc.invalidateQueries({ queryKey: ["promos"] });
					}),
					children: t("promotions.create")
				})
			]
		}) : null]
	});
}
//#endregion
export { PromotionsPage as component };
