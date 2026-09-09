import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDispatchQueueRow,
  isSimulatedDispatchLabel,
} from "./queue-contract.ts";

describe("dispatch queue contract", () => {
  it("builds queued row with order code tail", () => {
    const row = buildDispatchQueueRow({
      orderId: "ord_x",
      restaurantId: "rst_x",
      orderNumber: "ROS-1042",
      pickupLat: 24.87,
      pickupLng: 92.35,
      pickupAddress: "Station Road",
      dataLabel: "SIMULATED",
    });
    assert.equal(row.status, "queued");
    assert.equal(row.orderCode, "1042");
    assert.equal(row.dataLabel, "SIMULATED");
    assert.equal(isSimulatedDispatchLabel(row.dataLabel), true);
  });

  it("marks real labels as not simulated", () => {
    assert.equal(isSimulatedDispatchLabel("REAL"), false);
  });
});
