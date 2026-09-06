import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertSameRestaurant, IsolationError } from "../isolation-guard.ts";
import { can } from "../rbac.ts";

describe("data isolation", () => {
  it("denies Restaurant A reading Restaurant B", () => {
    assert.throws(
      () => assertSameRestaurant("rest_a", "rest_b"),
      IsolationError,
    );
  });

  it("allows the owning restaurant", () => {
    assert.doesNotThrow(() => assertSameRestaurant("rest_a", "rest_a"));
  });

  it("staff of A cannot use owner-only finance of anyone, including A", () => {
    assert.equal(can("STAFF", "settings.financial"), false);
    assert.equal(can("STAFF", "settlements.view"), false);
  });
});
