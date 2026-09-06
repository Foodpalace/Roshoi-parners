export function actionKey(orderId: string, action: string): string {
  if (typeof window === "undefined") return `${orderId}:${action}:${Date.now()}`;
  const k = `roshoi:idem:${orderId}:${action}`;
  try {
    const existing = sessionStorage.getItem(k);
    if (existing) return existing;
    const next = crypto.randomUUID();
    sessionStorage.setItem(k, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

export function clearActionKey(orderId: string, action: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(`roshoi:idem:${orderId}:${action}`);
  } catch {
    /* ignore */
  }
}
