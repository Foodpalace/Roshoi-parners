import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { o as markNotificationsRead, r as getNotifications } from "./api-more-BGAOS9o2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-BYKH0AIu.js
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["ntf", vendor.restaurantId],
		queryFn: () => getNotifications({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.notifications"),
		dataLabel: vendor.dataLabel,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 text-xs",
				children: q.data?.channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: c.connected ? "rounded-full bg-leaf-soft px-2 py-1 text-leaf" : "rounded-full bg-warn-soft px-2 py-1 text-warn",
					children: [
						c.channel,
						": ",
						c.connected ? "in-app" : t("app.notConnected")
					]
				}, c.channel))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => void markNotificationsRead({ data: { restaurantId: vendor.restaurantId } }).then(() => qc.invalidateQueries({ queryKey: ["ntf"] })),
				children: t("notifications.markRead")
			}),
			(q.data?.notifications.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "text-sm text-muted",
				children: t("notifications.empty")
			}) : q.data?.notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: n.isRead ? "opacity-70" : "",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted",
						children: n.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: n.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: n.body
					})
				]
			}, n.id))
		]
	});
}
//#endregion
export { NotificationsPage as component };
