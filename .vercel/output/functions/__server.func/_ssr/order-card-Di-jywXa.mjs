import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { i as cn } from "./utils-BZJZXT5Z.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { n as formatINR } from "./money-CtWHgB0v.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { t as REJECT_REASONS } from "./state-machine-DxXhKfD0.mjs";
import { o as transitionOrder, t as advanceSimulatedRider } from "./api-orders-BtUWcMc2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-card-Di-jywXa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function actionKey(orderId, action) {
	if (typeof window === "undefined") return `${orderId}:${action}:${Date.now()}`;
	const k = `roshoi:idem:${orderId}:${action}`;
	try {
		const existing = sessionStorage.getItem(k);
		if (existing) return existing;
		const next = crypto.randomUUID();
		sessionStorage.setItem(k, next);
		return next;
	} catch {
		return crypto.randomUUID();
	}
}
function clearActionKey(orderId, action) {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.removeItem(`roshoi:idem:${orderId}:${action}`);
	} catch {}
}
var STATE_MARK = {
	PLACED: {
		letter: "N",
		cls: "bg-danger text-surface"
	},
	ACCEPTED: {
		letter: "A",
		cls: "bg-info text-surface"
	},
	PREPARING: {
		letter: "P",
		cls: "bg-warn text-surface"
	},
	READY: {
		letter: "R",
		cls: "bg-leaf text-surface"
	},
	RIDER_ASSIGNED: {
		letter: "K",
		cls: "bg-leaf text-surface"
	},
	PICKED_UP: {
		letter: "U",
		cls: "bg-leaf text-surface"
	},
	ON_THE_WAY: {
		letter: "W",
		cls: "bg-leaf text-surface"
	},
	DELIVERED: {
		letter: "D",
		cls: "bg-ink text-surface"
	},
	REJECTED: {
		letter: "X",
		cls: "bg-muted text-surface"
	},
	CANCELLED: {
		letter: "C",
		cls: "bg-muted text-surface"
	}
};
function OrderCard({ order, restaurantId, large, dataLabel, onChanged }) {
	const t = useT();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [rejectOpen, setRejectOpen] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("item_unavailable");
	const [error, setError] = (0, import_react.useState)(null);
	async function act(action) {
		setBusy(true);
		setError(null);
		try {
			await transitionOrder({ data: {
				restaurantId,
				orderId: order.id,
				action,
				reason: action === "reject" ? reason : void 0,
				idempotencyKey: actionKey(order.id, action)
			} });
			clearActionKey(order.id, action);
			setRejectOpen(false);
			onChanged?.();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not update order");
		} finally {
			setBusy(false);
		}
	}
	async function simRider() {
		setBusy(true);
		setError(null);
		try {
			await advanceSimulatedRider({ data: {
				restaurantId,
				orderId: order.id,
				idempotencyKey: actionKey(order.id, "sim_rider")
			} });
			clearActionKey(order.id, "sim_rider");
			onChanged?.();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not advance rider");
		} finally {
			setBusy(false);
		}
	}
	const mark = STATE_MARK[order.state] ?? {
		letter: "•",
		cls: "bg-muted text-surface"
	};
	const received = new Date(order.placedAt);
	const mins = Math.max(0, Math.round((Date.now() - received.getTime()) / 6e4));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("space-y-3", large && "p-5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid size-10 place-items-center rounded-full text-sm font-semibold", mark.cls),
						"aria-label": order.state,
						children: mark.letter
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: order.orderNumber
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted",
						children: [
							t("orders.received"),
							" ",
							mins,
							" ",
							t("common.minutes"),
							" · ",
							order.customerArea ?? "Area hidden"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: t(`status.${order.state}`)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, {
						paise: order.prices.customerTotalPaise,
						className: "text-lg font-semibold"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: order.lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular font-medium",
							children: [line.quantity, "×"]
						}),
						" ",
						line.itemName,
						line.variantName ? ` · ${line.variantName}` : "",
						line.addons?.length ? ` + ${line.addons.map((a) => a.name).join(", ")}` : ""
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-muted",
						children: formatINR(line.unitPricePaise * line.quantity)
					})]
				}, i))
			}),
			order.specialInstructions ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-[12px] bg-warn-soft px-3 py-2 text-sm text-warn",
				children: [
					t("orders.special"),
					": ",
					order.specialInstructions
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-line px-2 py-1",
						children: order.isCod ? t("orders.cod") : t("orders.paid")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full border border-line px-2 py-1",
						children: [
							t("orders.prepTime"),
							" ",
							order.prepMinutes,
							" ",
							t("common.minutes")
						]
					}),
					order.prices.restaurantDiscountPaise > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-chili-soft px-2 py-1 text-chili-dark",
						children: [
							t("orders.restaurantPromo"),
							" ",
							formatINR(order.prices.restaurantDiscountPaise)
						]
					}) : null,
					order.prices.platformFundedDiscountPaise > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-leaf-soft px-2 py-1 text-leaf",
						children: [
							t("orders.platformPromo"),
							" ",
							formatINR(order.prices.platformFundedDiscountPaise)
						]
					}) : null
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			rejectOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-[16px] bg-surface-2 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t("orders.rejectTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: t("orders.rejectHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: REJECT_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: `reject-${order.id}`,
								checked: reason === r,
								onChange: () => setReason(r)
							}), t(`rejectReasons.${r}`)]
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							disabled: busy,
							onClick: () => void act("reject"),
							children: t("orders.reject")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setRejectOpen(false),
							children: t("common.cancel")
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					order.state === "PLACED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: large ? "lg" : "md",
						disabled: busy,
						onClick: () => void act("accept"),
						children: t("orders.accept")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: large ? "lg" : "md",
						variant: "secondary",
						disabled: busy,
						onClick: () => setRejectOpen(true),
						children: t("orders.reject")
					})] }) : null,
					order.state === "ACCEPTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: large ? "lg" : "md",
						disabled: busy,
						onClick: () => void act("preparing"),
						children: t("orders.preparing")
					}) : null,
					order.state === "PREPARING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: large ? "lg" : "md",
						variant: "leaf",
						disabled: busy,
						onClick: () => void act("ready"),
						children: t("orders.ready")
					}) : null,
					dataLabel === "SIMULATED" && [
						"READY",
						"RIDER_ASSIGNED",
						"PICKED_UP",
						"ON_THE_WAY"
					].includes(order.state) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: large ? "lg" : "md",
						variant: "secondary",
						disabled: busy,
						onClick: () => void simRider(),
						children: t("orders.simulateRider")
					}) : null
				]
			})
		]
	});
}
//#endregion
export { OrderCard as t };
