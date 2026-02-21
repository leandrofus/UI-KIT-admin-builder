import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';

// src/i18n/I18n.tsx
function deepMerge(target, source) {
  if (!source) return target;
  const out = Array.isArray(target) ? [...target] : { ...target || {} };
  Object.keys(source).forEach((key) => {
    const sVal = source[key];
    const tVal = out[key];
    if (sVal && typeof sVal === "object" && !Array.isArray(sVal)) {
      out[key] = deepMerge(tVal || {}, sVal);
    } else {
      out[key] = sVal;
    }
  });
  return out;
}
var uiKitGlobalTranslations = {};
var I18n = class {
  constructor(config = {}) {
    this.listeners = /* @__PURE__ */ new Set();
    this.hasAppliedGlobals = false;
    const baseDefaults = {
      defaultLocale: config.defaultLocale || "en",
      fallbackLocale: config.fallbackLocale || "en",
      locales: config.locales || [
        { code: "en", name: "English", direction: "ltr" }
      ],
      translations: config.translations || {},
      debug: config.debug || false
    };
    const providedTranslations = config.translations || {};
    const mergedTranslations = { ...providedTranslations };
    Object.keys(uiKitGlobalTranslations).forEach((locale) => {
      mergedTranslations[locale] = deepMerge(mergedTranslations[locale] || {}, uiKitGlobalTranslations[locale]);
    });
    this.config = {
      ...baseDefaults,
      translations: mergedTranslations
    };
    this.currentLocale = this.config.defaultLocale;
    this.hasAppliedGlobals = Object.keys(uiKitGlobalTranslations).length > 0;
  }
  /**
   * Manually update/merge translations after initialization
   */
  updateTranslations(translations) {
    Object.keys(translations).forEach((locale) => {
      this.config.translations[locale] = deepMerge(
        this.config.translations[locale] || {},
        translations[locale]
      );
    });
    this.notifyListeners();
  }
  /**
   * Sync with the global uiKitGlobalTranslations variable
   */
  syncGlobals() {
    if (Object.keys(uiKitGlobalTranslations).length > 0) {
      this.updateTranslations(uiKitGlobalTranslations);
    }
  }
  /**
   * Get current locale
   */
  get locale() {
    return this.currentLocale;
  }
  /**
   * Get current locale config
   */
  get localeConfig() {
    return this.config.locales.find((l) => l.code === this.currentLocale);
  }
  /**
   * Get all available locales
   */
  get availableLocales() {
    return this.config.locales;
  }
  /**
   * Set current locale
   */
  setLocale(locale) {
    if (this.config.translations[locale] || locale === this.config.fallbackLocale) {
      this.currentLocale = locale;
      this.notifyListeners();
    } else if (this.config.debug) {
      console.warn(`[i18n] Locale "${locale}" not found`);
    }
  }
  /**
   * Add translations for a locale
   */
  addTranslations(locale, translations) {
    this.config.translations[locale] = deepMerge(this.config.translations[locale] || {}, translations);
  }
  /**
   * Get a nested value from an object using dot notation
   */
  getNestedValue(obj, path) {
    if (!obj || !path) return void 0;
    if (typeof obj[path] === "string") return obj[path];
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const remainingPath = keys.slice(i).join(".");
      if (current && typeof current === "object" && typeof current[remainingPath] === "string") {
        return current[remainingPath];
      }
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return void 0;
      }
    }
    return typeof current === "string" ? current : void 0;
  }
  /**
   * Interpolate parameters into a string
   */
  interpolate(text, params) {
    if (!params) return text;
    return text.replace(/\{{1,2}(\w+)\}{1,2}/g, (match, key) => {
      if (key in params) {
        return String(params[key]);
      }
      return match;
    });
  }
  /**
   * Translate a key
   */
  t(key, params, fallback) {
    let translation = this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
    if (!translation && this.config.fallbackLocale) {
      translation = this.getNestedValue(
        this.config.translations[this.config.fallbackLocale] || {},
        key
      );
    }
    if (!translation) {
      const effectiveFallback = fallback || params?.default || params?.defaultValue;
      if (effectiveFallback) {
        return this.interpolate(effectiveFallback, params);
      }
      if (this.config.onMissingTranslation) {
        return this.config.onMissingTranslation(key, this.currentLocale);
      }
      if (this.config.debug) {
        console.warn(`[i18n] Missing translation: ${key} (${this.currentLocale})`);
      }
      return `!!${key}!!`;
    }
    return this.interpolate(translation, params);
  }
  /**
   * Resolve a human-friendly label for a key.
   *
   * - Returns the translated value if available
   * - If missing, returns the provided fallback string
   * - Otherwise, generates a humanized label from the last key segment
   */
  resolveLabel(key, fallback, namespace) {
    if (namespace) {
      const namespacedKey = `${namespace}.${key}`;
      const namespacedTranslation = this.getNestedValue(this.config.translations[this.currentLocale] || {}, namespacedKey) || this.config.fallbackLocale && this.getNestedValue(this.config.translations[this.config.fallbackLocale] || {}, namespacedKey);
      if (namespacedTranslation && typeof namespacedTranslation === "string") return namespacedTranslation;
    }
    const direct = this.getNestedValue(this.config.translations[this.currentLocale] || {}, key) || this.config.fallbackLocale && this.getNestedValue(this.config.translations[this.config.fallbackLocale] || {}, key);
    if (direct && typeof direct === "string") return direct;
    if (fallback) return fallback;
    return this.humanizeKeySegment(key);
  }
  /**
   * Humanize last key segment (used as fallback in multiple places)
   */
  humanizeKeySegment(key) {
    const last = key.split(".").pop() || key;
    let human = last.replace(/[_-]+/g, " ");
    human = human.replace(/([a-z])([A-Z])/g, "$1 $2");
    human = human.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return human;
  }
  /**
   * Translate with pluralization
   */
  tp(key, count, params) {
    const pluralKey = this.getPluralKey(count);
    const fullKey = `${key}.${pluralKey}`;
    let translation = this.t(fullKey, { ...params, count });
    if (translation === fullKey) {
      translation = this.t(`${key}.other`, { ...params, count });
    }
    if (translation === `${key}.other`) {
      translation = this.t(key, { ...params, count });
    }
    return translation;
  }
  /**
   * Get plural key based on count
   */
  getPluralKey(count) {
    if (count === 0) return "zero";
    if (count === 1) return "one";
    if (count === 2) return "two";
    if (count >= 3 && count <= 10) return "few";
    if (count >= 11 && count <= 99) return "many";
    return "other";
  }
  /**
   * Check if a translation exists
   */
  exists(key) {
    return !!this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
  }
  /**
   * Format a number according to locale
   */
  formatNumber(value, options) {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(
      this.currentLocale,
      options || localeConfig?.numberFormat
    ).format(value);
  }
  /**
   * Format currency
   */
  formatCurrency(value, currency) {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(this.currentLocale, {
      style: "currency",
      currency: currency || localeConfig?.currency || "USD"
    }).format(value);
  }
  /**
   * Format a date according to locale
   */
  formatDate(date, options) {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(this.currentLocale, options).format(d);
  }
  /**
   * Format relative time
   */
  formatRelativeTime(value, unit) {
    return new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: "auto"
    }).format(value, unit);
  }
  /**
   * Subscribe to locale changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * Notify all listeners of locale change
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentLocale));
  }
};
var i18nInstance = null;
function getI18n() {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}
function initI18n(config) {
  i18nInstance = new I18n(config);
  return i18nInstance;
}
function t(key, params, fallback) {
  return getI18n().t(key, params, fallback);
}
var tx = t;
function tp(key, count, params) {
  return getI18n().tp(key, count, params);
}
function resolveLabel(key, fallback, namespace) {
  return getI18n().resolveLabel(key, fallback, namespace);
}
var I18nContext = createContext(null);
function I18nProvider({ children, config, i18n }) {
  const [instance] = useState(() => i18n || new I18n(config));
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: instance, children });
}
function useI18n() {
  const context = useContext(I18nContext);
  const i18n = context || getI18n();
  const [locale, setLocaleState] = useState(i18n.locale);
  useEffect(() => {
    return i18n.subscribe(setLocaleState);
  }, [i18n]);
  const setLocale = useCallback((newLocale) => {
    i18n.setLocale(newLocale);
  }, [i18n]);
  const translate = useCallback((key, params, fallback) => {
    return i18n.t(key, params, fallback);
  }, [i18n]);
  const translatePlural = useCallback((key, count, params) => {
    return i18n.tp(key, count, params);
  }, [i18n]);
  return useMemo(() => ({
    t: translate,
    tp: translatePlural,
    locale,
    setLocale,
    locales: i18n.availableLocales,
    localeConfig: i18n.localeConfig,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    i18n
  }), [translate, translatePlural, locale, i18n]);
}
function useTranslatedValidation() {
  const { t: t2 } = useI18n();
  return useMemo(() => ({
    required: () => t2("validation.required"),
    email: () => t2("validation.email"),
    url: () => t2("validation.url"),
    min: (min) => t2("validation.min", { min }),
    max: (max) => t2("validation.max", { max }),
    minLength: (min) => t2("validation.minLength", { min }),
    maxLength: (max) => t2("validation.maxLength", { max }),
    pattern: () => t2("validation.pattern")
  }), [t2]);
}

export { I18n, I18nContext, I18nProvider, getI18n, initI18n, resolveLabel, t, tp, tx, uiKitGlobalTranslations, useI18n, useTranslatedValidation };
//# sourceMappingURL=chunk-UYGL6BIX.mjs.map
//# sourceMappingURL=chunk-UYGL6BIX.mjs.map