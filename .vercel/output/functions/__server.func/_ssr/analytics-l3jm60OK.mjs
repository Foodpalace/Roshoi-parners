import { o as __toESM } from "../_runtime.mjs";
import { n as can } from "./rbac-inyuxmFx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { t as getAnalytics } from "./api-finance-BKQbHxtM.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-l3jm60OK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const t = useT();
	const vendor = useVendor();
	const [range, setRange] = (0, import_react.useState)("week");
	const allowed = vendor.role ? can(vendor.role, "analytics.view") : false;
	const q = useQuery({
		queryKey: [
			"analytics",
			vendor.restaurantId,
			range
		],
		queryFn: () => getAnalytics({ data: {
			restaurantId: vendor.restaurantId,
			range
		} }),
		enabled: Boolean(vendor.restaurantId) && allowed
	});
	if (vendor.role && !allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorShell, {
		title: t("nav.analytics"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: t("settings.financialLocked") })
	});
	const s = q.data?.summary;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.analytics"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[12px] bg-info-soft px-3 py-2 text-xs font-semibold tracking-wide text-info",
				children: q.data?.dataKind ?? t("analytics.simulated")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"day",
					"week",
					"month"
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: range === r ? "primary" : "secondary",
					onClick: () => setRange(r),
					children: t(r === "day" ? "common.today" : r === "week" ? "common.week" : "common.month")
				}, r))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: t("analytics.orders")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl tabular",
							children: s?.orders ?? "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: t("dashboard.sales")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl",
							children: s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: s.salesPaise }) : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: t("dashboard.aov")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl",
							children: s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: s.aovPaise }) : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: t("analytics.avgPrep")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl tabular",
							children: q.data?.avgPrepMinutes ?? "—"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "h-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 font-display text-lg",
					children: t("analytics.peak")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "85%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: q.data?.hours ?? [],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "hour",
								stroke: "var(--color-muted)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								stroke: "var(--color-muted)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "orders",
								fill: "var(--color-chili)",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: t("analytics.best")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm",
					children: (q.data?.items ?? []).slice(0, 5).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular text-muted",
							children: i.qty
						})]
					}, i.name))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: t("analytics.low")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm",
					children: (q.data?.items ?? []).slice().reverse().slice(0, 5).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular text-muted",
							children: i.qty
						})]
					}, i.name))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: t("analytics.promos")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						t("promotions.restaurantFunded"),
						":",
						" ",
						q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: q.data.promotions.restaurantFundedPaise }) : "—"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						t("promotions.platformFunded"),
						":",
						" ",
						q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: q.data.promotions.platformFundedPaise }) : "—"
					]
				})
			] })
		]
	});
}
//#endregion
export { AnalyticsPage as component };
