import { platformConfig, type AppLanguage } from "@/lib/platform-config";
import { bn } from "./bn";
import { en, type MessageKeySource, type MessageTree } from "./en";

export type { AppLanguage, MessageTree };

const dictionaries: Record<AppLanguage, MessageTree> = { en, bn };

type Leaves<T, P extends string = ""> = T extends string
  ? P
  : {
      [K in keyof T & string]: Leaves<T[K], P extends "" ? K : `${P}.${K}`>;
    }[keyof T & string];

export type MessageKey = Leaves<MessageKeySource>;

function lookup(tree: unknown, path: string): string | undefined {
  let cur: unknown = tree;
  for (const part of path.split(".")) {
    if (typeof cur !== "object" || cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(
  lang: AppLanguage,
  key: MessageKey | string,
  vars?: Record<string, string | number>,
): string {
  const dict = dictionaries[lang] ?? dictionaries[platformConfig.localization.defaultLanguage];
  let text = lookup(dict, key) ?? lookup(en, key) ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

export const dictionariesForAdmin = dictionaries;
