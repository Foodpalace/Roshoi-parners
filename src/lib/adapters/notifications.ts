import { platformConfig } from "@/lib/platform-config";
import type { NotificationPayload } from "@/lib/contracts";

export type ChannelStatus = {
  channel: "in_app" | "push" | "sms" | "whatsapp";
  connected: boolean;
  provider: string;
};

export function notificationChannelStatus(): ChannelStatus[] {
  return [
    { channel: "in_app", connected: true, provider: "platform" },
    { channel: "push", connected: false, provider: platformConfig.notifications.pushProvider },
    { channel: "sms", connected: false, provider: platformConfig.notifications.smsProvider },
    {
      channel: "whatsapp",
      connected: false,
      provider: platformConfig.notifications.whatsappProvider,
    },
  ];
}

/**
 * Deliver a notification. Only the in-app channel is implemented here.
 * SMS / WhatsApp / push adapters are explicit NOT CONNECTED stubs.
 */
export async function deliverNotification(
  insertInApp: (payload: NotificationPayload) => Promise<void>,
  payload: NotificationPayload,
): Promise<{ delivered: string[]; skipped: ChannelStatus[] }> {
  const status = notificationChannelStatus();
  const delivered: string[] = [];
  const skipped: ChannelStatus[] = [];
  for (const ch of payload.channels) {
    const st = status.find((s) => s.channel === ch);
    if (!st || !st.connected) {
      if (st) skipped.push(st);
      continue;
    }
    if (ch === "in_app") {
      await insertInApp(payload);
      delivered.push(ch);
    }
  }
  return { delivered, skipped };
}
