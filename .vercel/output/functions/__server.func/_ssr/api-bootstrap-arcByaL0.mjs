import { n as platformConfig } from "./platform-config-DwNskrvg.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { a as newId } from "./utils-BZJZXT5Z.mjs";
import { t as computeRestaurantPayable } from "./money-CtWHgB0v.mjs";
import { i as notifyInApp, o as writeAudit, r as loadMemberships, t as createServerRpc } from "./helpers-CucV1oAR.mjs";
import { t as notificationChannelStatus } from "./notifications-thG64ck_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-bootstrap-arcByaL0.js
var ALLOWED = /* @__PURE__ */ new Set([...platformConfig.restaurantSettings.allowedDocumentTypes, ...platformConfig.restaurantSettings.allowedImageTypes]);
function validateUpload(input) {
	if (!(input.kind === "image" ? platformConfig.restaurantSettings.allowedImageTypes : platformConfig.restaurantSettings.allowedDocumentTypes).includes(input.contentType) && !ALLOWED.has(input.contentType)) return {
		ok: false,
		error: "This file type is not allowed."
	};
	if (input.byteSize <= 0 || input.byteSize > platformConfig.restaurantSettings.maxUploadBytes) return {
		ok: false,
		error: `File must be under ${Math.floor(platformConfig.restaurantSettings.maxUploadBytes / 1024)} KB.`
	};
	return { ok: true };
}
/**
* Object storage adapter. S3 is NOT CONNECTED. Preview stores a metadata
* record plus a truncated data URL in Postgres so documents have a status
* without pretending a production bucket exists.
*/
var storageAdapter = {
	connected: false,
	provider: "NOT_CONNECTED",
	async put(input) {
		return {
			backend: "local_preview",
			key: input.key,
			contentType: input.contentType,
			byteSize: input.bytes.byteLength,
			connected: false
		};
	}
};
/**
* Window 3 (rider) integration. When an order becomes READY we enqueue a
* pickup ticket. The rider system is not connected in this window.
*/
var dispatchAdapter = {
	connected: false,
	provider: "NOT_CONNECTED"
};
var CUISINE = "Sylheti, Bengali, Assamese";
var MENU = [
	{
		category: "Rice & Biryani",
		name: "Chicken Biryani",
		description: "Dum biryani with aloo, boiled egg and raita.",
		diet: "NONVEG",
		tags: "bestseller,spicy",
		recommended: true,
		variants: [{
			name: "Regular",
			paise: 18e3
		}, {
			name: "Large",
			paise: 25e3
		}],
		addons: ["Extra raita", "Boiled egg"]
	},
	{
		category: "Rice & Biryani",
		name: "Vegetable Biryani",
		description: "Fragrant rice with mixed vegetables and fried onions.",
		diet: "VEG",
		tags: "bestseller",
		variants: [{
			name: "Regular",
			paise: 15e3
		}, {
			name: "Large",
			paise: 21e3
		}]
	},
	{
		category: "Curries",
		name: "Ilish Bhapa",
		description: "Steamed hilsa in mustard-coconut paste.",
		diet: "NONVEG",
		tags: "seasonal",
		recommended: true,
		variants: [{
			name: "Full",
			paise: 42e3
		}]
	},
	{
		category: "Curries",
		name: "Chicken Bhuna",
		description: "Slow-cooked chicken in thick Sylheti masala.",
		diet: "NONVEG",
		tags: "spicy",
		variants: [{
			name: "Half",
			paise: 16e3
		}, {
			name: "Full",
			paise: 28e3
		}]
	},
	{
		category: "Curries",
		name: "Chhanar Dalna",
		description: "Cottage cheese and potato in light gravy.",
		diet: "VEG",
		tags: "",
		variants: [{
			name: "Full",
			paise: 14e3
		}]
	},
	{
		category: "Breads & Snacks",
		name: "Luchi + Aloor Torkari",
		description: "Four luchis with spiced potato.",
		diet: "VEG",
		tags: "breakfast",
		variants: [{
			name: "Plate",
			paise: 8e3
		}]
	},
	{
		category: "Breads & Snacks",
		name: "Shingara",
		description: "Crisp pastry with potato-pea filling.",
		diet: "VEG",
		tags: "tea-time",
		variants: [{
			name: "2 pieces",
			paise: 4e3
		}, {
			name: "4 pieces",
			paise: 7e3
		}]
	},
	{
		category: "Breads & Snacks",
		name: "Beef Roll",
		description: "Paratha wrap with beef bhuna and onion.",
		diet: "NONVEG",
		tags: "bestseller",
		recommended: true,
		variants: [{
			name: "Single",
			paise: 12e3
		}],
		addons: ["Extra sauce"]
	},
	{
		category: "Drinks",
		name: "Milk Tea",
		description: "Assam tea with milk and sugar.",
		diet: "VEG",
		tags: "",
		variants: [{
			name: "Cup",
			paise: 2e3
		}]
	},
	{
		category: "Drinks",
		name: "Lemon Soda",
		description: "Fresh lime, salt, soda.",
		diet: "VEG",
		tags: "",
		variants: [{
			name: "Glass",
			paise: 4e3
		}]
	}
];
async function nextOrderNumber(sql) {
	const rows = await sql`select nextval('order_number_seq') as n`;
	const n = Number(rows[0]?.n ?? 1001);
	return `RB${String(n).padStart(6, "0")}`;
}
async function seedSimulatedKitchen(sql, userId) {
	const existing = await sql`
    select id from restaurants
    where owner_user_id = ${userId} and data_label = 'SIMULATED'
    limit 1
  `;
	if (existing[0]) return { restaurantId: existing[0].id };
	const restaurantId = newId("rst");
	const outletId = newId("out");
	await sql`
    insert into restaurants (
      id, owner_user_id, name, display_name, owner_name, phone, email,
      address, landmark, lat, lng, service_area, cuisine, diet, description,
      prep_minutes, peak_prep_minutes, packing_paise, commission_bps,
      verification_status, data_label, fssai_number
    ) values (
      ${restaurantId}, ${userId},
      'DEMO RESTAURANT — SIMULATED',
      'Surma Kitchen (Demo)',
      'Demo Owner',
      '',
      '',
      'Station Road, Karimganj, Assam 788710',
      'Near Kachari',
      ${24.869}, ${92.354},
      'Karimganj town',
      ${CUISINE},
      'NONVEG',
      'Simulated kitchen for training. Not a live restaurant. Not verified.',
      22, 32, 1000, 1000,
      'DRAFT',
      'SIMULATED',
      ''
    )
  `;
	await sql`
    insert into outlets (id, restaurant_id, name, address, lat, lng, is_primary)
    values (
      ${outletId}, ${restaurantId}, 'Karimganj',
      'Station Road, Karimganj', ${24.869}, ${92.354}, true
    )
  `;
	await sql`
    insert into restaurant_staff (id, restaurant_id, outlet_id, user_id, role)
    values (${newId("stf")}, ${restaurantId}, ${outletId}, ${userId}, 'OWNER')
  `;
	for (let day = 0; day <= 6; day++) {
		if (day === 2) continue;
		await sql`
      insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
      values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${660}, ${900})
    `;
		await sql`
      insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
      values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${1020}, ${1380})
    `;
	}
	const addonIds = {};
	for (const name of [
		"Extra raita",
		"Boiled egg",
		"Extra sauce"
	]) {
		const id = newId("add");
		addonIds[name] = id;
		await sql`
      insert into addons (id, restaurant_id, name, price_paise)
      values (${id}, ${restaurantId}, ${name}, ${name === "Boiled egg" ? 1500 : 1e3})
    `;
	}
	const catIds = {};
	const itemIndex = [];
	let catSort = 0;
	for (const spec of MENU) {
		if (!catIds[spec.category]) {
			const cid = newId("cat");
			catIds[spec.category] = cid;
			await sql`
        insert into categories (id, restaurant_id, name, sort_order)
        values (${cid}, ${restaurantId}, ${spec.category}, ${catSort})
      `;
			catSort += 1;
		}
		const itemId = newId("itm");
		await sql`
      insert into items (
        id, restaurant_id, category_id, name, description, diet, tags,
        recommended, best_seller, prep_minutes, sort_order
      ) values (
        ${itemId}, ${restaurantId}, ${catIds[spec.category]}, ${spec.name},
        ${spec.description}, ${spec.diet}, ${spec.tags},
        ${Boolean(spec.recommended)}, ${spec.tags.includes("bestseller")},
        18, ${itemIndex.length}
      )
    `;
		await sql`
      insert into item_availability (item_id, restaurant_id, status)
      values (${itemId}, ${restaurantId}, ${spec.name === "Ilish Bhapa" ? "sold_out" : "available"})
    `;
		const variants = [];
		let vSort = 0;
		for (const v of spec.variants) {
			const vid = newId("var");
			variants.push({
				id: vid,
				name: v.name,
				paise: v.paise
			});
			await sql`
        insert into variants (id, item_id, restaurant_id, name, price_paise, sort_order)
        values (${vid}, ${itemId}, ${restaurantId}, ${v.name}, ${v.paise}, ${vSort})
      `;
			vSort += 1;
		}
		for (const an of spec.addons ?? []) {
			const aid = addonIds[an];
			if (aid) await sql`
          insert into item_addons (item_id, addon_id) values (${itemId}, ${aid})
        `;
		}
		itemIndex.push({
			id: itemId,
			name: spec.name,
			variants,
			addonNames: spec.addons ?? []
		});
	}
	await sql`
    insert into promotions (
      id, restaurant_id, name, funder, kind, percent_off, min_order_paise,
      max_discount_paise, is_active, assumed_orders_per_day
    ) values (
      ${newId("pro")}, ${restaurantId}, 'Lunch 10% (restaurant)',
      'RESTAURANT', 'percent', 10, 15000, 4000, true, 10
    )
  `;
	await sql`
    insert into promotions (
      id, restaurant_id, name, funder, kind, amount_paise, min_order_paise,
      is_active, assumed_orders_per_day
    ) values (
      ${newId("pro")}, ${restaurantId}, 'New user ₹50 (platform)',
      'PLATFORM', 'fixed', 5000, 20000, true, 10
    )
  `;
	const biryani = itemIndex.find((i) => i.name === "Chicken Biryani");
	const roll = itemIndex.find((i) => i.name === "Beef Roll");
	const tea = itemIndex.find((i) => i.name === "Milk Tea");
	const shingara = itemIndex.find((i) => i.name === "Shingara");
	const bhuna = itemIndex.find((i) => i.name === "Chicken Bhuna");
	const seeds = [
		{
			state: "PLACED",
			area: "Longai Road",
			minutesAgo: 2,
			payment: "UPI",
			restDisc: 0,
			platDisc: 5e3,
			note: "Less spicy",
			lines: [{
				item: biryani,
				variantIndex: 1,
				qty: 1
			}, {
				item: tea,
				variantIndex: 0,
				qty: 2
			}]
		},
		{
			state: "PLACED",
			area: "Central Road",
			minutesAgo: 6,
			payment: "COD",
			restDisc: 1800,
			platDisc: 0,
			lines: [{
				item: roll,
				variantIndex: 0,
				qty: 2
			}]
		},
		{
			state: "ACCEPTED",
			area: "R.K. Mission",
			minutesAgo: 12,
			payment: "UPI",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: bhuna,
				variantIndex: 1,
				qty: 1
			}, {
				item: shingara,
				variantIndex: 0,
				qty: 1
			}]
		},
		{
			state: "PREPARING",
			area: "Sribhumi Bazaar",
			minutesAgo: 18,
			payment: "COD",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: biryani,
				variantIndex: 0,
				qty: 2
			}]
		},
		{
			state: "READY",
			area: "Panchayat Road",
			minutesAgo: 28,
			payment: "UPI",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: roll,
				variantIndex: 0,
				qty: 1
			}, {
				item: tea,
				variantIndex: 0,
				qty: 1
			}]
		},
		{
			state: "ON_THE_WAY",
			area: "Hospital Road",
			minutesAgo: 45,
			payment: "UPI",
			restDisc: 0,
			platDisc: 5e3,
			lines: [{
				item: biryani,
				variantIndex: 1,
				qty: 1
			}]
		},
		{
			state: "DELIVERED",
			area: "Station Road",
			minutesAgo: 90,
			payment: "UPI",
			restDisc: 2500,
			platDisc: 0,
			lines: [{
				item: bhuna,
				variantIndex: 0,
				qty: 2
			}, {
				item: tea,
				variantIndex: 0,
				qty: 2
			}]
		},
		{
			state: "DELIVERED",
			area: "Longai Road",
			minutesAgo: 200,
			payment: "COD",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: shingara,
				variantIndex: 1,
				qty: 1
			}, {
				item: tea,
				variantIndex: 0,
				qty: 2
			}]
		},
		{
			state: "CANCELLED",
			area: "Central Road",
			minutesAgo: 240,
			payment: "UPI",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: biryani,
				variantIndex: 0,
				qty: 1
			}]
		},
		{
			state: "REJECTED",
			area: "Airport Road",
			minutesAgo: 300,
			payment: "COD",
			restDisc: 0,
			platDisc: 0,
			lines: [{
				item: roll,
				variantIndex: 0,
				qty: 3
			}]
		}
	];
	const deliveredIds = [];
	for (const seed of seeds) {
		const orderId = newId("ord");
		const orderNumber = await nextOrderNumber(sql);
		let food = 0;
		const builtLines = [];
		for (const line of seed.lines) {
			const v = line.item.variants[line.variantIndex] ?? line.item.variants[0];
			food += v.paise * line.qty;
			builtLines.push({
				...line,
				unit: v.paise,
				vname: v.name
			});
		}
		const packing = 1e3;
		const snap = computeRestaurantPayable({
			foodValuePaise: food,
			packingPaise: packing,
			restaurantDiscountPaise: seed.restDisc,
			platformFundedDiscountPaise: seed.platDisc,
			commissionBps: 1e3
		});
		const customerTotal = food + packing - seed.restDisc - seed.platDisc;
		await sql`
      insert into orders (
        id, order_number, restaurant_id, outlet_id, state, placed_at,
        customer_area, customer_ref, payment_method, is_cod, special_instructions,
        prep_minutes, food_value_paise, packing_paise, restaurant_discount_paise,
        platform_funded_discount_paise, tax_paise, platform_fee_paise,
        commission_bps, commission_paise, other_deductions_paise,
        refund_adjustment_paise, restaurant_payable_paise, customer_total_paise,
        data_label, reject_reason
      ) values (
        ${orderId}, ${orderNumber}, ${restaurantId}, ${outletId}, ${seed.state},
        now() - (${seed.minutesAgo} || ' minutes')::interval,
        ${seed.area}, ${"anon_" + orderId.slice(-6)}, ${seed.payment},
        ${seed.payment === "COD"}, ${seed.note ?? null}, 22,
        ${snap.foodValuePaise}, ${packing}, ${snap.restaurantDiscountPaise},
        ${snap.platformFundedDiscountPaise}, 0, 0, 1000, ${snap.commissionPaise},
        0, 0, ${snap.restaurantPayablePaise}, ${customerTotal},
        'SIMULATED', ${seed.state === "REJECTED" ? "kitchen_overloaded" : null}
      )
    `;
		await sql`
      insert into order_events (id, order_id, restaurant_id, previous_state, new_state, actor, reason)
      values (${newId("evt")}, ${orderId}, ${restaurantId}, null, 'PLACED', 'system', 'simulated ingest')
    `;
		if (seed.state !== "PLACED") await sql`
        insert into order_events (id, order_id, restaurant_id, previous_state, new_state, actor, reason)
        values (${newId("evt")}, ${orderId}, ${restaurantId}, 'PLACED', ${seed.state}, 'system', 'simulated')
      `;
		for (const line of builtLines) await sql`
        insert into order_items (
          id, order_id, restaurant_id, item_id, item_name, variant_id, variant_name,
          quantity, unit_price_paise, line_total_paise
        ) values (
          ${newId("oli")}, ${orderId}, ${restaurantId}, ${line.item.id}, ${line.item.name},
          ${line.item.variants[line.variantIndex]?.id ?? null}, ${line.vname},
          ${line.qty}, ${line.unit}, ${line.unit * line.qty}
        )
      `;
		if (seed.state === "READY" || seed.state === "ON_THE_WAY" || seed.state === "DELIVERED") await sql`
        insert into rider_dispatch_queue (
          order_id, restaurant_id, order_number, order_code, pickup_address,
          ready_at, status, data_label
        ) values (
          ${orderId}, ${restaurantId}, ${orderNumber}, ${orderNumber.slice(-4)},
          'Station Road, Karimganj', now(),
          ${seed.state === "READY" ? "queued" : "claimed"},
          'SIMULATED'
        )
      `;
		if (seed.state === "DELIVERED") deliveredIds.push({
			orderId,
			payable: snap.restaurantPayablePaise,
			snap: {
				...snap,
				packing
			}
		});
	}
	if (deliveredIds.length) {
		const batchId = newId("bat");
		await sql`
      insert into settlement_batches (
        id, restaurant_id, status, period_start, period_end, scheduled_for,
        total_payable_paise, data_label
      ) values (
        ${batchId}, ${restaurantId}, 'pending',
        date_trunc('day', now()), now(), current_date + 1,
        ${deliveredIds.reduce((s, d) => s + d.payable, 0)}, 'SIMULATED'
      )
    `;
		for (const d of deliveredIds) {
			await sql`
        insert into settlement_lines (
          id, batch_id, restaurant_id, order_id, food_value_paise, packing_paise,
          restaurant_discount_paise, platform_funded_discount_paise, commission_paise,
          other_deductions_paise, refund_adjustment_paise, restaurant_payable_paise
        ) values (
          ${newId("sln")}, ${batchId}, ${restaurantId}, ${d.orderId},
          ${d.snap.foodValuePaise}, ${d.snap.packingPaise}, ${d.snap.restaurantDiscountPaise},
          ${d.snap.platformFundedDiscountPaise}, ${d.snap.commissionPaise},
          0, 0, ${d.snap.restaurantPayablePaise}
        )
      `;
			await sql`
        insert into ledger_entries (id, restaurant_id, order_id, batch_id, code, amount_paise, note, data_label)
        values (
          ${newId("ldg")}, ${restaurantId}, ${d.orderId}, ${batchId},
          'RESTAURANT_PAYABLE', ${d.payable}, 'Simulated delivered order', 'SIMULATED'
        )
      `;
		}
	}
	await sql`
    insert into reviews (id, restaurant_id, rating, body, data_label)
    values
      (${newId("rev")}, ${restaurantId}, 5, 'Biryani came hot. Good packing.', 'SIMULATED'),
      (${newId("rev")}, ${restaurantId}, 4, 'Roll was tasty. Tea was lukewarm.', 'SIMULATED'),
      (${newId("rev")}, ${restaurantId}, 3, 'Late by 15 minutes, food was fine.', 'SIMULATED')
  `;
	await notifyInApp(sql, {
		restaurantId,
		type: "new_order",
		title: "2 orders waiting",
		body: "Simulated incoming orders need acceptance."
	});
	await notifyInApp(sql, {
		restaurantId,
		type: "document_status",
		title: "FSSAI not submitted",
		body: "This demo kitchen is not verified and never will be auto-verified."
	});
	await writeAudit(sql, {
		restaurantId,
		actorUserId: userId,
		action: "seed_simulated",
		entityType: "restaurant",
		entityId: restaurantId,
		detail: "Loaded labelled SIMULATED kitchen. Not a live restaurant."
	});
	return { restaurantId };
}
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "9c1bad14012eb0b06c25983a232ff2eb8000d5f62d816034701a770075c5cd56",
	name: "getBootstrap",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBootstrap_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const memberships = await loadMemberships(sql, context.userId);
	return {
		userId: context.userId,
		memberships,
		branding: {
			appName: platformConfig.brand.appName,
			tagline: platformConfig.brand.tagline,
			restaurantFacingBrandName: platformConfig.brand.restaurantFacingBrandName,
			logo: platformConfig.brand.restaurantFacingLogo,
			primary: platformConfig.theme.primary,
			supportEmail: platformConfig.support.email
		},
		featureFlags: platformConfig.featureFlags,
		adapters: {
			notifications: notificationChannelStatus(),
			storage: {
				connected: storageAdapter.connected,
				provider: storageAdapter.provider
			},
			dispatch: {
				connected: dispatchAdapter.connected,
				provider: dispatchAdapter.provider
			},
			payments: {
				connected: false,
				provider: "NOT_CONNECTED"
			},
			ai: {
				connected: Boolean(process.env.XAI_API_KEY),
				provider: process.env.XAI_API_KEY ? "xAI" : "NOT_CONNECTED"
			}
		},
		commissionOptionsBps: [...platformConfig.commission.allowedBps]
	};
});
var loadSimulatedKitchen_createServerFn_handler = createServerRpc({
	id: "6959e681cc533b3259723efc1a8789361db530f08c008273cd1d59351c0120fd",
	name: "loadSimulatedKitchen",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => loadSimulatedKitchen.__executeServer(opts));
var loadSimulatedKitchen = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(loadSimulatedKitchen_createServerFn_handler, async ({ context }) => {
	return {
		ok: true,
		restaurantId: (await seedSimulatedKitchen(await getSql(), context.userId)).restaurantId,
		dataLabel: "SIMULATED"
	};
});
var createRestaurantDraft_createServerFn_handler = createServerRpc({
	id: "99b1301f0f002401e907c4d9e8a32e8bbb0eef33897dc777e41ee33da401aa47",
	name: "createRestaurantDraft",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => createRestaurantDraft.__executeServer(opts));
var createRestaurantDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createRestaurantDraft_createServerFn_handler, async ({ context, data }) => {
	const name = data.name.trim();
	const displayName = data.displayName.trim() || name;
	if (!name) throw new Error("Restaurant name is required");
	const sql = await getSql();
	const restaurantId = newId("rst");
	const outletId = newId("out");
	await sql`
      insert into restaurants (
        id, owner_user_id, name, display_name, owner_name, phone, email,
        address, landmark, cuisine, diet, description, verification_status, data_label
      ) values (
        ${restaurantId}, ${context.userId}, ${name}, ${displayName},
        ${data.ownerName.trim()}, ${data.phone.trim()}, ${data.email.trim()},
        ${data.address.trim()}, ${data.landmark?.trim() ?? ""},
        ${data.cuisine?.trim() ?? ""}, ${data.diet ?? "NONVEG"},
        ${data.description?.trim() ?? ""}, 'DRAFT', 'REAL'
      )
    `;
	await sql`
      insert into outlets (id, restaurant_id, name, address, is_primary)
      values (${outletId}, ${restaurantId}, ${displayName}, ${data.address.trim()}, true)
    `;
	await sql`
      insert into restaurant_staff (id, restaurant_id, outlet_id, user_id, role)
      values (${newId("stf")}, ${restaurantId}, ${outletId}, ${context.userId}, 'OWNER')
    `;
	for (let day = 0; day <= 6; day++) await sql`
        insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
        values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${660}, ${1320})
      `;
	await writeAudit(sql, {
		restaurantId,
		actorUserId: context.userId,
		action: "create_draft",
		entityType: "restaurant",
		entityId: restaurantId
	});
	return {
		ok: true,
		restaurantId,
		verificationStatus: "DRAFT",
		dataLabel: "REAL"
	};
});
var updateRestaurantProfile_createServerFn_handler = createServerRpc({
	id: "3bbd82d73174bb02f6a6d906d653d997f3b0a21b26eb2f3272b0878b5084887b",
	name: "updateRestaurantProfile",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => updateRestaurantProfile.__executeServer(opts));
var updateRestaurantProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateRestaurantProfile_createServerFn_handler, async ({ context, data }) => {
	const { withVendor } = await import("./helpers-CucV1oAR.mjs").then((n) => n.n).then((n) => n.t);
	return withVendor(context.userId, String(data.restaurantId ?? ""), "onboarding.edit", async (sql, ctx) => {
		const fields = [
			"name",
			"display_name",
			"owner_name",
			"phone",
			"email",
			"address",
			"landmark",
			"service_area",
			"cuisine",
			"diet",
			"description",
			"gstin",
			"fssai_number",
			"pan",
			"prep_minutes",
			"peak_prep_minutes",
			"min_order_paise",
			"packing_paise",
			"contact_persons"
		];
		for (const [k, col] of Object.entries({
			name: "name",
			displayName: "display_name",
			ownerName: "owner_name",
			phone: "phone",
			email: "email",
			address: "address",
			landmark: "landmark",
			serviceArea: "service_area",
			cuisine: "cuisine",
			diet: "diet",
			description: "description",
			gstin: "gstin",
			fssaiNumber: "fssai_number",
			pan: "pan",
			prepMinutes: "prep_minutes",
			peakPrepMinutes: "peak_prep_minutes",
			minOrderPaise: "min_order_paise",
			packingPaise: "packing_paise",
			contactPersons: "contact_persons",
			lat: "lat",
			lng: "lng",
			deliveryAvailable: "delivery_available",
			weeklyHolidays: "weekly_holidays"
		})) {
			if (data[k] === void 0) continue;
			if (!fields.includes(col) && ![
				"lat",
				"lng",
				"delivery_available",
				"weekly_holidays"
			].includes(col)) continue;
			const v = data[k];
			await sql.query(`update restaurants set ${col} = $1, updated_at = now() where id = $2`, [v, ctx.restaurantId]);
		}
		if (data.bankAccount !== void 0 || data.bankIfsc !== void 0 || data.bankName !== void 0) {
			const { assertCan } = await import("./rbac-inyuxmFx.mjs").then((n) => n.i).then((n) => n.i);
			assertCan(ctx.role, "settings.financial");
			if (data.bankAccount !== void 0) await sql`update restaurants set bank_account = ${String(data.bankAccount)}, updated_at = now() where id = ${ctx.restaurantId}`;
			if (data.bankIfsc !== void 0) await sql`update restaurants set bank_ifsc = ${String(data.bankIfsc)}, updated_at = now() where id = ${ctx.restaurantId}`;
			if (data.bankName !== void 0) await sql`update restaurants set bank_name = ${String(data.bankName)}, updated_at = now() where id = ${ctx.restaurantId}`;
		}
		return { ok: true };
	});
});
var submitForReview_createServerFn_handler = createServerRpc({
	id: "61ba3f2fe94f1d62d1ac095a8699c55e036ac0bf9d788cdc2a5a0d0b7aa0d8c3",
	name: "submitForReview",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => submitForReview.__executeServer(opts));
var submitForReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(submitForReview_createServerFn_handler, async ({ context, data }) => {
	const { withVendor } = await import("./helpers-CucV1oAR.mjs").then((n) => n.n).then((n) => n.t);
	return withVendor(context.userId, data.restaurantId, "onboarding.edit", async (sql, ctx) => {
		if (ctx.dataLabel === "SIMULATED") throw new Error("A simulated kitchen cannot be submitted for verification.");
		await sql`
        update restaurants
        set verification_status = 'SUBMITTED', updated_at = now()
        where id = ${ctx.restaurantId} and verification_status in ('DRAFT','REJECTED')
      `;
		await writeAudit(sql, {
			restaurantId: ctx.restaurantId,
			actorUserId: context.userId,
			action: "submit_review",
			entityType: "restaurant",
			entityId: ctx.restaurantId
		});
		return {
			ok: true,
			verificationStatus: "SUBMITTED"
		};
	});
});
var getRestaurant_createServerFn_handler = createServerRpc({
	id: "968a877661d5b7d685f4dd76ae577b3bbe89e9d147677736739a0e152a0f6ba4",
	name: "getRestaurant",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => getRestaurant.__executeServer(opts));
var getRestaurant = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getRestaurant_createServerFn_handler, async ({ context, data }) => {
	const { withVendor } = await import("./helpers-CucV1oAR.mjs").then((n) => n.n).then((n) => n.t);
	return withVendor(context.userId, data.restaurantId, "dashboard.view", async (sql, ctx) => {
		const rows = await sql`
        select id, name, display_name, owner_name, phone, email, address, landmark,
               cuisine, diet, description, gstin, fssai_number, pan,
               bank_account, bank_ifsc, bank_name, verification_status, data_label,
               commission_bps, packing_paise, prep_minutes, peak_prep_minutes,
               min_order_paise, emergency_closed, vacation_mode, weekly_holidays, lat, lng
        from restaurants where id = ${ctx.restaurantId} limit 1
      `;
		const hours = await sql`
        select weekday, open_minutes, close_minutes from restaurant_hours
        where restaurant_id = ${ctx.restaurantId} order by weekday, open_minutes
      `;
		const docs = await sql`
        select id, kind, file_name, status, verification_status, byte_size, storage_backend
        from restaurant_documents where restaurant_id = ${ctx.restaurantId}
        order by created_at desc
      `;
		const r = rows[0];
		if (!r) throw new Error("Restaurant not found");
		return {
			membership: ctx,
			restaurant: r,
			hours,
			documents: docs,
			storageConnected: storageAdapter.connected
		};
	});
});
var uploadDocument_createServerFn_handler = createServerRpc({
	id: "ed4703c65195865594064f74168b871f976f5070255c999d796b23fd712a33cc",
	name: "uploadDocument",
	filename: "src/lib/server/api-bootstrap.ts"
}, (opts) => uploadDocument.__executeServer(opts));
var uploadDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(uploadDocument_createServerFn_handler, async ({ context, data }) => {
	const { withVendor } = await import("./helpers-CucV1oAR.mjs").then((n) => n.n).then((n) => n.t);
	return withVendor(context.userId, data.restaurantId, "documents.upload", async (sql, ctx) => {
		const comma = data.dataUrl.indexOf(",");
		const b64 = comma >= 0 ? data.dataUrl.slice(comma + 1) : data.dataUrl;
		const byteSize = Math.floor(b64.length * 3 / 4);
		const check = validateUpload({
			contentType: data.contentType,
			byteSize,
			kind: "document"
		});
		if (!check.ok) throw new Error(check.error);
		const stored = await storageAdapter.put({
			key: `${ctx.restaurantId}/${data.kind}/${data.fileName}`,
			contentType: data.contentType,
			bytes: new Uint8Array(byteSize)
		});
		const id = newId("doc");
		await sql`
        insert into restaurant_documents (
          id, restaurant_id, kind, file_name, content_type, byte_size,
          storage_backend, storage_key, data_url, status, verification_status
        ) values (
          ${id}, ${ctx.restaurantId}, ${data.kind}, ${data.fileName}, ${data.contentType},
          ${byteSize}, ${stored.backend}, ${stored.key}, ${data.dataUrl.slice(0, 2e5)},
          'uploaded', 'PENDING'
        )
      `;
		return {
			ok: true,
			id,
			storage: "NOT_CONNECTED",
			verificationStatus: "PENDING"
		};
	});
});
//#endregion
export { createRestaurantDraft_createServerFn_handler, getBootstrap_createServerFn_handler, getRestaurant_createServerFn_handler, loadSimulatedKitchen_createServerFn_handler, submitForReview_createServerFn_handler, updateRestaurantProfile_createServerFn_handler, uploadDocument_createServerFn_handler };
