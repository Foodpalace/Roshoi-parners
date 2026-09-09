export const ORDER_STATES = [
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
  "DELIVERY_FAILED",
] as const;

export type OrderState = (typeof ORDER_STATES)[number];

export const TERMINAL_STATES: readonly OrderState[] = [
  "DELIVERED",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
  "PARTIAL_REFUND",
  "FAILED_PAYMENT",
  "DELIVERY_FAILED",
];

/** Shared ladder with customer app after place. */
export const MARKETPLACE_TRACK: readonly OrderState[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "RIDER_ASSIGNED",
  "PICKED_UP",
  "ON_THE_WAY",
  "DELIVERED",
];

export const REJECT_REASONS = [
  "item_unavailable",
  "kitchen_overloaded",
  "restaurant_closed",
  "technical_issue",
  "other",
] as const;

export type RejectReason = (typeof REJECT_REASONS)[number];

export type TransitionActor =
  | "restaurant"
  | "customer"
  | "rider"
  | "admin"
  | "system"
  | "simulated_rider";

const ALLOWED: Record<OrderState, Partial<Record<OrderState, TransitionActor[]>>> = {
  PLACED: {
    ACCEPTED: ["restaurant", "admin"],
    REJECTED: ["restaurant", "admin"],
    CANCELLED: ["customer", "admin", "system"],
    FAILED_PAYMENT: ["system", "admin"],
  },
  ACCEPTED: {
    PREPARING: ["restaurant", "admin"],
    CANCELLED: ["customer", "admin"],
    REJECTED: ["admin"],
  },
  PREPARING: {
    READY: ["restaurant", "admin"],
    CANCELLED: ["customer", "admin"],
  },
  READY: {
    RIDER_ASSIGNED: ["rider", "admin", "system", "simulated_rider"],
    CANCELLED: ["admin"],
    DELIVERY_FAILED: ["rider", "admin", "system"],
  },
  RIDER_ASSIGNED: {
    PICKED_UP: ["rider", "admin", "system", "simulated_rider"],
    DELIVERY_FAILED: ["rider", "admin", "system"],
    CANCELLED: ["admin"],
  },
  PICKED_UP: {
    ON_THE_WAY: ["rider", "admin", "system", "simulated_rider"],
    DELIVERY_FAILED: ["rider", "admin", "system"],
  },
  ON_THE_WAY: {
    DELIVERED: ["rider", "admin", "system", "simulated_rider"],
    DELIVERY_FAILED: ["rider", "admin", "system"],
  },
  DELIVERED: {
    REFUNDED: ["admin", "system"],
    PARTIAL_REFUND: ["admin", "system"],
  },
  REJECTED: {},
  CANCELLED: {
    REFUNDED: ["admin", "system"],
  },
  REFUNDED: {},
  PARTIAL_REFUND: {
    REFUNDED: ["admin", "system"],
  },
  FAILED_PAYMENT: {},
  DELIVERY_FAILED: {
    REFUNDED: ["admin", "system"],
    CANCELLED: ["admin"],
  },
};

export class InvalidTransitionError extends Error {
  readonly status = 409;
  readonly from: OrderState;
  readonly to: OrderState;
  readonly actor: TransitionActor;
  constructor(from: OrderState, to: OrderState, actor: TransitionActor) {
    super(`Cannot transition ${from} → ${to} as ${actor}`);
    this.name = "InvalidTransitionError";
    this.from = from;
    this.to = to;
    this.actor = actor;
  }
}

export function canTransition(
  from: OrderState,
  to: OrderState,
  actor: TransitionActor,
): boolean {
  const allowedActors = ALLOWED[from]?.[to];
  return Boolean(allowedActors?.includes(actor));
}

export function assertTransition(
  from: OrderState,
  to: OrderState,
  actor: TransitionActor,
): void {
  if (!canTransition(from, to, actor)) {
    throw new InvalidTransitionError(from, to, actor);
  }
}

export function isOrderState(value: string): value is OrderState {
  return (ORDER_STATES as readonly string[]).includes(value);
}

export function isRejectReason(value: string): value is RejectReason {
  return (REJECT_REASONS as readonly string[]).includes(value);
}

export function isTerminal(state: OrderState): boolean {
  return TERMINAL_STATES.includes(state);
}

export function trackIndex(state: OrderState): number {
  return MARKETPLACE_TRACK.indexOf(state);
}

export const RESTAURANT_NEXT: Partial<Record<OrderState, OrderState>> = {
  PLACED: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
};

export const SIMULATED_RIDER_NEXT: Partial<Record<OrderState, OrderState>> = {
  READY: "RIDER_ASSIGNED",
  RIDER_ASSIGNED: "PICKED_UP",
  PICKED_UP: "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
};
