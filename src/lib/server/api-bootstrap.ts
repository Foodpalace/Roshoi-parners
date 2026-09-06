import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { platformConfig } from "@/lib/platform-config";
import { notificationChannelStatus } from "@/lib/adapters/notifications";
import { storageAdapter } from "@/lib/adapters/storage";
import { dispatchAdapter } from "@/lib/adapters/dispatch";
import { newId } from "@/lib/utils";
import { loadMemberships, writeAudit } from "./helpers";
import { seedSimulatedKitchen } from "./demo-seed";
import { validateUpload } from "@/lib/adapters/storage";

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
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
        supportEmail: platformConfig.support.email,
      },
      featureFlags: platformConfig.featureFlags,
      adapters: {
        notifications: notificationChannelStatus(),
        storage: { connected: storageAdapter.connected, provider: storageAdapter.provider },
        dispatch: { connected: dispatchAdapter.connected, provider: dispatchAdapter.provider },
        payments: { connected: false, provider: "NOT_CONNECTED" },
        ai: { connected: Boolean(process.env.XAI_API_KEY), provider: process.env.XAI_API_KEY ? "xAI" : "NOT_CONNECTED" },
      },
      commissionOptionsBps: [...platformConfig.commission.allowedBps],
    };
  });

export const loadSimulatedKitchen = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const result = await seedSimulatedKitchen(sql, context.userId);
    return { ok: true as const, restaurantId: result.restaurantId, dataLabel: "SIMULATED" as const };
  });

export const createRestaurantDraft = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    name: string;
    displayName: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    landmark?: string;
    cuisine?: string;
    diet?: string;
    description?: string;
  }) => d)
  .handler(async ({ context, data }) => {
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
    for (let day = 0; day <= 6; day++) {
      await sql`
        insert into restaurant_hours (id, restaurant_id, outlet_id, weekday, open_minutes, close_minutes)
        values (${newId("hrs")}, ${restaurantId}, ${outletId}, ${day}, ${11 * 60}, ${22 * 60})
      `;
    }
    await writeAudit(sql, {
      restaurantId,
      actorUserId: context.userId,
      action: "create_draft",
      entityType: "restaurant",
      entityId: restaurantId,
    });
    return { ok: true as const, restaurantId, verificationStatus: "DRAFT" as const, dataLabel: "REAL" as const };
  });

export const updateRestaurantProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    restaurantId?: string;
    name?: string;
    displayName?: string;
    ownerName?: string;
    phone?: string;
    email?: string;
    address?: string;
    landmark?: string;
    serviceArea?: string;
    cuisine?: string;
    diet?: string;
    description?: string;
    gstin?: string;
    fssaiNumber?: string;
    pan?: string;
    prepMinutes?: number;
    peakPrepMinutes?: number;
    minOrderPaise?: number;
    packingPaise?: number;
    contactPersons?: string;
    lat?: number;
    lng?: number;
    deliveryAvailable?: boolean;
    weeklyHolidays?: string;
    bankAccount?: string;
    bankIfsc?: string;
    bankName?: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const { withVendor } = await import("./helpers");
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
        "contact_persons",
      ] as const;
      const map: Record<string, string> = {
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
        weeklyHolidays: "weekly_holidays",
      };
      for (const [k, col] of Object.entries(map)) {
        if (data[k as keyof typeof data] === undefined) continue;
        if (!fields.includes(col as (typeof fields)[number]) && !["lat", "lng", "delivery_available", "weekly_holidays"].includes(col)) {
          continue;
        }
        const v = data[k as keyof typeof data];
        await sql.query(`update restaurants set ${col} = $1, updated_at = now() where id = $2`, [
          v,
          ctx.restaurantId,
        ]);
      }
      if (data.bankAccount !== undefined || data.bankIfsc !== undefined || data.bankName !== undefined) {
        const { assertCan } = await import("@/lib/rbac");
        assertCan(ctx.role, "settings.financial");
        if (data.bankAccount !== undefined) {
          await sql`update restaurants set bank_account = ${String(data.bankAccount)}, updated_at = now() where id = ${ctx.restaurantId}`;
        }
        if (data.bankIfsc !== undefined) {
          await sql`update restaurants set bank_ifsc = ${String(data.bankIfsc)}, updated_at = now() where id = ${ctx.restaurantId}`;
        }
        if (data.bankName !== undefined) {
          await sql`update restaurants set bank_name = ${String(data.bankName)}, updated_at = now() where id = ${ctx.restaurantId}`;
        }
      }
      return { ok: true as const };
    });
  });

export const submitForReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId: string }) => d)
  .handler(async ({ context, data }) => {
    const { withVendor } = await import("./helpers");
    return withVendor(context.userId, data.restaurantId, "onboarding.edit", async (sql, ctx) => {
      if (ctx.dataLabel === "SIMULATED") {
        throw new Error("A simulated kitchen cannot be submitted for verification.");
      }
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
        entityId: ctx.restaurantId,
      });
      return { ok: true as const, verificationStatus: "SUBMITTED" as const };
    });
  });

export const getRestaurant = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { restaurantId?: string }) => d)
  .handler(async ({ context, data }) => {
    const { withVendor } = await import("./helpers");
    return withVendor(context.userId, data.restaurantId, "dashboard.view", async (sql, ctx) => {
      const rows = await sql<{
        id: string;
        name: string;
        display_name: string;
        owner_name: string;
        phone: string;
        email: string;
        address: string;
        landmark: string;
        cuisine: string;
        diet: string;
        description: string;
        gstin: string;
        fssai_number: string;
        pan: string;
        bank_account: string;
        bank_ifsc: string;
        bank_name: string;
        verification_status: string;
        data_label: string;
        commission_bps: number;
        packing_paise: number;
        prep_minutes: number;
        peak_prep_minutes: number;
        min_order_paise: number;
        emergency_closed: boolean;
        vacation_mode: boolean;
        weekly_holidays: string;
        lat: number | null;
        lng: number | null;
      }>`
        select id, name, display_name, owner_name, phone, email, address, landmark,
               cuisine, diet, description, gstin, fssai_number, pan,
               bank_account, bank_ifsc, bank_name, verification_status, data_label,
               commission_bps, packing_paise, prep_minutes, peak_prep_minutes,
               min_order_paise, emergency_closed, vacation_mode, weekly_holidays, lat, lng
        from restaurants where id = ${ctx.restaurantId} limit 1
      `;
      const hours = await sql<{ weekday: number; open_minutes: number; close_minutes: number }>`
        select weekday, open_minutes, close_minutes from restaurant_hours
        where restaurant_id = ${ctx.restaurantId} order by weekday, open_minutes
      `;
      const docs = await sql<{
        id: string;
        kind: string;
        file_name: string;
        status: string;
        verification_status: string;
        byte_size: number;
        storage_backend: string;
      }>`
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
        storageConnected: storageAdapter.connected,
      };
    });
  });

export const uploadDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    restaurantId: string;
    kind: string;
    fileName: string;
    contentType: string;
    dataUrl: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const { withVendor } = await import("./helpers");
    return withVendor(context.userId, data.restaurantId, "documents.upload", async (sql, ctx) => {
      const comma = data.dataUrl.indexOf(",");
      const b64 = comma >= 0 ? data.dataUrl.slice(comma + 1) : data.dataUrl;
      const byteSize = Math.floor((b64.length * 3) / 4);
      const check = validateUpload({ contentType: data.contentType, byteSize, kind: "document" });
      if (!check.ok) throw new Error(check.error);
      const stored = await storageAdapter.put({
        key: `${ctx.restaurantId}/${data.kind}/${data.fileName}`,
        contentType: data.contentType,
        bytes: new Uint8Array(byteSize),
      });
      const id = newId("doc");
      await sql`
        insert into restaurant_documents (
          id, restaurant_id, kind, file_name, content_type, byte_size,
          storage_backend, storage_key, data_url, status, verification_status
        ) values (
          ${id}, ${ctx.restaurantId}, ${data.kind}, ${data.fileName}, ${data.contentType},
          ${byteSize}, ${stored.backend}, ${stored.key}, ${data.dataUrl.slice(0, 200000)},
          'uploaded', 'PENDING'
        )
      `;
      return {
        ok: true as const,
        id,
        storage: "NOT_CONNECTED" as const,
        verificationStatus: "PENDING" as const,
      };
    });
  });
