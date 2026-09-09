/**
 * Contract for rows written to `rider_dispatch_queue` on READY.
 * Rider Window 3 SimulatedDispatch consumes this shape in SIMULATED mode.
 */

export type RiderDispatchQueueRow = {
  orderId: string;
  restaurantId: string;
  orderNumber: string;
  orderCode: string;
  pickupLat: number | null;
  pickupLng: number | null;
  pickupAddress: string;
  pickupInstructions: string | null;
  readyAt: string;
  status: "queued" | "offered" | "assigned" | "cancelled" | "expired";
  dataLabel: string;
};

export function buildDispatchQueueRow(input: {
  orderId: string;
  restaurantId: string;
  orderNumber: string;
  pickupLat: number | null;
  pickupLng: number | null;
  pickupAddress: string;
  pickupInstructions?: string | null;
  dataLabel: string;
  readyAt?: string;
}): RiderDispatchQueueRow {
  const orderCode =
    input.orderNumber.length >= 4 ? input.orderNumber.slice(-4) : input.orderNumber;
  return {
    orderId: input.orderId,
    restaurantId: input.restaurantId,
    orderNumber: input.orderNumber,
    orderCode,
    pickupLat: input.pickupLat,
    pickupLng: input.pickupLng,
    pickupAddress: input.pickupAddress || "",
    pickupInstructions: input.pickupInstructions ?? null,
    readyAt: input.readyAt ?? new Date().toISOString(),
    status: "queued",
    dataLabel: input.dataLabel,
  };
}

export function isSimulatedDispatchLabel(label: string): boolean {
  return label === "SIMULATED";
}
