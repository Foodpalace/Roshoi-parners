import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertTransition,
  canTransition,
  InvalidTransitionError,
} from "./state-machine.ts";

describe("order state machine", () => {
  it("allows the happy path", () => {
    assert.equal(canTransition("PLACED", "ACCEPTED", "restaurant"), true);
    assert.equal(canTransition("ACCEPTED", "PREPARING", "restaurant"), true);
    assert.equal(canTransition("PREPARING", "READY", "restaurant"), true);
    assert.equal(canTransition("READY", "RIDER_ASSIGNED", "simulated_rider"), true);
    assert.equal(canTransition("ON_THE_WAY", "DELIVERED", "rider"), true);
  });

  it("rejects impossible jumps", () => {
    assert.equal(canTransition("PLACED", "READY", "restaurant"), false);
    assert.equal(canTransition("PLACED", "DELIVERED", "restaurant"), false);
    assert.equal(canTransition("DELIVERED", "PLACED", "restaurant"), false);
    assert.throws(
      () => assertTransition("PREPARING", "ACCEPTED", "restaurant"),
      InvalidTransitionError,
    );
  });

  it("does not let the restaurant assign a rider", () => {
    assert.equal(canTransition("READY", "RIDER_ASSIGNED", "restaurant"), false);
  });

  it("requires restaurant or admin to reject a placed order", () => {
    assert.equal(canTransition("PLACED", "REJECTED", "restaurant"), true);
    assert.equal(canTransition("PLACED", "REJECTED", "rider"), false);
  });
});
