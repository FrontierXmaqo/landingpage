import en, { type Dictionary } from "./dictionaries/en";
import cn from "./dictionaries/cn";
import ms from "./dictionaries/ms";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, cn, ms };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** fill("{count} panels", { count: 8 }) -> "8 panels" */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}
