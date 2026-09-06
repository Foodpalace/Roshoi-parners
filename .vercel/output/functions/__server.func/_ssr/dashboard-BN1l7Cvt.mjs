import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn } from "./utils-BZJZXT5Z.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { n as getDashboard } from "./api-orders-BtUWcMc2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BN1l7Cvt.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const t = useT();
	const vendor = useVendor();
	const dash = useQuery({
		queryKey: ["dashboard", vendor.restaurantId],
		queryFn: () => getDashboard({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId),
		refetchInterval: 8e3
	});
	if (!vendor.isPending && vendor.memberships.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorShell, {
		title: t("dashboard.greeting"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("onboarding.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/onboarding",
						children: t("onboarding.realCta")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/onboarding",
						children: t("onboarding.demoCta")
					})
				})]
			})]
		})
	});
	const d = dash.data;
	const stale = dash.isError;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: d?.restaurantName ?? t("nav.home"),
		dataLabel: d?.dataLabel ?? vendor.dataLabel,
		stale,
		restaurantName: d?.restaurantName,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					t("dashboard.today"),
					" · ",
					d?.isOpen ? t("dashboard.open") : t("dashboard.closed")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.orders"),
						value: d?.today.orders ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.sales"),
						value: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: d.today.salesPaise }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.aov"),
						value: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: d.today.aovPaise }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.pending"),
						value: d?.today.pending ?? "—",
						warn: Boolean(d && d.today.pending > 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.accepted"),
						value: d?.today.accepted ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.cancelled"),
						value: d?.today.cancelled ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.refunds"),
						value: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: d.today.refundsPaise }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.settlement"),
						value: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: d.today.settlementPaise }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.rating"),
						value: d?.today.rating != null ? `${d.today.rating} (${d.today.ratingCount})` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.unavailable"),
						value: d?.today.unavailableItems ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t("dashboard.repeat"),
						value: d?.today.repeatPct != null ? `${d.today.repeatPct}%` : "—"
					})
				]
			}),
			d && d.today.pending > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				className: "w-full md:w-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/orders",
					children: t("dashboard.seeOrders")
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: t("dashboard.attention")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: (d?.attention.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: t("dashboard.noAttention")
				}) : d?.attention.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cn("rounded-[12px] border-l-4 px-3 py-2 text-sm", a.tone === "danger" && "border-danger bg-danger-soft text-danger", a.tone === "warn" && "border-warn bg-warn-soft text-warn", a.tone === "info" && "border-info bg-info-soft text-info"),
					children: t(a.key, {
						n: a.n ?? 0,
						status: a.status ?? ""
					})
				}, a.id))
			})] })
		]
	});
}
function Stat({ label, value, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("min-h-[5.5rem] p-3", warn && "border-danger"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl leading-tight tabular",
			children: value
		})]
	});
}
//#endregion
export { DashboardPage as component };
