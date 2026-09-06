import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { asInt, newId } from "@/lib/utils";
import { estimatePromotion } from "@/lib/promotions/estimate";
import { paise } from "@/lib/money";
import { withVendor } from "./helpers";
import type { PromotionFunder, PromotionKind } from "@/lib/contracts";

export const getSettlements = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "settlements.view", async (sql, ctx) => {
      const batches = await sql<{
        id: string;
        status: string;
        period_start: string;
        period_end: string;
        scheduled_for: string | null;
        settled_at: string | null;
        total_payable_paise: number;
        data_label: string;
      }>`
        select id, status, period_start::text as period_start, period_end::text as period_end,
               scheduled_for::text as scheduled_for, settled_at::text as settled_at,
               total_payable_paise, data_label
        from settlement_batches
        where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
      `;
      const lines = await sql<{
        id: string;
        batch_id: string;
        order_id: string;
        order_number: string;
        food_value_paise: number;
        packing_paise: number;
        restaurant_discount_paise: number;
        platform_funded_discount_paise: number;
        commission_paise: number;
        other_deductions_paise: number;
        other_deductions_code: string | null;
        refund_adjustment_paise: number;
        restaurant_payable_paise: number;
      }>`
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
      const current = await sql<{ amt: number }>`
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
          lines: lines
            .filter((l) => l.batch_id === b.id)
            .map((l) => ({
              ...l,
              foodValuePaise: asInt(l.food_value_paise),
              packingPaise: asInt(l.packing_paise),
              restaurantDiscountPaise: asInt(l.restaurant_discount_paise),
              platformFundedDiscountPaise: asInt(l.platform_funded_discount_paise),
              commissionPaise: asInt(l.commission_paise),
              otherDeductionsPaise: asInt(l.other_deductions_paise),
              refundAdjustmentPaise: asInt(l.refund_adjustment_paise),
              restaurantPayablePaise: asInt(l.restaurant_payable_paise),
            })),
        })),
      };
    });
  });

export const exportSettlementJson = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; batchId: string }) => d)
  .handler(async ({ context, data }) => {
    const payload = await getSettlements({ data: { restaurantId: data.restaurantId } });
    const batch = payload.batches.find((b) => b.id === data.batchId);
    if (!batch) throw new Error("Settlement not found");
    return {
      format: "json" as const,
      apiVersion: "v1",
      dataLabel: payload.dataLabel,
      batch,
    };
  });

export const getPromotions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "promotions.view", async (sql, ctx) => {
      const rows = await sql<{
        id: string;
        name: string;
        funder: string;
        kind: string;
        percent_off: number | null;
        amount_paise: number | null;
        min_order_paise: number;
        max_discount_paise: number | null;
        is_active: boolean;
        assumed_orders_per_day: number;
        starts_at: string | null;
        ends_at: string | null;
      }>`
        select id, name, funder, kind, percent_off, amount_paise, min_order_paise,
               max_discount_paise, is_active, assumed_orders_per_day,
               starts_at::text as starts_at, ends_at::text as ends_at
        from promotions where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
      `;
      const aov = await sql<{ aov: number }>`
        select coalesce(avg(customer_total_paise) filter (where state = 'DELIVERED'), 35000)::int as aov
        from orders where restaurant_id = ${ctx.restaurantId}
      `;
      return {
        dataLabel: ctx.dataLabel,
        role: ctx.role,
        promotions: rows.map((p) => {
          const estimate = estimatePromotion({
            kind: p.kind as PromotionKind,
            funder: p.funder as PromotionFunder,
            percentOff: p.percent_off ?? 0,
            amountPaise: asInt(p.amount_paise ?? 0),
            assumedOrdersPerDay: asInt(p.assumed_orders_per_day, 10),
            assumedAovPaise: asInt(aov[0]?.aov, 35000),
            maxDiscountPaise: p.max_discount_paise,
          });
          return {
            ...p,
            amountPaise: p.amount_paise != null ? asInt(p.amount_paise) : null,
            minOrderPaise: asInt(p.min_order_paise),
            maxDiscountPaise: p.max_discount_paise != null ? asInt(p.max_discount_paise) : null,
            isActive: p.is_active === true || (p.is_active as unknown) === "t",
            estimate,
          };
        }),
      };
    });
  });

export const savePromotion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    restaurantId?: string;
    id?: string;
    name: string;
    funder: PromotionFunder;
    kind: PromotionKind;
    percentOff?: number;
    amountPaise?: number;
    minOrderPaise?: number;
    maxDiscountPaise?: number | null;
    assumedOrdersPerDay?: number;
    isActive?: boolean;
  }) => d)
  .handler(async ({ context, data }) => {
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
        return { ok: true as const, id: data.id };
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
      return { ok: true as const, id };
    });
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string; range?: "day" | "week" | "month" }) => d)
  .handler(async ({ context, data }) => {
    return withVendor(context.userId, data.restaurantId, "analytics.view", async (sql, ctx) => {
      const range = data.range ?? "week";
      const interval = range === "day" ? "1 day" : range === "month" ? "30 days" : "7 days";
      const summary = await sql<{
        orders: number;
        completed: number;
        cancelled: number;
        rejected: number;
        sales: number;
        aov: number;
      }>`
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
      const items = await sql<{ name: string; qty: number; revenue: number }>`
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
      const hours = await sql<{ hour: number; c: number }>`
        select extract(hour from placed_at at time zone 'Asia/Kolkata')::int as hour,
               count(*)::int as c
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= now() - ${interval}::interval
        group by 1
        order by 1
      `;
      const prep = await sql<{ mins: number | null }>`
        select avg(extract(epoch from (ready_at - accepted_at))/60)::int as mins
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and accepted_at is not null and ready_at is not null
          and placed_at >= now() - ${interval}::interval
      `;
      const promo = await sql<{
        orders: number;
        rest: number;
        plat: number;
      }>`
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
          aovPaise: asInt(summary[0]?.aov),
        },
        items: items.map((i) => ({ name: i.name, qty: asInt(i.qty), revenuePaise: asInt(i.revenue) })),
        hours: hours.map((h) => ({ hour: asInt(h.hour), orders: asInt(h.c) })),
        avgPrepMinutes: prep[0]?.mins != null ? asInt(prep[0].mins) : null,
        promotions: {
          orders: asInt(promo[0]?.orders),
          restaurantFundedPaise: asInt(promo[0]?.rest),
          platformFundedPaise: asInt(promo[0]?.plat),
        },
      };
    });
  });
