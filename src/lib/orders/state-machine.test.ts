import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertTransition,
  canTransition,
  isTerminal,
  MARKETPLACE_TRACK,
  RESTAURANT_NEXT,
  SIMULATED_RIDER_NEXT,
  trackIndex,
} from "./state-machine.ts";

describe("partner order state machine", () => {
  it("restaurant happy path", () => {
    assert.equal(canTransition("PLACED", "ACCEPTED", "restaurant"), true);
    assert.equal(canTransition("ACCEPTED", "PREPARING", "restaurant"), true);
    assert.equal(canTransition("PREPARING", "READY", "restaurant"), true);
    assert.equal(RESTAURANT_NEXT.PLACED, "ACCEPTED");
  });

  it("blocks customer from accepting", () => {
    assert.equal(canTransition("PLACED", "ACCEPTED", "customer"), false);
  });

  it("simulated rider completes after READY", () => {
    let state: keyof typeof SIMULATED_RIDER_NEXT | "DELIVERED" = "READY";
    while (state !== "DELIVERED") {
      const next = SIMULATED_RIDER_NEXT[state as keyof typeof SIMULATED_RIDER_NEXT];
      assert.ok(next, `missing sim step from ${state}`);
      assertTransition(state as "READY", next, "simulated_rider");
      state = next as typeof state;
    }
  });

  it("track + terminal helpers", () => {
    assert.equal(trackIndex("PLACED"), 0);
    assert.equal(trackIndex("DELIVERED"), MARKETPLACE_TRACK.length - 1);
    assert.equal(isTerminal("DELIVERED"), true);
    assert.equal(isTerminal("READY"), false);
  });
});
