import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as isFeatureEnabled } from "./platform-config-DwNskrvg.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT, n as useClientState } from "./mark-k_MWpJPt.mjs";
import { n as VolumeX, r as Volume2 } from "../_libs/lucide-react.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { i as listOrders } from "./api-orders-BtUWcMc2.mjs";
import { t as OrderCard } from "./order-card-Di-jywXa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kitchen-Bw89SVqo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLS = [
	{
		state: "PLACED",
		key: "kitchen.new"
	},
	{
		state: "ACCEPTED",
		key: "kitchen.accepted"
	},
	{
		state: "PREPARING",
		key: "kitchen.preparing"
	},
	{
		state: "READY",
		key: "kitchen.ready"
	},
	{
		state: "RIDER_ASSIGNED",
		key: "kitchen.pickup"
	}
];
function playPing() {
	try {
		const ctx = new AudioContext();
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = 880;
		g.gain.value = .05;
		o.connect(g);
		g.connect(ctx.destination);
		o.start();
		o.stop(ctx.currentTime + .18);
	} catch {}
}
function KitchenPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const soundOn = useClientState((s) => s.soundOn);
	const setSoundOn = useClientState((s) => s.setSoundOn);
	const q = useQuery({
		queryKey: [
			"orders",
			vendor.restaurantId,
			"live"
		],
		queryFn: () => listOrders({ data: {
			restaurantId: vendor.restaurantId,
			scope: "live"
		} }),
		enabled: Boolean(vendor.restaurantId),
		refetchInterval: 3e3
	});
	const pending = q.data?.orders.filter((o) => o.state === "PLACED").length ?? 0;
	const prev = (0, import_react.useRef)(pending);
	(0, import_react.useEffect)(() => {
		if (isFeatureEnabled("new_order_sound") && soundOn && pending > prev.current) playPing();
		prev.current = pending;
	}, [pending, soundOn]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("kitchen.title"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		stale: q.isError,
		restaurantName: vendor.selected?.restaurantName,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: q.data ? `Updated ${new Date(q.data.serverTime).toLocaleTimeString()}` : t("common.loading")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "icon",
				"aria-label": soundOn ? t("kitchen.soundOn") : t("kitchen.soundOff"),
				onClick: () => setSoundOn(!soundOn),
				children: soundOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0",
			children: COLS.map((col) => {
				const items = (q.data?.orders ?? []).filter((o) => col.state === "RIDER_ASSIGNED" ? [
					"RIDER_ASSIGNED",
					"PICKED_UP",
					"ON_THE_WAY"
				].includes(o.state) : o.state === col.state);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "w-[min(86vw,22rem)] shrink-0 snap-start space-y-2 lg:w-auto lg:min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold tracking-wide",
							children: t(col.key)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular text-sm text-muted",
							children: items.length
						})]
					}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "text-sm text-muted",
						children: t("kitchen.empty")
					}) : items.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderCard, {
						large: true,
						order: o,
						restaurantId: vendor.restaurantId,
						dataLabel: q.data?.dataLabel,
						onChanged: () => void qc.invalidateQueries({ queryKey: ["orders"] })
					}, o.id))]
				}, col.state);
			})
		})]
	});
}
//#endregion
export { KitchenPage as component };
