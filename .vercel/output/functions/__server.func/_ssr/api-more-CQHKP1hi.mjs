import { r as isRestaurantRole } from "./rbac-inyuxmFx.mjs";
import { n as platformConfig } from "./platform-config-DwNskrvg.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { a as newId, n as asInt, r as asIso } from "./utils-BZJZXT5Z.mjs";
import { a as withVendor, o as writeAudit, t as createServerRpc } from "./helpers-CucV1oAR.mjs";
import { t as notificationChannelStatus } from "./notifications-thG64ck_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-more-CQHKP1hi.js
var getReviews_createServerFn_handler = createServerRpc({
	id: "97f0195818fa8377df5ba02495defe179825ffad561fb06d1d4979c1386fa1d1",
	name: "getReviews",
	filename: "src/lib/server/api-more.ts"
}, (opts) => getReviews.__executeServer(opts));
var getReviews = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getReviews_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "reviews.view", async (sql, ctx) => {
		const rows = await sql`
        select r.id, r.rating, r.body, r.created_at::text as created_at, r.order_id, r.data_label,
               rr.body as response_body
        from reviews r
        left join review_responses rr on rr.review_id = r.id
        where r.restaurant_id = ${ctx.restaurantId}
        order by r.created_at desc
        limit 100
      `;
		return {
			dataLabel: ctx.dataLabel,
			canRespond: ctx.role === "OWNER" || ctx.role === "MANAGER" || ctx.role === "MULTI_OUTLET_MANAGER",
			reviews: rows.map((r) => ({
				id: r.id,
				rating: asInt(r.rating),
				body: r.body,
				createdAt: asIso(r.created_at),
				orderId: r.order_id,
				dataLabel: r.data_label,
				response: r.response_body
			}))
		};
	});
});
var respondToReview_createServerFn_handler = createServerRpc({
	id: "3949ded01f3542891e4383bf55a1fd4f7bb03aebafec895dbc7b674ce59ac2eb",
	name: "respondToReview",
	filename: "src/lib/server/api-more.ts"
}, (opts) => respondToReview.__executeServer(opts));
var respondToReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(respondToReview_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "reviews.respond", async (sql, ctx) => {
		const body = data.body.trim();
		if (!body) throw new Error("Reply cannot be empty");
		if (!(await sql`
        select id from reviews where id = ${data.reviewId} and restaurant_id = ${ctx.restaurantId}
      `)[0]) throw new Error("Review not found");
		await sql`
        insert into review_responses (id, review_id, restaurant_id, author_user_id, body)
        values (${newId("rrp")}, ${data.reviewId}, ${ctx.restaurantId}, ${context.userId}, ${body})
        on conflict (review_id) do update set body = excluded.body
      `;
		return { ok: true };
	});
});
var getNotifications_createServerFn_handler = createServerRpc({
	id: "bb0f648dc5dbed736f5cf92af846d6c28bc5528ea3d573255c9f04f3e1d0289d",
	name: "getNotifications",
	filename: "src/lib/server/api-more.ts"
}, (opts) => getNotifications.__executeServer(opts));
var getNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getNotifications_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "notifications.view", async (sql, ctx) => {
		const rows = await sql`
        select id, type, title, body, is_read, created_at::text as created_at
        from notifications
        where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
        limit 50
      `;
		return {
			channels: notificationChannelStatus(),
			notifications: rows.map((n) => ({
				...n,
				isRead: n.is_read === true || n.is_read === "t",
				createdAt: asIso(n.created_at)
			}))
		};
	});
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "fb53a015bd2b5921aeba204027d456deee251a57814d3d260aff89ae1900df40",
	name: "markNotificationsRead",
	filename: "src/lib/server/api-more.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(markNotificationsRead_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "notifications.view", async (sql, ctx) => {
		await sql`
        update notifications set is_read = true
        where restaurant_id = ${ctx.restaurantId}
      `;
		return { ok: true };
	});
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "cabaac85081f4afce2dc4b8f4c63ffcb51c2bfb969ef30ea472de824c3750661",
	name: "listStaff",
	filename: "src/lib/server/api-more.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listStaff_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "settings.staff", async (sql, ctx) => {
		return {
			staff: await sql`
        select s.id, s.user_id, s.role, s.is_active, u.email, u.name
        from restaurant_staff s
        left join "user" u on u.id = s.user_id
        where s.restaurant_id = ${ctx.restaurantId}
        order by s.created_at
      `,
			role: ctx.role
		};
	});
});
var addStaff_createServerFn_handler = createServerRpc({
	id: "90588cb3d1682925fa229a104ea5bc4054ae21dba15e7232ef2cc0ae7a5bfcac",
	name: "addStaff",
	filename: "src/lib/server/api-more.ts"
}, (opts) => addStaff.__executeServer(opts));
var addStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addStaff_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "settings.staff", async (sql, ctx) => {
		if (!isRestaurantRole(data.role) || data.role === "OWNER") throw new Error("Invalid role");
		const user = (await sql`
        select id from "user" where email = ${data.email.trim().toLowerCase()} limit 1
      `)[0];
		if (!user) throw new Error("No account exists with that email yet. They must sign up first.");
		await sql`
        insert into restaurant_staff (id, restaurant_id, user_id, role)
        values (${newId("stf")}, ${ctx.restaurantId}, ${user.id}, ${data.role})
        on conflict (restaurant_id, user_id) do update set role = excluded.role, is_active = true
      `;
		await writeAudit(sql, {
			restaurantId: ctx.restaurantId,
			actorUserId: context.userId,
			action: "staff_add",
			entityType: "staff",
			entityId: user.id,
			detail: data.role
		});
		return { ok: true };
	});
});
var askAssistant_createServerFn_handler = createServerRpc({
	id: "41b310d83ba4c9c41dc718ec1c3f9cd7187c26b60e89c614951b33d156bc6d3a",
	name: "askAssistant",
	filename: "src/lib/server/api-more.ts"
}, (opts) => askAssistant.__executeServer(opts));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(askAssistant_createServerFn_handler, async ({ context, data }) => {
	return withVendor(context.userId, data.restaurantId, "assistant.use", async (sql, ctx) => {
		if (!platformConfig.featureFlags.restaurant_ai) return {
			ok: false,
			error: "NOT_CONNECTED",
			text: "Assistant is turned off."
		};
		const apiKey = process.env.XAI_API_KEY;
		const question = data.question.trim().slice(0, 500);
		if (!question) throw new Error("Ask a question");
		const today = await sql`
        select
          count(*)::int as orders,
          count(*) filter (where state = 'DELIVERED')::int as delivered,
          count(*) filter (where state = 'PLACED')::int as pending,
          count(*) filter (where state = 'CANCELLED')::int as cancelled,
          count(*) filter (where state = 'REJECTED')::int as rejected,
          coalesce(sum(customer_total_paise) filter (where state = 'DELIVERED'),0)::int as sales_paise,
          coalesce(sum(restaurant_payable_paise) filter (where state = 'DELIVERED'),0)::int as payable_paise,
          coalesce(sum(restaurant_discount_paise),0)::int as restaurant_discount_paise,
          coalesce(sum(platform_funded_discount_paise),0)::int as platform_discount_paise,
          coalesce(sum(commission_paise) filter (where state = 'DELIVERED'),0)::int as commission_paise
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= date_trunc('day', now())
      `;
		const items = await sql`
        select oi.item_name as name, sum(oi.quantity)::int as qty
        from order_items oi join orders o on o.id = oi.order_id
        where o.restaurant_id = ${ctx.restaurantId}
          and o.placed_at >= date_trunc('day', now())
        group by oi.item_name
        order by qty desc
        limit 8
      `;
		const unavailable = await sql`
        select i.name, a.status
        from item_availability a join items i on i.id = a.item_id
        where a.restaurant_id = ${ctx.restaurantId} and a.status <> 'available'
      `;
		const hours = await sql`
        select extract(hour from placed_at at time zone 'Asia/Kolkata')::int as hour, count(*)::int as c
        from orders
        where restaurant_id = ${ctx.restaurantId}
          and placed_at >= now() - interval '7 days'
        group by 1 order by c desc limit 5
      `;
		const authorized = {
			dataLabel: ctx.dataLabel,
			restaurantName: ctx.restaurantName,
			verificationStatus: ctx.verificationStatus,
			today: today[0] ?? {
				orders: 0,
				delivered: 0,
				pending: 0,
				cancelled: 0,
				rejected: 0,
				sales_paise: 0,
				payable_paise: 0,
				restaurant_discount_paise: 0,
				platform_discount_paise: 0,
				commission_paise: 0
			},
			topItemsToday: items,
			unavailableItems: unavailable,
			busyHoursLast7Days: hours,
			note: "Amounts are integer paise. Divide by 100 for rupees. Do not invent any number not in this object."
		};
		await sql`
        insert into assistant_messages (id, restaurant_id, user_id, role, content)
        values (${newId("aim")}, ${ctx.restaurantId}, ${context.userId}, 'user', ${question})
      `;
		if (!apiKey) {
			const text = "AI is not connected in this environment. Live authorised numbers for this kitchen are shown in Analytics and Settlement. No financial figure will be invented.";
			await sql`
          insert into assistant_messages (id, restaurant_id, user_id, role, content)
          values (${newId("aim")}, ${ctx.restaurantId}, ${context.userId}, 'assistant', ${text})
        `;
			return {
				ok: false,
				error: "NOT_CONNECTED",
				text,
				snapshot: authorized
			};
		}
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 500,
				messages: [{
					role: "system",
					content: "You are the Roshoi Partner kitchen assistant. You may only use the JSON snapshot of THIS restaurant. Never invent financial figures. If a number is missing, say it is not in the authorised data. Never mention other restaurants or private customer names. Amounts are integer paise. Speak plainly for a small restaurant owner in Assam. Label simulated data as simulated."
				}, {
					role: "user",
					content: `Authorised snapshot:\n${JSON.stringify(authorized)}\n\nQuestion: ${question}`
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: "NOT_CONNECTED",
			text: `Assistant unavailable (${res.status}).`
		};
		const text = (await res.json()).choices?.[0]?.message?.content ?? "No answer.";
		await sql`
        insert into assistant_messages (id, restaurant_id, user_id, role, content)
        values (${newId("aim")}, ${ctx.restaurantId}, ${context.userId}, 'assistant', ${text})
      `;
		return {
			ok: true,
			text,
			snapshot: authorized
		};
	});
});
//#endregion
export { addStaff_createServerFn_handler, askAssistant_createServerFn_handler, getNotifications_createServerFn_handler, getReviews_createServerFn_handler, listStaff_createServerFn_handler, markNotificationsRead_createServerFn_handler, respondToReview_createServerFn_handler };
