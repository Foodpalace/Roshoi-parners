import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estimatePromotion } from "./estimate.ts";

describe("promotion estimate", () => {
  it("keeps restaurant-funded and platform-funded separate", () => {
    const rest = estimatePromotion({
      kind: "fixed",
      funder: "RESTAURANT",
      amountPaise: 5000,
      assumedOrdersPerDay: 10,
      assumedAovPaise: 40000,
    });
    const plat = estimatePromotion({
      kind: "fixed",
      funder: "PLATFORM",
      amountPaise: 5000,
      assumedOrdersPerDay: 10,
      assumedAovPaise: 40000,
    });
    assert.equal(rest.funder, "RESTAURANT");
    assert.equal(plat.funder, "PLATFORM");
    assert.equal(rest.estimatedDailyCostPaise, 50000);
    assert.equal(plat.estimatedDailyCostPaise, 50000);
    assert.match(rest.narrative, /estimate/i);
    assert.match(plat.narrative, /platform/i);
  });
});
