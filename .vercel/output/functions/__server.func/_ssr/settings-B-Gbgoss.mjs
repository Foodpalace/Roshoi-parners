import { o as __toESM } from "../_runtime.mjs";
import { n as can } from "./rbac-inyuxmFx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as platformConfig } from "./platform-config-DwNskrvg.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT, n as useClientState } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { n as Label, t as Input } from "./input-Dj6qv6Kf.mjs";
import { a as listStaff, t as addStaff } from "./api-more-BGAOS9o2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-B-Gbgoss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const lang = useClientState((s) => s.lang);
	const setLang = useClientState((s) => s.setLang);
	const staffQ = useQuery({
		queryKey: ["staff", vendor.restaurantId],
		queryFn: () => listStaff({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId) && Boolean(vendor.role && can(vendor.role, "settings.staff"))
	});
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("STAFF");
	const [msg, setMsg] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.settings"),
		dataLabel: vendor.dataLabel,
		restaurantName: vendor.selected?.restaurantName,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: t("settings.language")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lang === "en" ? "primary" : "secondary",
						onClick: () => setLang("en"),
						children: t("settings.english")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lang === "bn" ? "primary" : "secondary",
						onClick: () => setLang("bn"),
						children: t("settings.bengali")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: t("settings.commission")
					}),
					vendor.role && can(vendor.role, "settings.financial") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular text-2xl",
						children: [(vendor.selected?.commissionBps ?? 1e3) / 100, "%"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("settings.financialLocked")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							t("settings.snapshotHint"),
							" ",
							platformConfig.commission.targetBps / 100,
							"%."
						]
					})
				]
			}),
			vendor.role && can(vendor.role, "settings.staff") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: t("settings.staff")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "text-sm",
						children: staffQ.data?.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between border-b border-line py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.email ?? s.user_id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: s.role
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 md:grid-cols-[1fr_140px_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("auth.email") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("settings.role") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 w-full rounded-[12px] border border-line bg-surface px-2",
								value: role,
								onChange: (e) => setRole(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "STAFF" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MANAGER" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACCOUNTANT" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MULTI_OUTLET_MANAGER" })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "self-end",
								onClick: () => void addStaff({ data: {
									restaurantId: vendor.restaurantId,
									email,
									role
								} }).then(() => {
									setMsg("Saved");
									setEmail("");
									qc.invalidateQueries({ queryKey: ["staff"] });
								}).catch((e) => setMsg(e instanceof Error ? e.message : "Failed")),
								children: t("settings.add")
							})
						]
					}),
					msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: msg
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "text-sm text-muted",
				children: [
					t("settings.adapters"),
					": AI ",
					vendor.adapters?.ai.provider,
					", SMS",
					" ",
					vendor.adapters?.notifications.find((n) => n.channel === "sms")?.provider,
					", storage",
					" ",
					vendor.adapters?.storage.provider,
					", dispatch ",
					vendor.adapters?.dispatch.provider,
					"."
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
