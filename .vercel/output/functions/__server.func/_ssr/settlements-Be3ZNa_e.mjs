import { n as can } from "./rbac-inyuxmFx.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { n as formatINR } from "./money-CtWHgB0v.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { r as getSettlements } from "./api-finance-BKQbHxtM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settlements-Be3ZNa_e.js
var import_jsx_runtime = require_jsx_runtime();
function SettlementsPage() {
	const t = useT();
	const vendor = useVendor();
	const allowed = vendor.role ? can(vendor.role, "settlements.view") : false;
	const q = useQuery({
		queryKey: ["settle", vendor.restaurantId],
		queryFn: () => getSettlements({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId) && allowed
	});
	if (vendor.role && !allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorShell, {
		title: t("nav.settlements"),
		dataLabel: vendor.dataLabel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: t("settings.financialLocked") })
	});
	function download(kind) {
		const batches = q.data?.batches ?? [];
		if (kind === "json") {
			const blob = new Blob([JSON.stringify({
				dataLabel: q.data?.dataLabel,
				batches
			}, null, 2)], { type: "application/json" });
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "roshoi-settlement.json";
			a.click();
			return;
		}
		const lines = ["order,food,restaurant_discount,commission,platform_funded,packing,refund,payable"];
		for (const b of batches) for (const l of b.lines) lines.push([
			l.order_number,
			l.foodValuePaise,
			l.restaurantDiscountPaise,
			l.commissionPaise,
			l.platformFundedDiscountPaise,
			l.packingPaise,
			l.refundAdjustmentPaise,
			l.restaurantPayablePaise
		].join(","));
		const blob = new Blob([lines.join("\n")], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "roshoi-settlement.csv";
		a.click();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.settlements"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		children: [
			q.data?.dataLabel === "SIMULATED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: t("settlements.simulatedNote")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs uppercase tracking-wide text-muted",
				children: t("settlements.payable")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-3xl",
				children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: q.data.currentPayablePaise }) : "—"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: t("settlements.formula")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: t("settlements.formulaHint")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => download("csv"),
					children: t("settlements.exportCsv")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => download("json"),
					children: t("settlements.exportJson")
				})]
			}),
			(q.data?.batches.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "text-sm text-muted",
				children: t("settlements.empty")
			}) : q.data?.batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted",
						children: b.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: b.scheduled_for ?? b.period_end
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, {
						paise: b.totalPayablePaise,
						className: "text-xl font-semibold"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("settlements.food") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("settlements.restDisc") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("settlements.commission") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("settlements.platformDisc") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("settlements.payableLine") })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: b.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-line tabular",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: l.order_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatINR(l.foodValuePaise) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatINR(l.restaurantDiscountPaise) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatINR(l.commissionPaise) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatINR(l.platformFundedDiscountPaise) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatINR(l.restaurantPayablePaise) })
							]
						}, l.id)) })]
					})
				})]
			}, b.id))
		]
	});
}
//#endregion
export { SettlementsPage as component };
