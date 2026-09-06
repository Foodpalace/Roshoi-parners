import { formatINR, mulBps, paise, percentOf, type Paise } from "../money.ts";
import type { PromotionKind } from "../contracts/index.ts";

export type PromotionEstimateInput = {
  kind: PromotionKind;
  funder: "RESTAURANT" | "PLATFORM";
  percentOff?: number;
  amountPaise?: Paise;
  assumedOrdersPerDay: number;
  assumedAovPaise: Paise;
  maxDiscountPaise?: Paise | null;
};

export type PromotionEstimate = {
  funder: "RESTAURANT" | "PLATFORM";
  estimatedDailyCostPaise: Paise;
  narrative: string;
  isEstimate: true;
};

export function estimatePromotion(input: PromotionEstimateInput): PromotionEstimate {
  const n = Math.max(0, Math.trunc(input.assumedOrdersPerDay));
  const aov = paise(input.assumedAovPaise);
  let perOrder: Paise = 0;
  if (input.kind === "percent") {
    perOrder = percentOf(aov, input.percentOff ?? 0);
  } else if (input.kind === "fixed" || input.kind === "item") {
    perOrder = paise(input.amountPaise ?? 0);
  } else if (input.kind === "bogo") {
    perOrder = mulBps(aov, 5000);
  }
  if (input.maxDiscountPaise != null && perOrder > input.maxDiscountPaise) {
    perOrder = paise(input.maxDiscountPaise);
  }
  const daily = perOrder * n;
  const who =
    input.funder === "RESTAURANT" ? "restaurant revenue" : "the platform promotion budget";
  return {
    funder: input.funder,
    estimatedDailyCostPaise: daily,
    isEstimate: true,
    narrative: `At ${n} orders/day, this promotion may reduce ${who} by approximately ${formatINR(daily)}. This is an estimate.`,
  };
}
