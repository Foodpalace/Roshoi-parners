import type { RiderDispatchTicket } from "@/lib/contracts";

/**
 * Window 3 (rider) integration. When an order becomes READY we enqueue a
 * pickup ticket. The rider system is not connected in this window.
 */
export const dispatchAdapter = {
  connected: false as const,
  provider: "NOT_CONNECTED" as const,
};

export type DispatchQueueRow = RiderDispatchTicket & {
  status: "queued" | "claimed" | "cancelled";
  queuedAt: string;
};
