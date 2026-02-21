/**
 * @fileoverview Internationalization (i18n) System
 * 
 * Provides a lightweight, framework-agnostic i18n solution for the UI kit.
 * Supports interpolation, pluralization, and nested keys.
 * 
 * @module i18n
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Translation value - can be a string or nested object
 */
export type TranslationValue = string | { [key: string]: TranslationValue };

/**
 * Translation dictionary
 */
export type TranslationDictionary = Record<string, TranslationValue>;

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** Locale code (e.g., 'en', 'es', 'pt-BR') */
  code: string;
  /** Display name */
  name: string;
  /** Text direction */
  direction?: 'ltr' | 'rtl';
  /** Date format */
  dateFormat?: string;
  /** Number format options */
  numberFormat?: Intl.NumberFormatOptions;
  /** Currency code */
  currency?: string;
}

/**
 * i18n configuration options
 */
export interface I18nConfig {
  /** Default locale */
  defaultLocale: string;
  /** Fallback locale when translation is missing */
  fallbackLocale?: string;
  /** Available locales */
  locales: LocaleConfig[];
  /** Translation dictionaries by locale */
  translations: Record<string, TranslationDictionary>;
  /** Missing translation handler */
  onMissingTranslation?: (key: string, locale: string) => string;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Interpolation parameters
 */
export type InterpolationParams = Record<string, string | number | boolean>;

/**
 * Plural forms
 */
export interface PluralForms {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

// Simple deep merge helper used for merging translation dictionaries
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const out = Array.isArray(target) ? [...target] : { ...(target || {}) };
  Object.keys(source).forEach(key => {
    const sVal = source[key];
    const tVal = out[key];
    if (sVal && typeof sVal === 'object' && !Array.isArray(sVal)) {
      out[key] = deepMerge(tVal || {}, sVal);
    } else {
      out[key] = sVal;
    }
  });
  return out;
}

// =============================================================================
// GLOBAL TRANSLATION OVERRIDES
// =============================================================================

/**
 * Global variable for overwriting default UI Kit translations.
 * Mutate this object before initializing the I18n class to apply global overrides.
 */
export const uiKitGlobalTranslations: Record<string, TranslationDictionary> = {};

// =============================================================================
// I18N CLASS
// =============================================================================

/**
 * I18n Manager - Handles translations and locale management
 */
export class I18n {
  private config: I18nConfig;
  private currentLocale: string;
  private listeners: Set<(locale: string) => void> = new Set();
  private hasAppliedGlobals: boolean = false;

  constructor(config: Partial<I18nConfig> = {}) {
    // Truly empty defaults
    const baseDefaults: I18nConfig = {
      defaultLocale: config.defaultLocale || 'en',
      fallbackLocale: config.fallbackLocale || 'en',
      locales: config.locales || [
        { code: 'en', name: 'English', direction: 'ltr' },
      ],
      translations: config.translations || {},
      debug: config.debug || false,
    };

    // Deep-merge provided translations into the base defaults
    const providedTranslations = config.translations || {};
    const mergedTranslations: Record<string, TranslationDictionary> = { ...providedTranslations };

    // Apply global UI kit custom translations if any
    Object.keys(uiKitGlobalTranslations).forEach(locale => {
      mergedTranslations[locale] = deepMerge(mergedTranslations[locale] || {}, uiKitGlobalTranslations[locale]);
    });

    this.config = {
      ...baseDefaults,
      translations: mergedTranslations,
    };

    this.currentLocale = this.config.defaultLocale;
    this.hasAppliedGlobals = Object.keys(uiKitGlobalTranslations).length > 0;
  }

  /**
   * Manually update/merge translations after initialization
   */
  updateTranslations(translations: Record<string, TranslationDictionary>): void {
    Object.keys(translations).forEach(locale => {
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
  syncGlobals(): void {
    if (Object.keys(uiKitGlobalTranslations).length > 0) {
      this.updateTranslations(uiKitGlobalTranslations);
    }
  }

  /**
   * Get current locale
   */
  get locale(): string {
    return this.currentLocale;
  }

  /**
   * Get current locale config
   */
  get localeConfig(): LocaleConfig | undefined {
    return this.config.locales.find(l => l.code === this.currentLocale);
  }

  /**
   * Get all available locales
   */
  get availableLocales(): LocaleConfig[] {
    return this.config.locales;
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
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
  addTranslations(locale: string, translations: TranslationDictionary): void {
    this.config.translations[locale] = deepMerge(this.config.translations[locale] || {}, translations);
  }

  /**
   * Get a nested value from an object using dot notation
   */
  private getNestedValue(obj: TranslationDictionary, path: string): string | undefined {
    if (!obj || !path) return undefined;

    // Try full path first (for flat dictionaries or keys with dots)
    if (typeof obj[path] === 'string') return obj[path] as string;

    const keys = path.split('.');
    let current: any = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      
      // Try to see if the rest of the path exists as a single key from here
      const remainingPath = keys.slice(i).join('.');
      if (current && typeof current === 'object' && typeof current[remainingPath] === 'string') {
        return current[remainingPath];
      }

      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Interpolate parameters into a string
   */
  private interpolate(text: string, params?: InterpolationParams): string {
    if (!params) return text;

    // Support both {{key}} and {key} formats
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
  t(key: string, params?: InterpolationParams, fallback?: string): string {
    // Try current locale
    let translation = this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );

    // Try fallback locale
    if (!translation && this.config.fallbackLocale) {
      translation = this.getNestedValue(
        this.config.translations[this.config.fallbackLocale] || {},
        key
      );
    }

    // Handle missing translation
    if (!translation) {
      if (this.config.debug) {
        console.warn(`[i18n] Missing translation: ${key} (${this.currentLocale})`);
      }

      // ALWAYS return the key indicator if translation is missing.
      // This forces the host app to provide all necessary translations.
      return `!!${key}!!`;
    }

    return this.interpolate(translation, params);
  }

  /**
   * Resolve a human-friendly label for a key.
   *
   * - Returns the translated value if available
   * - Otherwise, returns the key indicator !!key!! to force host app mapping.
   */
  resolveLabel(key: string, fallback?: string, namespace?: string): string {
    // 1. Try namespace-prefixed lookup first if provided
    if (namespace) {
      const namespacedKey = `${namespace}.${key}`;
      const namespacedTranslation = this.getNestedValue(this.config.translations[this.currentLocale] || {}, namespacedKey)
        || (this.config.fallbackLocale && this.getNestedValue(this.config.translations[this.config.fallbackLocale] || {}, namespacedKey));
      
      if (namespacedTranslation && typeof namespacedTranslation === 'string') return namespacedTranslation;
    }

    // 2. Prefer direct translation lookup
    const direct = this.getNestedValue(this.config.translations[this.currentLocale] || {}, key)
      || (this.config.fallbackLocale && this.getNestedValue(this.config.translations[this.config.fallbackLocale] || {}, key));

    if (direct && typeof direct === 'string') return direct;

    // ALWAYS return the key indicator if translation is missing.
    return `!!${key}!!`;
  }

  /**
   * Humanize last key segment (used as fallback in multiple places)
   */
  private humanizeKeySegment(key: string): string {
    const last = key.split('.').pop() || key;
    let human = last.replace(/[_-]+/g, ' ');
    human = human.replace(/([a-z])([A-Z])/g, '$1 $2');
    human = human
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return human;
  }

  /**
   * Translate with pluralization
   */
  tp(key: string, count: number, params?: InterpolationParams): string {
    const pluralKey = this.getPluralKey(count);
    const fullKey = `${key}.${pluralKey}`;

    // Try the plural form
    let translation = this.t(fullKey, { ...params, count });

    // If not found, try 'other' as fallback
    if (translation === fullKey) {
      translation = this.t(`${key}.other`, { ...params, count });
    }

    // If still not found, try the base key
    if (translation === `${key}.other`) {
      translation = this.t(key, { ...params, count });
    }

    return translation;
  }

  /**
   * Get plural key based on count
   */
  private getPluralKey(count: number): keyof PluralForms {
    if (count === 0) return 'zero';
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    if (count >= 3 && count <= 10) return 'few';
    if (count >= 11 && count <= 99) return 'many';
    return 'other';
  }

  /**
   * Check if a translation exists
   */
  exists(key: string): boolean {
    return !!this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
  }

  /**
   * Format a number according to locale
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(
      this.currentLocale,
      options || localeConfig?.numberFormat
    ).format(value);
  }

  /**
   * Format currency
   */
  formatCurrency(value: number, currency?: string): string {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency: currency || localeConfig?.currency || 'USD',
    }).format(value);
  }

  /**
   * Format a date according to locale
   */
  formatDate(
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(this.currentLocale, options).format(d);
  }

  /**
   * Format relative time
   */
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    return new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: 'auto',
    }).format(value, unit);
  }

  /**
   * Subscribe to locale changes
   */
  subscribe(listener: (locale: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of locale change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLocale));
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let i18nInstance: I18n | null = null;

/**
 * Get the global i18n instance
 */
export function getI18n(): I18n {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}

/**
 * Initialize or replace the global i18n instance
 */
export function initI18n(config?: Partial<I18nConfig>): I18n {
  i18nInstance = new I18n(config);
  return i18nInstance;
}

/**
 * Shorthand translation function
 */
/**
 * Shorthand translation function (canonical)
 */
export function t(key: string, params?: InterpolationParams, fallback?: string): string {
  return getI18n().t(key, params, fallback);
}

/**
 * Shorthand translation function (alias for compatibility)
 */
export const tx = t;



/**
 * Shorthand plural translation function
 */
export function tp(key: string, count: number, params?: InterpolationParams): string {
  return getI18n().tp(key, count, params);
}

/**
 * Resolve a label for a given key with humanized fallback when missing
 */
export function resolveLabel(key: string, fallback?: string, namespace?: string): string {
  return getI18n().resolveLabel(key, fallback, namespace);
}

// =============================================================================
// REACT INTEGRATION
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

/**
 * I18n Context
 */
export const I18nContext = createContext<I18n | null>(null);

/**
 * I18n Provider Props
 */
export interface I18nProviderProps {
  children: ReactNode;
  config?: Partial<I18nConfig>;
  i18n?: I18n;
}

/**
 * I18n Provider Component
 */
export function I18nProvider({ children, config, i18n }: I18nProviderProps): JSX.Element {
  const [instance] = useState(() => i18n || new I18n(config));

  return (
    <I18nContext.Provider value={instance}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use i18n
 */
export function useI18n() {
  const context = useContext(I18nContext);
  const i18n = context || getI18n();

  const [locale, setLocaleState] = useState(i18n.locale);

  useEffect(() => {
    return i18n.subscribe(setLocaleState);
  }, [i18n]);

  const setLocale = useCallback((newLocale: string) => {
    i18n.setLocale(newLocale);
  }, [i18n]);

  const translate = useCallback((key: string, params?: InterpolationParams, fallback?: string) => {
    return i18n.t(key, params, fallback);
  }, [i18n]);

  const translatePlural = useCallback((key: string, count: number, params?: InterpolationParams) => {
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
    i18n,
  }), [translate, translatePlural, locale, i18n]);
}

/**
 * Hook for translated validation messages
 */
export function useTranslatedValidation() {
  const { t } = useI18n();

  return useMemo(() => ({
    required: () => t('validation.required'),
    email: () => t('validation.email'),
    url: () => t('validation.url'),
    min: (min: number) => t('validation.min', { min }),
    max: (max: number) => t('validation.max', { max }),
    minLength: (min: number) => t('validation.minLength', { min }),
    maxLength: (max: number) => t('validation.maxLength', { max }),
    pattern: () => t('validation.pattern'),
  }), [t]);
}

export default I18n;
