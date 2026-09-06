//#region node_modules/.nitro/vite/services/ssr/assets/money-CtWHgB0v.js
var MoneyError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "MoneyError";
	}
};
function assertPaise(value, label = "amount") {
	if (typeof value !== "number" || !Number.isInteger(value) || !Number.isSafeInteger(value)) throw new MoneyError(`${label} must be a safe integer number of paise`);
	return value;
}
function paise(value) {
	return assertPaise(value);
}
/** Convert a rupee decimal collected at an input boundary into paise. */
function rupeesToPaise(rupees) {
	if (!Number.isFinite(rupees)) throw new MoneyError("rupees must be finite");
	return Math.round(rupees * 100);
}
function paiseToRupeeParts(amount) {
	const v = assertPaise(amount);
	const sign = v < 0 ? "-" : "";
	const abs = Math.abs(v);
	return {
		sign,
		rupees: Math.floor(abs / 100),
		paise: abs % 100
	};
}
function formatINR(amount) {
	const { sign, rupees, paise: p } = paiseToRupeeParts(amount);
	return `${sign}₹${rupees.toLocaleString("en-IN")}.${String(p).padStart(2, "0")}`;
}
function addPaise(...amounts) {
	let total = 0;
	for (const a of amounts) {
		total += assertPaise(a);
		if (!Number.isSafeInteger(total)) throw new MoneyError("paise overflow");
	}
	return total;
}
function subPaise(left, right) {
	const result = assertPaise(left) - assertPaise(right);
	if (!Number.isSafeInteger(result)) throw new MoneyError("paise overflow");
	return result;
}
function mulBps(amount, bps) {
	assertPaise(amount, "amount");
	if (!Number.isInteger(bps)) throw new MoneyError("bps must be an integer");
	const prod = amount * bps;
	if (!Number.isSafeInteger(prod)) throw new MoneyError("commission overflow");
	const abs = Math.abs(prod);
	const rounded = Math.floor(abs / 1e4) + (abs % 1e4 >= 5e3 ? 1 : 0);
	return prod < 0 ? -rounded : rounded;
}
function percentOf(amount, percent) {
	if (!Number.isInteger(percent)) throw new MoneyError("percent must be an integer");
	return mulBps(amount, percent * 100);
}
/**
* ORDER VALUE − restaurant discount − commission − other permitted deductions
* + platform-funded promotion ± refunds/adjustments = restaurant payable.
* Other deductions require an explicit reason code.
*/
function computeRestaurantPayable(input) {
	const food = assertPaise(input.foodValuePaise, "foodValuePaise");
	const packing = assertPaise(input.packingPaise, "packingPaise");
	const restDisc = assertPaise(input.restaurantDiscountPaise, "restaurantDiscountPaise");
	const platDisc = assertPaise(input.platformFundedDiscountPaise, "platformFundedDiscountPaise");
	const other = assertPaise(input.otherDeductionsPaise ?? 0, "otherDeductionsPaise");
	const refund = assertPaise(input.refundAdjustmentPaise ?? 0, "refundAdjustmentPaise");
	if (other !== 0 && !input.otherDeductionsCode) throw new MoneyError("other deductions require an explicit reason code");
	const taxableBase = subPaise(addPaise(food, packing), restDisc);
	const commission = mulBps(taxableBase < 0 ? 0 : taxableBase, input.commissionBps);
	const payable = addPaise(taxableBase, -commission, -other, platDisc, refund);
	return {
		foodValuePaise: food,
		packingPaise: packing,
		restaurantDiscountPaise: restDisc,
		platformFundedDiscountPaise: platDisc,
		commissionPaise: commission,
		otherDeductionsPaise: other,
		otherDeductionsCode: input.otherDeductionsCode ?? null,
		refundAdjustmentPaise: refund,
		restaurantPayablePaise: payable
	};
}
//#endregion
export { percentOf as a, paise as i, formatINR as n, rupeesToPaise as o, mulBps as r, computeRestaurantPayable as t };
