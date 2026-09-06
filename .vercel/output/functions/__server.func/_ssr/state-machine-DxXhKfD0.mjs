//#region node_modules/.nitro/vite/services/ssr/assets/state-machine-DxXhKfD0.js
var ORDER_STATES = [
	"PLACED",
	"ACCEPTED",
	"PREPARING",
	"READY",
	"RIDER_ASSIGNED",
	"PICKED_UP",
	"ON_THE_WAY",
	"DELIVERED",
	"REJECTED",
	"CANCELLED",
	"REFUNDED",
	"PARTIAL_REFUND",
	"FAILED_PAYMENT",
	"DELIVERY_FAILED"
];
var REJECT_REASONS = [
	"item_unavailable",
	"kitchen_overloaded",
	"restaurant_closed",
	"technical_issue",
	"other"
];
var ALLOWED = {
	PLACED: {
		ACCEPTED: ["restaurant", "admin"],
		REJECTED: ["restaurant", "admin"],
		CANCELLED: [
			"customer",
			"admin",
			"system"
		],
		FAILED_PAYMENT: ["system", "admin"]
	},
	ACCEPTED: {
		PREPARING: ["restaurant", "admin"],
		CANCELLED: ["customer", "admin"],
		REJECTED: ["admin"]
	},
	PREPARING: {
		READY: ["restaurant", "admin"],
		CANCELLED: ["customer", "admin"]
	},
	READY: {
		RIDER_ASSIGNED: [
			"rider",
			"admin",
			"system",
			"simulated_rider"
		],
		CANCELLED: ["admin"],
		DELIVERY_FAILED: [
			"rider",
			"admin",
			"system"
		]
	},
	RIDER_ASSIGNED: {
		PICKED_UP: [
			"rider",
			"admin",
			"system",
			"simulated_rider"
		],
		DELIVERY_FAILED: [
			"rider",
			"admin",
			"system"
		],
		CANCELLED: ["admin"]
	},
	PICKED_UP: {
		ON_THE_WAY: [
			"rider",
			"admin",
			"system",
			"simulated_rider"
		],
		DELIVERY_FAILED: [
			"rider",
			"admin",
			"system"
		]
	},
	ON_THE_WAY: {
		DELIVERED: [
			"rider",
			"admin",
			"system",
			"simulated_rider"
		],
		DELIVERY_FAILED: [
			"rider",
			"admin",
			"system"
		]
	},
	DELIVERED: {
		REFUNDED: ["admin", "system"],
		PARTIAL_REFUND: ["admin", "system"]
	},
	REJECTED: {},
	CANCELLED: { REFUNDED: ["admin", "system"] },
	REFUNDED: {},
	PARTIAL_REFUND: { REFUNDED: ["admin", "system"] },
	FAILED_PAYMENT: {},
	DELIVERY_FAILED: {
		REFUNDED: ["admin", "system"],
		CANCELLED: ["admin"]
	}
};
var InvalidTransitionError = class extends Error {
	status = 409;
	from;
	to;
	actor;
	constructor(from, to, actor) {
		super(`Cannot transition ${from} → ${to} as ${actor}`);
		this.name = "InvalidTransitionError";
		this.from = from;
		this.to = to;
		this.actor = actor;
	}
};
function canTransition(from, to, actor) {
	const allowedActors = ALLOWED[from]?.[to];
	return Boolean(allowedActors?.includes(actor));
}
function assertTransition(from, to, actor) {
	if (!canTransition(from, to, actor)) throw new InvalidTransitionError(from, to, actor);
}
function isOrderState(value) {
	return ORDER_STATES.includes(value);
}
function isRejectReason(value) {
	return REJECT_REASONS.includes(value);
}
var SIMULATED_RIDER_NEXT = {
	READY: "RIDER_ASSIGNED",
	RIDER_ASSIGNED: "PICKED_UP",
	PICKED_UP: "ON_THE_WAY",
	ON_THE_WAY: "DELIVERED"
};
//#endregion
export { isRejectReason as a, isOrderState as i, SIMULATED_RIDER_NEXT as n, assertTransition as r, REJECT_REASONS as t };
