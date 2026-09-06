import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { r as minutesToHm, t as hmToMinutes } from "./hours-CQlwh30e.mjs";
import { n as Label, t as Input } from "./input-Dj6qv6Kf.mjs";
import { a as saveHours, r as getOperatingSnapshot } from "./api-orders-BtUWcMc2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hours-DSCSNz_w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	"hours.day0",
	"hours.day1",
	"hours.day2",
	"hours.day3",
	"hours.day4",
	"hours.day5",
	"hours.day6"
];
function HoursPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["hours", vendor.restaurantId],
		queryFn: () => getOperatingSnapshot({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	const [emergency, setEmergency] = (0, import_react.useState)(false);
	const [vacation, setVacation] = (0, import_react.useState)(false);
	const [prep, setPrep] = (0, import_react.useState)("20");
	const [peak, setPeak] = (0, import_react.useState)("30");
	const [shifts, setShifts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		setEmergency(Boolean(q.data.restaurant?.emergency_closed));
		setVacation(Boolean(q.data.restaurant?.vacation_mode));
		setPrep(String(q.data.restaurant?.prep_minutes ?? 20));
		setPeak(String(q.data.restaurant?.peak_prep_minutes ?? 30));
		setShifts(q.data.hours.map((h) => ({
			weekday: h.weekday,
			open: minutesToHm(h.open_minutes),
			close: minutesToHm(h.close_minutes)
		})));
	}, [q.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.hours"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: emergency,
						onChange: (e) => setEmergency(e.target.checked)
					}), t("hours.emergency")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: vacation,
						onChange: (e) => setVacation(e.target.checked)
					}), t("hours.vacation")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("menu.prep") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: prep,
					onChange: (e) => setPrep(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("hours.peak") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: peak,
					onChange: (e) => setPeak(e.target.value)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "space-y-3",
				children: DAYS.map((d, i) => {
					const dayShifts = shifts.filter((s) => s.weekday === i);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 border-b border-line pb-3 md:grid-cols-[80px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: t(d)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								dayShifts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted",
									children: t("hours.closed")
								}) : null,
								dayShifts.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: s.open,
										onChange: (e) => {
											const next = shifts.map((x) => x === s ? {
												...x,
												open: e.target.value
											} : x);
											setShifts(next);
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: s.close,
										onChange: (e) => {
											const next = shifts.map((x) => x === s ? {
												...x,
												close: e.target.value
											} : x);
											setShifts(next);
										}
									})]
								}, idx)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setShifts([...shifts, {
										weekday: i,
										open: "11:00",
										close: "15:00"
									}]),
									children: t("hours.split")
								})
							]
						})]
					}, d);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void saveHours({ data: {
					restaurantId: vendor.restaurantId,
					emergencyClosed: emergency,
					vacationMode: vacation,
					prepMinutes: Number(prep) || 20,
					peakPrepMinutes: Number(peak) || 30,
					shifts: shifts.map((s) => ({
						weekday: s.weekday,
						openMinutes: hmToMinutes(s.open),
						closeMinutes: hmToMinutes(s.close)
					}))
				} }).then(() => qc.invalidateQueries({ queryKey: ["hours"] })),
				children: t("hours.save")
			})
		]
	});
}
//#endregion
export { HoursPage as component };
