import type { Sql } from "@/lib/db";
import { computeRestaurantPayable } from "@/lib/money";
import { newId } from "@/lib/utils";
import { writeAudit, notifyInApp } from "./helpers";

const CUISINE = "Sylheti, Bengali, Assamese";

type SeedItem = {
  category: string;
  name: string;
  description: string;
  diet: "VEG" | "NONVEG" | "EGG";
  tags: string;
  recommended?: boolean;
  variants: { name: string; paise: number }[];
  addons?: string[];
};

const MENU: SeedItem[] = [
  {
    category: "Rice & Biryani",
    name: "Chicken Biryani",
    description: "Dum biryani with aloo, boiled egg and raita.",
    diet: "NONVEG",
    tags: "bestseller,spicy",
    recommended: true,
    variants: [
      { name: "Regular", paise: 18000 },
      { name: "Large", paise: 25000 },
    ],
    addons: ["Extra raita", "Boiled egg"],
  },
  {
    category: "Rice & Biryani",
    name: "Vegetable Biryani",
    description: "Fragrant rice with mixed vegetables and fried onions.",
    diet: "VEG",
    tags: "bestseller",
    variants: [
      { name: "Regular", paise: 15000 },
      { name: "Large", paise: 21000 },
    ],
  },
  {
    category: "Curries",
    name: "Ilish Bhapa",
    description: "Steamed hilsa in mustard-coconut paste.",
    diet: "NONVEG",
    tags: "seasonal",
    recommended: true,
    variants: [{ name: "Full", paise: 42000 }],
  },
  {
    category: "Curries",
    name: "Chicken Bhuna",
    description: "Slow-cooked chicken in thick Sylheti masala.",
    diet: "NONVEG",
    tags: "spicy",
    variants: [
      { name: "Half", paise: 16000 },
      { name: "Full", paise: 28000 },
    ],
  },
  {
    category: "Curries",
    name: "Chhanar Dalna",
    description: "Cottage cheese and potato in light gravy.",
    diet: "VEG",
    tags: "",
    variants: [{ name: "Full", paise: 14000 }],
  },
  {
    category: "Breads & Snacks",
    name: "Luchi + Aloor Torkari",
    description: "Four luchis with spiced potato.",
    diet: "VEG",
    tags: "breakfast",
    variants: [{ name: "Plate", paise: 8000 }],
  },
  {
    category: "Breads & Snacks",
    name: "Shingara",
    description: "Crisp pastry with potato-pea filling.",
    diet: "VEG",
    tags: "tea-time",
    variants: [
      { name: "2 pieces", paise: 4000 },
      { name: "4 pieces", paise: 7000 },
    ],
  },
  {
    category: "Breads & Snacks",
    name: "Beef Roll",
    description: "Paratha wrap with beef bhuna and onion.",
    diet: "NONVEG",
    tags: "bestseller",
    recommended: true,
    variants: [{ name: "Single", paise: 12000 }],
    addons: ["Extra sauce"],
  },
  {
    category: "Drinks",
    name: "Milk Tea",
    description: "Assam tea with milk and sugar.",
    diet: "VEG",
    tags: "",
    variants: [{ name: "Cup", paise: 2000 }],
  },
  {
    category: "Drinks",
    name: "Lemon Soda",
    description: "Fresh lime, salt, soda.",
    diet: "VEG",
    tags: "",
    variants: [{ name: "Glass", paise: 4000 }],
  },
];

async function nextOrderNumber(sql: Sql): Promise<string> {
  const rows = await sql<{ n: number }>`select nextval('order_number_seq') as n`;
  const n = Number(rows[0]?.n ?? 1001);
  return `RB${String(n).padStart(6, "0")}`;
}

export async function seedSimulatedKitchen(sql: Sql, userId: string): Promise<{ restaurantId: string }> {
  const existing = await sql<{ id: string }>`
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
    if (day === 2) continue; // closed Tuesday
    await sql`
      insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
      values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${11 * 60}, ${15 * 60})
    `;
    await sql`
      insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
      values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${17 * 60}, ${23 * 60})
    `;
  }

  const addonIds: Record<string, string> = {};
  for (const name of ["Extra raita", "Boiled egg", "Extra sauce"]) {
    const id = newId("add");
    addonIds[name] = id;
    const price = name === "Boiled egg" ? 1500 : 1000;
    await sql`
      insert into addons (id, restaurant_id, name, price_paise)
      values (${id}, ${restaurantId}, ${name}, ${price})
    `;
  }

  const catIds: Record<string, string> = {};
  const itemIndex: {
    id: string;
    name: string;
    variants: { id: string; name: string; paise: number }[];
    addonNames: string[];
  }[] = [];

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
    const variants: { id: string; name: string; paise: number }[] = [];
    let vSort = 0;
    for (const v of spec.variants) {
      const vid = newId("var");
      variants.push({ id: vid, name: v.name, paise: v.paise });
      await sql`
        insert into variants (id, item_id, restaurant_id, name, price_paise, sort_order)
        values (${vid}, ${itemId}, ${restaurantId}, ${v.name}, ${v.paise}, ${vSort})
      `;
      vSort += 1;
    }
    for (const an of spec.addons ?? []) {
      const aid = addonIds[an];
      if (aid) {
        await sql`
          insert into item_addons (item_id, addon_id) values (${itemId}, ${aid})
        `;
      }
    }
    itemIndex.push({
      id: itemId,
      name: spec.name,
      variants,
      addonNames: spec.addons ?? [],
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

  const biryani = itemIndex.find((i) => i.name === "Chicken Biryani")!;
  const roll = itemIndex.find((i) => i.name === "Beef Roll")!;
  const tea = itemIndex.find((i) => i.name === "Milk Tea")!;
  const shingara = itemIndex.find((i) => i.name === "Shingara")!;
  const bhuna = itemIndex.find((i) => i.name === "Chicken Bhuna")!;

  type SeedOrder = {
    state: string;
    area: string;
    minutesAgo: number;
    payment: "COD" | "UPI";
    restDisc: number;
    platDisc: number;
    note?: string;
    lines: { item: typeof biryani; variantIndex: number; qty: number }[];
  };

  const seeds: SeedOrder[] = [
    {
      state: "PLACED",
      area: "Longai Road",
      minutesAgo: 2,
      payment: "UPI",
      restDisc: 0,
      platDisc: 5000,
      note: "Less spicy",
      lines: [{ item: biryani, variantIndex: 1, qty: 1 }, { item: tea, variantIndex: 0, qty: 2 }],
    },
    {
      state: "PLACED",
      area: "Central Road",
      minutesAgo: 6,
      payment: "COD",
      restDisc: 1800,
      platDisc: 0,
      lines: [{ item: roll, variantIndex: 0, qty: 2 }],
    },
    {
      state: "ACCEPTED",
      area: "R.K. Mission",
      minutesAgo: 12,
      payment: "UPI",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: bhuna, variantIndex: 1, qty: 1 }, { item: shingara, variantIndex: 0, qty: 1 }],
    },
    {
      state: "PREPARING",
      area: "Sribhumi Bazaar",
      minutesAgo: 18,
      payment: "COD",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: biryani, variantIndex: 0, qty: 2 }],
    },
    {
      state: "READY",
      area: "Panchayat Road",
      minutesAgo: 28,
      payment: "UPI",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: roll, variantIndex: 0, qty: 1 }, { item: tea, variantIndex: 0, qty: 1 }],
    },
    {
      state: "ON_THE_WAY",
      area: "Hospital Road",
      minutesAgo: 45,
      payment: "UPI",
      restDisc: 0,
      platDisc: 5000,
      lines: [{ item: biryani, variantIndex: 1, qty: 1 }],
    },
    {
      state: "DELIVERED",
      area: "Station Road",
      minutesAgo: 90,
      payment: "UPI",
      restDisc: 2500,
      platDisc: 0,
      lines: [{ item: bhuna, variantIndex: 0, qty: 2 }, { item: tea, variantIndex: 0, qty: 2 }],
    },
    {
      state: "DELIVERED",
      area: "Longai Road",
      minutesAgo: 200,
      payment: "COD",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: shingara, variantIndex: 1, qty: 1 }, { item: tea, variantIndex: 0, qty: 2 }],
    },
    {
      state: "CANCELLED",
      area: "Central Road",
      minutesAgo: 240,
      payment: "UPI",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: biryani, variantIndex: 0, qty: 1 }],
    },
    {
      state: "REJECTED",
      area: "Airport Road",
      minutesAgo: 300,
      payment: "COD",
      restDisc: 0,
      platDisc: 0,
      lines: [{ item: roll, variantIndex: 0, qty: 3 }],
    },
  ];

  const deliveredIds: { orderId: string; payable: number; snap: ReturnType<typeof computeRestaurantPayable> & { packing: number } }[] = [];

  for (const seed of seeds) {
    const orderId = newId("ord");
    const orderNumber = await nextOrderNumber(sql);
    let food = 0;
    const builtLines: {
      item: typeof biryani;
      variantIndex: number;
      qty: number;
      unit: number;
      vname: string;
    }[] = [];
    for (const line of seed.lines) {
      const v = line.item.variants[line.variantIndex] ?? line.item.variants[0];
      food += v.paise * line.qty;
      builtLines.push({ ...line, unit: v.paise, vname: v.name });
    }
    const packing = 1000;
    const snap = computeRestaurantPayable({
      foodValuePaise: food,
      packingPaise: packing,
      restaurantDiscountPaise: seed.restDisc,
      platformFundedDiscountPaise: seed.platDisc,
      commissionBps: 1000,
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
    if (seed.state !== "PLACED") {
      await sql`
        insert into order_events (id, order_id, restaurant_id, previous_state, new_state, actor, reason)
        values (${newId("evt")}, ${orderId}, ${restaurantId}, 'PLACED', ${seed.state}, 'system', 'simulated')
      `;
    }
    for (const line of builtLines) {
      const oid = newId("oli");
      await sql`
        insert into order_items (
          id, order_id, restaurant_id, item_id, item_name, variant_id, variant_name,
          quantity, unit_price_paise, line_total_paise
        ) values (
          ${oid}, ${orderId}, ${restaurantId}, ${line.item.id}, ${line.item.name},
          ${line.item.variants[line.variantIndex]?.id ?? null}, ${line.vname},
          ${line.qty}, ${line.unit}, ${line.unit * line.qty}
        )
      `;
    }
    if (seed.state === "READY" || seed.state === "ON_THE_WAY" || seed.state === "DELIVERED") {
      await sql`
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
    }
    if (seed.state === "DELIVERED") {
      deliveredIds.push({ orderId, payable: snap.restaurantPayablePaise, snap: { ...snap, packing } });
    }
  }

  if (deliveredIds.length) {
    const batchId = newId("bat");
    const total = deliveredIds.reduce((s, d) => s + d.payable, 0);
    await sql`
      insert into settlement_batches (
        id, restaurant_id, status, period_start, period_end, scheduled_for,
        total_payable_paise, data_label
      ) values (
        ${batchId}, ${restaurantId}, 'pending',
        date_trunc('day', now()), now(), current_date + 1,
        ${total}, 'SIMULATED'
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
    body: "Simulated incoming orders need acceptance.",
  });
  await notifyInApp(sql, {
    restaurantId,
    type: "document_status",
    title: "FSSAI not submitted",
    body: "This demo kitchen is not verified and never will be auto-verified.",
  });
  await writeAudit(sql, {
    restaurantId,
    actorUserId: userId,
    action: "seed_simulated",
    entityType: "restaurant",
    entityId: restaurantId,
    detail: "Loaded labelled SIMULATED kitchen. Not a live restaurant.",
  });

  return { restaurantId };
}

export async function nextOrderNumberExport(sql: Sql): Promise<string> {
  return nextOrderNumber(sql);
}
