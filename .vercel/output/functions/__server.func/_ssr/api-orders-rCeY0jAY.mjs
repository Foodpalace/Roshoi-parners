import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { a as newId, n as asInt, r as asIso } from "./utils-BZJZXT5Z.mjs";
import { a as withVendor, i as notifyInApp, o as writeAudit, t as createServerRpc } from "./helpers-CucV1oAR.mjs";
import { a as isRejectReason, i as isOrderState, n as SIMULATED_RIDER_NEXT, r as assertTransition } from "./state-machine-DxXhKfD0.mjs";
import { i as minutesUntilClose, n as isOpenAt } from "./hours-CQlwh30e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-orders-rCeY0jAY.js
function mapOrder(row, lines, events) {
	return {
		id: row.id,
		orderNumber: row.order_number,
		restaurantId: row.restaurant_id,
		outletId: row.outlet_id,
		state: row.state,
		placedAt: asIso(row.placed_at),
		customerArea: row.customer_area,
		paymentMethod: row.payment_method,
		isCod: row.is_cod === true || row.is_cod === "t",
		specialInstructions: row.special_instructions,
		prepMinutes: asInt(row.prep_minutes),
		rejectReason: row.reject_reason,
		dataLabel: row.data_label,
		prices: {
			foodValuePaise: asInt(row.food_value_paise),
			packingPaise: asInt(row.packing_paise),
			restaurantDiscountPaise: asInt(row.restaurant_discount_paise),
			platformFundedDiscountPaise: asInt(row.platform_funded_discount_paise),
			taxPaise: asInt(row.tax_paise),
			platformFeePaise: asInt(row.platform_fee_paise),
			commissionBps: asInt(row.commission_bps),
			commissionPaise: asInt(row.commission_paise),
			otherDeductionsPaise: asInt(row.other_deductions_paise),
			otherDeductionsCode: row.other_deductions_code,
			refundAdjustmentPaise: asInt(row.refund_adjustment_paise),
			restaurantPayablePaise: asInt(row.restaurant_payable_paise),
			customerTotalPaise: asInt(row.customer_total_paise)
		},
		lines,
		events
	};
}
var listOrders_createServerFn_handler = createServerRpc({
	id: "c8c37c09ba07ecfe2b47463f962436c7847d47e407b9d51f39b43b3139795738",
	name: "listOrders",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listOrders_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "orders.view", async (sql, ctx) => {
		const scope = data.scope ?? "live";
		const rows = await sql`
        select * from orders
        where restaurant_id = ${ctx.restaurantId}
          and (
            ${scope} = 'all'
            or (${scope} = 'live' and state not in ('DELIVERED','REJECTED','CANCELLED','REFUNDED','FAILED_PAYMENT'))
            or (${scope} = 'history' and state in ('DELIVERED','REJECTED','CANCELLED','REFUNDED','FAILED_PAYMENT','DELIVERY_FAILED','PARTIAL_REFUND'))
          )
        order by placed_at desc
        limit 80
      `;
		const ids = rows.map((r) => r.id);
		const lines = ids.length === 0 ? [] : await sql.query(`select id, order_id, item_name, variant_name, quantity, unit_price_paise, line_total_paise, special_instructions
               from order_items where restaurant_id = $1 and order_id in (${ids.map((_, i) => `$${i + 2}`).join(",")})`, [ctx.restaurantId, ...ids]);
		const addons = lines.length === 0 ? [] : await sql.query(`select order_item_id, name, price_paise from order_item_addons where order_item_id in (${lines.map((_, i) => `$${i + 1}`).join(",")})`, lines.map((l) => l.id));
		const events = ids.length === 0 ? [] : await sql.query(`select id, order_id, previous_state, new_state, actor, reason, at::text as at
               from order_events where restaurant_id = $1 and order_id in (${ids.map((_, i) => `$${i + 2}`).join(",")})
               order by at asc`, [ctx.restaurantId, ...ids]);
		const linesByOrder = /* @__PURE__ */ new Map();
		for (const line of lines) {
			const list = linesByOrder.get(line.order_id) ?? [];
			list.push({
				id: line.id,
				itemName: line.item_name,
				variantName: line.variant_name,
				quantity: asInt(line.quantity),
				unitPricePaise: asInt(line.unit_price_paise),
				lineTotalPaise: asInt(line.line_total_paise),
				specialInstructions: line.special_instructions,
				addons: addons.filter((a) => a.order_item_id === line.id).map((a) => ({
					name: a.name,
					pricePaise: asInt(a.price_paise)
				}))
			});
			linesByOrder.set(line.order_id, list);
		}
		const eventsByOrder = /* @__PURE__ */ new Map();
		for (const ev of events) {
			const list = eventsByOrder.get(ev.order_id) ?? [];
			list.push({
				id: ev.id,
				previousState: ev.previous_state,
				newState: ev.new_state,
				actor: ev.actor,
				reason: ev.reason,
				at: asIso(ev.at)
			});
			eventsByOrder.set(ev.order_id, list);
		}
		return {
			restaurantId: ctx.restaurantId,
			dataLabel: ctx.dataLabel,
			role: ctx.role,
			serverTime: (/* @__PURE__ */ new Date()).toISOString(),
			orders: rows.map((r) => mapOrder(r, linesByOrder.get(r.id) ?? [], eventsByOrder.get(r.id) ?? []))
		};
	});
});
var transitionOrder_createServerFn_handler = createServerRpc({
	id: "5569ef6de87d66d0c31f7774a5a299e351ec275421056a6dedfaecd46e62204e",
	name: "transitionOrder",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => transitionOrder.__executeServer(opts));
var transitionOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(transitionOrder_createServerFn_handler, async ({ context, data }) => {
	const perm = data.action === "accept" ? "orders.accept" : data.action === "reject" ? "orders.reject" : data.action === "preparing" ? "orders.prepare" : "orders.ready";
	return withVendor(context.userId, data.restaurantId, perm, async (sql, ctx) => {
		if (!data.idempotencyKey || data.idempotencyKey.length < 8) throw new Error("Idempotency key required");
		const prior = await sql`
        select response_json from idempotency_keys
        where restaurant_id = ${ctx.restaurantId}
          and action = ${data.action}
          and key = ${data.idempotencyKey}
        limit 1
      `;
		if (prior[0]) return JSON.parse(prior[0].response_json);
		const order = (await sql`
        select id, state from orders
        where id = ${data.orderId} and restaurant_id = ${ctx.restaurantId}
        limit 1
      `)[0];
		if (!order) throw new Error("Order not found");
		if (!isOrderState(order.state)) throw new Error("Corrupt order state");
		const to = {
			accept: "ACCEPTED",
			reject: "REJECTED",
			preparing: "PREPARING",
			ready: "READY"
		}[data.action];
		const actor = "restaurant";
		assertTransition(order.state, to, actor);
		if (data.action === "reject") {
			if (!data.reason || !isRejectReason(data.reason)) throw new Error("A valid reject reason is required");
		}
		await sql`
        update orders
        set state = ${to},
            reject_reason = ${data.action === "reject" ? data.reason ?? null : null},
            accepted_at = case when ${to} = 'ACCEPTED' then now() else accepted_at end,
            ready_at = case when ${to} = 'READY' then now() else ready_at end
        where id = ${order.id} and restaurant_id = ${ctx.restaurantId} and state = ${order.state}
      `;
		await sql`
        insert into order_events (id, order_id, restaurant_id, previous_state, new_state, actor, actor_user_id, reason)
        values (
          ${newId("evt")}, ${order.id}, ${ctx.restaurantId}, ${order.state}, ${to},
          ${actor}, ${context.userId}, ${data.reason ?? null}
        )
      `;
		if (to === "READY") {
			const m = (await sql`
          select o.order_number, coalesce(r.address,'') as address, r.lat, r.lng, o.data_label
          from orders o join restaurants r on r.id = o.restaurant_id
          where o.id = ${order.id}
        `)[0];
			if (m) await sql`
            insert into rider_dispatch_queue (
              order_id, restaurant_id, order_number, order_code, pickup_lat, pickup_lng,
              pickup_address, ready_at, status, data_label
            ) values (
              ${order.id}, ${ctx.restaurantId}, ${m.order_number}, ${m.order_number.slice(-4)},
              ${m.lat}, ${m.lng}, ${m.address}, now(), 'queued', ${m.data_label}
            )
            on conflict (order_id) do update set status = 'queued', ready_at = now()
          `;
		}
		await writeAudit(sql, {
			restaurantId: ctx.restaurantId,
			actorUserId: context.userId,
			action: `order_${data.action}`,
			entityType: "order",
			entityId: order.id,
			detail: `${order.state}→${to}`
		});
		await notifyInApp(sql, {
			restaurantId: ctx.restaurantId,
			type: "order_status",
			title: to,
			body: `${order.state} → ${to}`
		});
		const result = {
			ok: true,
			state: to,
			duplicate: false,
			dispatchQueued: to === "READY"
		};
		await sql`
        insert into idempotency_keys (key, restaurant_id, action, response_json)
        values (${data.idempotencyKey}, ${ctx.restaurantId}, ${data.action}, ${JSON.stringify(result)})
      `;
		return result;
	});
});
var advanceSimulatedRider_createServerFn_handler = createServerRpc({
	id: "1b734824599414618d62e0e2a27f257918eabfd5fad2b14500ff2f024a5be314",
	name: "advanceSimulatedRider",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => advanceSimulatedRider.__executeServer(opts));
var advanceSimulatedRider = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(advanceSimulatedRider_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "orders.view", async (sql, ctx) => {
		if (ctx.dataLabel !== "SIMULATED") throw new Error("Rider simulation is only available on labelled SIMULATED kitchens.");
		const prior = await sql`
        select response_json from idempotency_keys
        where restaurant_id = ${ctx.restaurantId} and action = 'sim_rider' and key = ${data.idempotencyKey}
        limit 1
      `;
		if (prior[0]) return JSON.parse(prior[0].response_json);
		const order = (await sql`
        select id, state from orders where id = ${data.orderId} and restaurant_id = ${ctx.restaurantId}
      `)[0];
		if (!order || !isOrderState(order.state)) throw new Error("Order not found");
		const next = SIMULATED_RIDER_NEXT[order.state];
		if (!next) throw new Error("No simulated rider step from this state");
		assertTransition(order.state, next, "simulated_rider");
		await sql`
        update orders set state = ${next},
          delivered_at = case when ${next} = 'DELIVERED' then now() else delivered_at end
        where id = ${order.id} and restaurant_id = ${ctx.restaurantId}
      `;
		await sql`
        insert into order_events (id, order_id, restaurant_id, previous_state, new_state, actor, actor_user_id, reason)
        values (${newId("evt")}, ${order.id}, ${ctx.restaurantId}, ${order.state}, ${next}, 'simulated_rider', ${context.userId}, 'SIMULATED')
      `;
		const result = {
			ok: true,
			state: next,
			simulated: true
		};
		await sql`
        insert into idempotency_keys (key, restaurant_id, action, response_json)
        values (${data.idempotencyKey}, ${ctx.restaurantId}, 'sim_rider', ${JSON.stringify(result)})
      `;
		return result;
	});
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "45eecb9802db3a8af9d742694b69311436aa7d0ce13249e32932ee78afc3bab7",
	name: "getDashboard",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getDashboard_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "dashboard.view", async (sql, ctx) => {
		const stats = await sql`
        select
          count(*)::int as orders,
          coalesce(sum(customer_total_paise) filter (where state not in ('REJECTED','CANCELLED','FAILED_PAYMENT')), 0)::int as sales,
          count(*) filter (where state in ('ACCEPTED','PREPARING','READY','RIDER_ASSIGNED','PICKED_UP','ON_THE_WAY','DELIVERED'))::int as accepted,
          count(*) filter (where state = 'PLACED')::int as pending,
          count(*) filter (where state = 'CANCELLED')::int as cancelled,
          coalesce(sum(refund_adjustment_paise), 0)::int as refunds,
          coalesce(sum(restaurant_payable_paise) filter (where state = 'DELIVERED'), 0)::int as payable,
          coalesce(avg(customer_total_paise) filter (where state = 'DELIVERED'), 0)::int as aov
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= date_trunc('day', now())
      `;
		const unavailable = await sql`
        select count(*)::int as c from item_availability a
        join items i on i.id = a.item_id
        where a.restaurant_id = ${ctx.restaurantId} and a.status <> 'available' and i.is_active = true
      `;
		const rating = await sql`
        select avg(rating)::float as avg, count(*)::int as n
        from reviews where restaurant_id = ${ctx.restaurantId}
      `;
		const delayed = await sql`
        select count(*)::int as c from orders
        where restaurant_id = ${ctx.restaurantId}
          and state in ('ACCEPTED','PREPARING')
          and placed_at < now() - (prep_minutes || ' minutes')::interval
      `;
		const hours = await sql`
        select weekday, open_minutes, close_minutes from restaurant_hours
        where restaurant_id = ${ctx.restaurantId}
      `;
		const r = (await sql`
        select emergency_closed, vacation_mode, admin_hours_override, weekly_holidays,
               verification_status, fssai_number
        from restaurants where id = ${ctx.restaurantId}
      `)[0];
		const shifts = hours.map((h) => ({
			weekday: h.weekday,
			openMinutes: h.open_minutes,
			closeMinutes: h.close_minutes
		}));
		const holidays = (r?.weekly_holidays ?? "").split(",").map((x) => Number(x.trim())).filter((n) => n >= 0 && n <= 6);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const open = r ? isOpenAt({
			nowIso,
			shifts,
			closures: [],
			weeklyHolidays: holidays,
			emergencyClosed: r.emergency_closed === true || r.emergency_closed === "t",
			adminOverride: r.admin_hours_override === true
		}) : false;
		const untilClose = minutesUntilClose({
			nowIso,
			shifts
		});
		const s = stats[0];
		const attention = [];
		if (asInt(s?.pending) > 0) attention.push({
			id: "pending",
			key: "dashboard.attnPending",
			n: asInt(s?.pending),
			tone: "danger"
		});
		if (asInt(unavailable[0]?.c) > 0) attention.push({
			id: "unavail",
			key: "dashboard.attnUnavailable",
			n: asInt(unavailable[0]?.c),
			tone: "warn"
		});
		if (open && untilClose != null && untilClose <= 30) attention.push({
			id: "close",
			key: "dashboard.attnClosing",
			n: untilClose,
			tone: "warn"
		});
		if (r && r.verification_status !== "VERIFIED") attention.push({
			id: "verify",
			key: "dashboard.attnVerify",
			status: r.verification_status,
			tone: "info"
		});
		if (r && !r.fssai_number) attention.push({
			id: "fssai",
			key: "dashboard.attnFssai",
			tone: "warn"
		});
		if (asInt(delayed[0]?.c) > 0) attention.push({
			id: "delay",
			key: "dashboard.attnDelay",
			n: asInt(delayed[0]?.c),
			tone: "danger"
		});
		const pendingSettle = await sql`
        select count(*)::int as c, coalesce(sum(total_payable_paise),0)::int as amt
        from settlement_batches
        where restaurant_id = ${ctx.restaurantId} and status = 'pending'
      `;
		if (asInt(pendingSettle[0]?.c) > 0) attention.push({
			id: "settle",
			key: "dashboard.attnSettle",
			tone: "info"
		});
		const cust = (await sql`
        select count(distinct customer_ref)::int as c,
               count(distinct customer_ref) filter (where cnt > 1)::int as repeats
        from (
          select customer_ref, count(*) as cnt
          from orders
          where restaurant_id = ${ctx.restaurantId} and state = 'DELIVERED' and customer_ref is not null
          group by customer_ref
        ) t
      `)[0];
		const repeatPct = asInt(cust?.c) > 0 ? Math.round(asInt(cust?.repeats) * 100 / asInt(cust?.c)) : null;
		return {
			dataLabel: ctx.dataLabel,
			restaurantName: ctx.restaurantName,
			role: ctx.role,
			verificationStatus: ctx.verificationStatus,
			isOpen: open,
			serverTime: nowIso,
			today: {
				orders: asInt(s?.orders),
				salesPaise: asInt(s?.sales),
				aovPaise: asInt(s?.aov),
				accepted: asInt(s?.accepted),
				pending: asInt(s?.pending),
				cancelled: asInt(s?.cancelled),
				refundsPaise: asInt(s?.refunds),
				settlementPaise: asInt(s?.payable),
				unavailableItems: asInt(unavailable[0]?.c),
				rating: rating[0]?.avg != null ? Math.round(Number(rating[0].avg) * 10) / 10 : null,
				ratingCount: asInt(rating[0]?.n),
				repeatPct
			},
			attention
		};
	});
});
var getOperatingSnapshot_createServerFn_handler = createServerRpc({
	id: "ffa61d595de0c2d85935c70833c9e8a639508e781b0d12e54ab23e265a5a80ce",
	name: "getOperatingSnapshot",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => getOperatingSnapshot.__executeServer(opts));
var getOperatingSnapshot = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getOperatingSnapshot_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "hours.edit", async (sql, ctx) => {
		return {
			hours: await sql`
        select id, weekday, open_minutes, close_minutes
        from restaurant_hours where restaurant_id = ${ctx.restaurantId}
        order by weekday, open_minutes
      `,
			restaurant: (await sql`
        select emergency_closed, vacation_mode, weekly_holidays, prep_minutes, peak_prep_minutes
        from restaurants where id = ${ctx.restaurantId}
      `)[0],
			dataLabel: ctx.dataLabel
		};
	});
});
var saveHours_createServerFn_handler = createServerRpc({
	id: "fd97d75f6fb3e2ec2fb9024c8f8be9544fcf58a644712948f5d9eef1a4cc79af",
	name: "saveHours",
	filename: "src/lib/server/api-orders.ts"
}, (opts) => saveHours.__executeServer(opts));
var saveHours = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveHours_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "hours.edit", async (sql, ctx) => {
		await sql`delete from restaurant_hours where restaurant_id = ${ctx.restaurantId}`;
		for (const s of data.shifts) {
			if (s.weekday < 0 || s.weekday > 6) continue;
			await sql`
          insert into restaurant_hours (id, restaurant_id, weekday, open_minutes, close_minutes)
          values (${newId("hrs")}, ${ctx.restaurantId}, ${s.weekday}, ${s.openMinutes}, ${s.closeMinutes})
        `;
		}
		await sql`
        update restaurants set
          emergency_closed = ${Boolean(data.emergencyClosed)},
          vacation_mode = ${Boolean(data.vacationMode)},
          weekly_holidays = ${data.weeklyHolidays ?? ""},
          prep_minutes = ${asInt(data.prepMinutes, 20)},
          peak_prep_minutes = ${asInt(data.peakPrepMinutes, 30)},
          updated_at = now()
        where id = ${ctx.restaurantId}
      `;
		return { ok: true };
	});
});
//#endregion
export { advanceSimulatedRider_createServerFn_handler, getDashboard_createServerFn_handler, getOperatingSnapshot_createServerFn_handler, listOrders_createServerFn_handler, saveHours_createServerFn_handler, transitionOrder_createServerFn_handler };
