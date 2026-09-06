import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addPaise,
  assertPaise,
  computeRestaurantPayable,
  formatINR,
  mulBps,
  rupeesToPaise,
} from "./money.ts";

describe("money", () => {
  it("rejects floating point paise", () => {
    assert.throws(() => assertPaise(10.5));
  });

  it("formats INR from integer paise", () => {
    assert.equal(formatINR(50000), "₹500.00");
    assert.equal(formatINR(45), "₹0.45");
    assert.equal(formatINR(-120050), "-₹1,200.50");
  });

  it("converts rupees at the boundary only", () => {
    assert.equal(rupeesToPaise(12.34), 1234);
  });

  it("computes 10% commission in integer paise", () => {
    const s = computeRestaurantPayable({
      foodValuePaise: 50000,
      packingPaise: 0,
      restaurantDiscountPaise: 5000,
      platformFundedDiscountPaise: 0,
      commissionBps: 1000,
    });
    assert.equal(s.commissionPaise, 4500);
    assert.equal(s.restaurantPayablePaise, 40500);
  });

  it("adds platform-funded discount to restaurant payable", () => {
    const s = computeRestaurantPayable({
      foodValuePaise: 50000,
      packingPaise: 0,
      restaurantDiscountPaise: 0,
      platformFundedDiscountPaise: 10000,
      commissionBps: 1000,
    });
    assert.equal(s.commissionPaise, 5000);
    assert.equal(s.restaurantPayablePaise, 55000);
  });

  it("refuses unnamed other deductions", () => {
    assert.throws(() =>
      computeRestaurantPayable({
        foodValuePaise: 10000,
        packingPaise: 0,
        restaurantDiscountPaise: 0,
        platformFundedDiscountPaise: 0,
        commissionBps: 1000,
        otherDeductionsPaise: 100,
      }),
    );
  });

  it("adds only integers", () => {
    assert.equal(addPaise(1, 2, 3), 6);
    assert.throws(() => addPaise(1.2 as number));
  });

  it("rounds half away from zero on bps", () => {
    assert.equal(mulBps(100, 1000), 10);
    assert.equal(mulBps(15, 1000), 2);
  });
});
