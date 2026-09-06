/**
 * Integer-paise money. Never use floating-point for INR amounts.
 * 1 rupee = 100 paise. All persisted financial values are integer paise.
 */

export type Paise = number;

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}

export function assertPaise(value: unknown, label = "amount"): Paise {
  if (typeof value !== "number" || !Number.isInteger(value) || !Number.isSafeInteger(value)) {
    throw new MoneyError(`${label} must be a safe integer number of paise`);
  }
  return value;
}

export function paise(value: number): Paise {
  return assertPaise(value);
}

/** Convert a rupee decimal collected at an input boundary into paise. */
export function rupeesToPaise(rupees: number): Paise {
  if (!Number.isFinite(rupees)) throw new MoneyError("rupees must be finite");
  return Math.round(rupees * 100);
}

export function paiseToRupeeParts(amount: Paise): { sign: string; rupees: number; paise: number } {
  const v = assertPaise(amount);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  return { sign, rupees: Math.floor(abs / 100), paise: abs % 100 };
}

export function formatINR(amount: Paise): string {
  const { sign, rupees, paise: p } = paiseToRupeeParts(amount);
  return `${sign}₹${rupees.toLocaleString("en-IN")}.${String(p).padStart(2, "0")}`;
}

export function addPaise(...amounts: Paise[]): Paise {
  let total = 0;
  for (const a of amounts) {
    total += assertPaise(a);
    if (!Number.isSafeInteger(total)) throw new MoneyError("paise overflow");
  }
  return total;
}

export function subPaise(left: Paise, right: Paise): Paise {
  const result = assertPaise(left) - assertPaise(right);
  if (!Number.isSafeInteger(result)) throw new MoneyError("paise overflow");
  return result;
}

export function mulBps(amount: Paise, bps: number): Paise {
  assertPaise(amount, "amount");
  if (!Number.isInteger(bps)) throw new MoneyError("bps must be an integer");
  // Round half away from zero on the paise result of amount * bps / 10000.
  const prod = amount * bps;
  if (!Number.isSafeInteger(prod)) throw new MoneyError("commission overflow");
  const abs = Math.abs(prod);
  const q = Math.floor(abs / 10000);
  const r = abs % 10000;
  const rounded = q + (r >= 5000 ? 1 : 0);
  return prod < 0 ? -rounded : rounded;
}

export function percentOf(amount: Paise, percent: number): Paise {
  if (!Number.isInteger(percent)) throw new MoneyError("percent must be an integer");
  return mulBps(amount, percent * 100);
}

export type SettlementBreakdown = {
  foodValuePaise: Paise;
  packingPaise: Paise;
  restaurantDiscountPaise: Paise;
  platformFundedDiscountPaise: Paise;
  commissionPaise: Paise;
  otherDeductionsPaise: Paise;
  otherDeductionsCode: string | null;
  refundAdjustmentPaise: Paise;
  restaurantPayablePaise: Paise;
};

/**
 * ORDER VALUE − restaurant discount − commission − other permitted deductions
 * + platform-funded promotion ± refunds/adjustments = restaurant payable.
 * Other deductions require an explicit reason code.
 */
export function computeRestaurantPayable(input: {
  foodValuePaise: Paise;
  packingPaise: Paise;
  restaurantDiscountPaise: Paise;
  platformFundedDiscountPaise: Paise;
  commissionBps: number;
  otherDeductionsPaise?: Paise;
  otherDeductionsCode?: string | null;
  refundAdjustmentPaise?: Paise;
}): SettlementBreakdown {
  const food = assertPaise(input.foodValuePaise, "foodValuePaise");
  const packing = assertPaise(input.packingPaise, "packingPaise");
  const restDisc = assertPaise(input.restaurantDiscountPaise, "restaurantDiscountPaise");
  const platDisc = assertPaise(
    input.platformFundedDiscountPaise,
    "platformFundedDiscountPaise",
  );
  const other = assertPaise(input.otherDeductionsPaise ?? 0, "otherDeductionsPaise");
  const refund = assertPaise(input.refundAdjustmentPaise ?? 0, "refundAdjustmentPaise");

  if (other !== 0 && !input.otherDeductionsCode) {
    throw new MoneyError("other deductions require an explicit reason code");
  }

  const orderValue = addPaise(food, packing);
  const taxableBase = subPaise(orderValue, restDisc);
  const commission = mulBps(taxableBase < 0 ? 0 : taxableBase, input.commissionBps);
  const payable = addPaise(
    taxableBase,
    -commission,
    -other,
    platDisc,
    refund,
  );

  return {
    foodValuePaise: food,
    packingPaise: packing,
    restaurantDiscountPaise: restDisc,
    platformFundedDiscountPaise: platDisc,
    commissionPaise: commission,
    otherDeductionsPaise: other,
    otherDeductionsCode: input.otherDeductionsCode ?? null,
    refundAdjustmentPaise: refund,
    restaurantPayablePaise: payable,
  };
}
