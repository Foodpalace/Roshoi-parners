import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { a as newId, n as asInt } from "./utils-BZJZXT5Z.mjs";
import { a as percentOf, i as paise, n as formatINR, r as mulBps } from "./money-CtWHgB0v.mjs";
import { a as withVendor, t as createServerRpc } from "./helpers-CucV1oAR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-finance-CxADZvnc.js
function estimatePromotion(input) {
	const n = Math.max(0, Math.trunc(input.assumedOrdersPerDay));
	const aov = paise(input.assumedAovPaise);
	let perOrder = 0;
	if (input.kind === "percent") perOrder = percentOf(aov, input.percentOff ?? 0);
	else if (input.kind === "fixed" || input.kind === "item") perOrder = paise(input.amountPaise ?? 0);
	else if (input.kind === "bogo") perOrder = mulBps(aov, 5e3);
	if (input.maxDiscountPaise != null && perOrder > input.maxDiscountPaise) perOrder = paise(input.maxDiscountPaise);
	const daily = perOrder * n;
	const who = input.funder === "RESTAURANT" ? "restaurant revenue" : "the platform promotion budget";
	return {
		funder: input.funder,
		estimatedDailyCostPaise: daily,
		isEstimate: true,
		narrative: `At ${n} orders/day, this promotion may reduce ${who} by approximately ${formatINR(daily)}. This is an estimate.`
	};
}
var getSettlements_createServerFn_handler = createServerRpc({
	id: "b4a89ad8c279ff3f65672681374676267580eb7b7165cea1a33dfcfdbe3e515d",
	name: "getSettlements",
	filename: "src/lib/server/api-finance.ts"
}, (opts) => getSettlements.__executeServer(opts));
var getSettlements = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getSettlements_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "settlements.view", async (sql, ctx) => {
		const batches = await sql`
        select id, status, period_start::text as period_start, period_end::text as period_end,
               scheduled_for::text as scheduled_for, settled_at::text as settled_at,
               total_payable_paise, data_label
        from settlement_batches
        where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
      `;
		const lines = await sql`
        select sl.id, sl.batch_id, sl.order_id, o.order_number,
               sl.food_value_paise, sl.packing_paise, sl.restaurant_discount_paise,
               sl.platform_funded_discount_paise, sl.commission_paise,
               sl.other_deductions_paise, sl.other_deductions_code,
               sl.refund_adjustment_paise, sl.restaurant_payable_paise
        from settlement_lines sl
        join orders o on o.id = sl.order_id
        where sl.restaurant_id = ${ctx.restaurantId}
        order by o.placed_at desc
      `;
		const current = await sql`
        select coalesce(sum(restaurant_payable_paise),0)::int as amt
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and state = 'DELIVERED'
          and id not in (select order_id from settlement_lines where restaurant_id = ${ctx.restaurantId})
      `;
		return {
			dataLabel: ctx.dataLabel,
			currentPayablePaise: asInt(current[0]?.amt),
			batches: batches.map((b) => ({
				...b,
				totalPayablePaise: asInt(b.total_payable_paise),
				lines: lines.filter((l) => l.batch_id === b.id).map((l) => ({
					...l,
					foodValuePaise: asInt(l.food_value_paise),
					packingPaise: asInt(l.packing_paise),
					restaurantDiscountPaise: asInt(l.restaurant_discount_paise),
					platformFundedDiscountPaise: asInt(l.platform_funded_discount_paise),
					commissionPaise: asInt(l.commission_paise),
					otherDeductionsPaise: asInt(l.other_deductions_paise),
					refundAdjustmentPaise: asInt(l.refund_adjustment_paise),
					restaurantPayablePaise: asInt(l.restaurant_payable_paise)
				}))
			}))
		};
	});
});
var exportSettlementJson_createServerFn_handler = createServerRpc({
	id: "b1d22ffe45f397340c3aa93a7581b535584eff22dbd3d1e1c80a240eec8dc4c6",
	name: "exportSettlementJson",
	filename: "src/lib/server/api-finance.ts"
}, (opts) => exportSettlementJson.__executeServer(opts));
var exportSettlementJson = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(exportSettlementJson_createServerFn_handler, async ({ context, data }) => {
	const payload = await getSettlements({ data: { restaurantId: data.restaurantId } });
	const batch = payload.batches.find((b) => b.id === data.batchId);
	if (!batch) throw new Error("Settlement not found");
	return {
		format: "json",
		apiVersion: "v1",
		dataLabel: payload.dataLabel,
		batch
	};
});
var getPromotions_createServerFn_handler = createServerRpc({
	id: "222ae520961227a0ad7cde97da0fda59ca2967c2184764c7154f1f3ca74607be",
	name: "getPromotions",
	filename: "src/lib/server/api-finance.ts"
}, (opts) => getPromotions.__executeServer(opts));
var getPromotions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getPromotions_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "promotions.view", async (sql, ctx) => {
		const rows = await sql`
        select id, name, funder, kind, percent_off, amount_paise, min_order_paise,
               max_discount_paise, is_active, assumed_orders_per_day,
               starts_at::text as starts_at, ends_at::text as ends_at
        from promotions where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
      `;
		const aov = await sql`
        select coalesce(avg(customer_total_paise) filter (where state = 'DELIVERED'), 35000)::int as aov
        from orders where restaurant_id = ${ctx.restaurantId}
      `;
		return {
			dataLabel: ctx.dataLabel,
			role: ctx.role,
			promotions: rows.map((p) => {
				const estimate = estimatePromotion({
					kind: p.kind,
					funder: p.funder,
					percentOff: p.percent_off ?? 0,
					amountPaise: asInt(p.amount_paise ?? 0),
					assumedOrdersPerDay: asInt(p.assumed_orders_per_day, 10),
					assumedAovPaise: asInt(aov[0]?.aov, 35e3),
					maxDiscountPaise: p.max_discount_paise
				});
				return {
					...p,
					amountPaise: p.amount_paise != null ? asInt(p.amount_paise) : null,
					minOrderPaise: asInt(p.min_order_paise),
					maxDiscountPaise: p.max_discount_paise != null ? asInt(p.max_discount_paise) : null,
					isActive: p.is_active === true || p.is_active === "t",
					estimate
				};
			})
		};
	});
});
var savePromotion_createServerFn_handler = createServerRpc({
	id: "3cd1f44a3d815457bb1c18462e9cbbe76e06ad65a85a9c7dc41482d588a8ec63",
	name: "savePromotion",
	filename: "src/lib/server/api-finance.ts"
}, (opts) => savePromotion.__executeServer(opts));
var savePromotion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(savePromotion_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "promotions.edit", async (sql, ctx) => {
		if (data.amountPaise != null) paise(data.amountPaise);
		if (data.minOrderPaise != null) paise(data.minOrderPaise);
		const name = data.name.trim();
		if (!name) throw new Error("Offer name is required");
		if (data.id) {
			await sql`
          update promotions set
            name = ${name},
            funder = ${data.funder},
            kind = ${data.kind},
            percent_off = ${data.percentOff ?? null},
            amount_paise = ${data.amountPaise ?? null},
            min_order_paise = ${data.minOrderPaise ?? 0},
            max_discount_paise = ${data.maxDiscountPaise ?? null},
            assumed_orders_per_day = ${data.assumedOrdersPerDay ?? 10},
            is_active = ${Boolean(data.isActive)}
          where id = ${data.id} and restaurant_id = ${ctx.restaurantId}
        `;
			return {
				ok: true,
				id: data.id
			};
		}
		const id = newId("pro");
		await sql`
        insert into promotions (
          id, restaurant_id, name, funder, kind, percent_off, amount_paise,
          min_order_paise, max_discount_paise, assumed_orders_per_day, is_active
        ) values (
          ${id}, ${ctx.restaurantId}, ${name}, ${data.funder}, ${data.kind},
          ${data.percentOff ?? null}, ${data.amountPaise ?? null},
          ${data.minOrderPaise ?? 0}, ${data.maxDiscountPaise ?? null},
          ${data.assumedOrdersPerDay ?? 10}, ${Boolean(data.isActive)}
        )
      `;
		return {
			ok: true,
			id
		};
	});
});
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "5ccc90aeb213c330650b3b2aae0688f44acb3bd3b8bbcb2107ccc44f3701f677",
	name: "getAnalytics",
	filename: "src/lib/server/api-finance.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getAnalytics_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "analytics.view", async (sql, ctx) => {
		const range = data.range ?? "week";
		const interval = range === "day" ? "1 day" : range === "month" ? "30 days" : "7 days";
		const summary = await sql`
        select count(*)::int as orders,
               count(*) filter (where state = 'DELIVERED')::int as completed,
               count(*) filter (where state = 'CANCELLED')::int as cancelled,
               count(*) filter (where state = 'REJECTED')::int as rejected,
               coalesce(sum(customer_total_paise) filter (where state = 'DELIVERED'),0)::int as sales,
               coalesce(avg(customer_total_paise) filter (where state = 'DELIVERED'),0)::int as aov
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= now() - ${interval}::interval
      `;
		const items = await sql`
        select oi.item_name as name, sum(oi.quantity)::int as qty,
               sum(oi.line_total_paise)::int as revenue
        from order_items oi
        join orders o on o.id = oi.order_id
        where o.restaurant_id = ${ctx.restaurantId}
          and o.state = 'DELIVERED'
          and o.placed_at >= now() - ${interval}::interval
        group by oi.item_name
        order by qty desc
      `;
		const hours = await sql`
        select extract(hour from placed_at at time zone 'Asia/Kolkata')::int as hour,
               count(*)::int as c
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= now() - ${interval}::interval
        group by 1
        order by 1
      `;
		const prep = await sql`
        select avg(extract(epoch from (ready_at - accepted_at))/60)::int as mins
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and accepted_at is not null and ready_at is not null
          and placed_at >= now() - ${interval}::interval
      `;
		const promo = await sql`
        select count(*)::int as orders,
               coalesce(sum(restaurant_discount_paise),0)::int as rest,
               coalesce(sum(platform_funded_discount_paise),0)::int as plat
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= now() - ${interval}::interval
          and (restaurant_discount_paise > 0 or platform_funded_discount_paise > 0)
      `;
		return {
			dataKind: ctx.dataLabel === "SIMULATED" ? "SIMULATED DATA" : "REAL DATA",
			dataLabel: ctx.dataLabel,
			range,
			summary: {
				orders: asInt(summary[0]?.orders),
				completed: asInt(summary[0]?.completed),
				cancelled: asInt(summary[0]?.cancelled),
				rejected: asInt(summary[0]?.rejected),
				salesPaise: asInt(summary[0]?.sales),
				aovPaise: asInt(summary[0]?.aov)
			},
			items: items.map((i) => ({
				name: i.name,
				qty: asInt(i.qty),
				revenuePaise: asInt(i.revenue)
			})),
			hours: hours.map((h) => ({
				hour: asInt(h.hour),
				orders: asInt(h.c)
			})),
			avgPrepMinutes: prep[0]?.mins != null ? asInt(prep[0].mins) : null,
			promotions: {
				orders: asInt(promo[0]?.orders),
				restaurantFundedPaise: asInt(promo[0]?.rest),
				platformFundedPaise: asInt(promo[0]?.plat)
			}
		};
	});
});
//#endregion
export { exportSettlementJson_createServerFn_handler, getAnalytics_createServerFn_handler, getPromotions_createServerFn_handler, getSettlements_createServerFn_handler, savePromotion_createServerFn_handler };
