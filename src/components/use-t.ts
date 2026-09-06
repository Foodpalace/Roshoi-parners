import { translate, type MessageKey } from "@/lib/i18n";
import { useClientState } from "@/lib/client-state";

export function useT() {
  const lang = useClientState((s) => s.lang);
  return (key: MessageKey | string, vars?: Record<string, string | number>) =>
    translate(lang, key, vars);
}

export function useLang() {
  return useClientState((s) => s.lang);
}
