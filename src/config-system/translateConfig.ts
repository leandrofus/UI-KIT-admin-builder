/**
 * @fileoverview Translate config - Resolve i18n keys in JSON configs
 *
 * Walks any config object and replaces string values that look like i18n keys
 * with the translated value using the library's I18n (or a provided instance).
 *
 * @module config-system/translateConfig
 */

import { getI18n } from '../i18n/I18n';

/** i18n interface used for translation (t and optional resolveLabel) */
export interface I18nLike {
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
  resolveLabel?: (key: string, fallback?: string) => string;
}

/**
 * Heuristic: determines if a string looks like an i18n key (e.g. 'product.modal.create').
 * - Contains at least one dot
 * - Only letters, numbers, underscore, dash and dots
 * - No spaces
 */
export function isLikelyTranslationKey(s: string): boolean {
  if (typeof s !== 'string') return false;
  if (s.indexOf(' ') !== -1) return false;
  return /[.]/.test(s) && /^[A-Za-z0-9._-]+$/.test(s);
}

/**
 * Recursively translates all string values in a config that look like i18n keys.
 * Uses the provided i18n instance or the library's getI18n().
 * Does not mutate the original object; returns a deep copy with translated strings.
 */
export function translateConfig<T>(
  obj: T,
  i18nInstance?: I18nLike
): T {
  const i18n = i18nInstance ?? (getI18n() as I18nLike);

  function rec(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(rec);
    if (value !== null && typeof value === 'object') {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(value as Record<string, unknown>)) {
        out[k] = rec((value as Record<string, unknown>)[k]);
      }
      return out;
    }
    if (typeof value === 'string') {
      if (isLikelyTranslationKey(value)) {
        const translated = i18n.t(value);
        if (translated && translated !== value) return translated;
        return i18n.resolveLabel ? i18n.resolveLabel(value, value) : value;
      }
      return value;
    }
    return value;
  }

  return rec(obj) as T;
}
