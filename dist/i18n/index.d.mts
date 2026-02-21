import * as React from 'react';
import { ReactNode } from 'react';

/**
 * @fileoverview Internationalization (i18n) System
 *
 * Provides a lightweight, framework-agnostic i18n solution for the UI kit.
 * Supports interpolation, pluralization, and nested keys.
 *
 * @module i18n
 */
/**
 * Translation value - can be a string or nested object
 */
type TranslationValue = string | {
    [key: string]: TranslationValue;
};
/**
 * Translation dictionary
 */
type TranslationDictionary = Record<string, TranslationValue>;
/**
 * Locale configuration
 */
interface LocaleConfig {
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
interface I18nConfig {
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
type InterpolationParams = Record<string, string | number | boolean>;
/**
 * Plural forms
 */
interface PluralForms {
    zero?: string;
    one: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
}
/**
 * Global variable for overwriting default UI Kit translations.
 * Mutate this object before initializing the I18n class to apply global overrides.
 */
declare const uiKitGlobalTranslations: Record<string, TranslationDictionary>;
/**
 * I18n Manager - Handles translations and locale management
 */
declare class I18n {
    private config;
    private currentLocale;
    private listeners;
    private hasAppliedGlobals;
    constructor(config?: Partial<I18nConfig>);
    /**
     * Manually update/merge translations after initialization
     */
    updateTranslations(translations: Record<string, TranslationDictionary>): void;
    /**
     * Sync with the global uiKitGlobalTranslations variable
     */
    syncGlobals(): void;
    /**
     * Get current locale
     */
    get locale(): string;
    /**
     * Get current locale config
     */
    get localeConfig(): LocaleConfig | undefined;
    /**
     * Get all available locales
     */
    get availableLocales(): LocaleConfig[];
    /**
     * Set current locale
     */
    setLocale(locale: string): void;
    /**
     * Add translations for a locale
     */
    addTranslations(locale: string, translations: TranslationDictionary): void;
    /**
     * Get a nested value from an object using dot notation
     */
    private getNestedValue;
    /**
     * Interpolate parameters into a string
     */
    private interpolate;
    /**
     * Translate a key
     */
    t(key: string, params?: InterpolationParams, fallback?: string): string;
    /**
     * Resolve a human-friendly label for a key.
     *
     * - Returns the translated value if available
     * - If missing, returns the provided fallback string
     * - Otherwise, generates a humanized label from the last key segment
     */
    resolveLabel(key: string, fallback?: string, namespace?: string): string;
    /**
     * Humanize last key segment (used as fallback in multiple places)
     */
    private humanizeKeySegment;
    /**
     * Translate with pluralization
     */
    tp(key: string, count: number, params?: InterpolationParams): string;
    /**
     * Get plural key based on count
     */
    private getPluralKey;
    /**
     * Check if a translation exists
     */
    exists(key: string): boolean;
    /**
     * Format a number according to locale
     */
    formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
    /**
     * Format currency
     */
    formatCurrency(value: number, currency?: string): string;
    /**
     * Format a date according to locale
     */
    formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string;
    /**
     * Format relative time
     */
    formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string;
    /**
     * Subscribe to locale changes
     */
    subscribe(listener: (locale: string) => void): () => void;
    /**
     * Notify all listeners of locale change
     */
    private notifyListeners;
}
/**
 * Get the global i18n instance
 */
declare function getI18n(): I18n;
/**
 * Initialize or replace the global i18n instance
 */
declare function initI18n(config?: Partial<I18nConfig>): I18n;
/**
 * Shorthand translation function
 */
/**
 * Shorthand translation function (canonical)
 */
declare function t(key: string, params?: InterpolationParams, fallback?: string): string;
/**
 * Shorthand translation function (alias for compatibility)
 */
declare const tx: typeof t;
/**
 * Shorthand plural translation function
 */
declare function tp(key: string, count: number, params?: InterpolationParams): string;
/**
 * Resolve a label for a given key with humanized fallback when missing
 */
declare function resolveLabel(key: string, fallback?: string, namespace?: string): string;

/**
 * I18n Context
 */
declare const I18nContext: React.Context<I18n | null>;
/**
 * I18n Provider Props
 */
interface I18nProviderProps {
    children: ReactNode;
    config?: Partial<I18nConfig>;
    i18n?: I18n;
}
/**
 * I18n Provider Component
 */
declare function I18nProvider({ children, config, i18n }: I18nProviderProps): JSX.Element;
/**
 * Hook to use i18n
 */
declare function useI18n(): {
    t: (key: string, params?: InterpolationParams, fallback?: string) => string;
    tp: (key: string, count: number, params?: InterpolationParams) => string;
    locale: string;
    setLocale: (newLocale: string) => void;
    locales: LocaleConfig[];
    localeConfig: LocaleConfig | undefined;
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
    formatCurrency: (value: number, currency?: string) => string;
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
    i18n: I18n;
};
/**
 * Hook for translated validation messages
 */
declare function useTranslatedValidation(): {
    required: () => string;
    email: () => string;
    url: () => string;
    min: (min: number) => string;
    max: (max: number) => string;
    minLength: (min: number) => string;
    maxLength: (max: number) => string;
    pattern: () => string;
};

export { I18n, type I18nConfig, I18nContext, I18nProvider, type I18nProviderProps, type InterpolationParams, type LocaleConfig, type PluralForms, type TranslationDictionary, type TranslationValue, getI18n, initI18n, resolveLabel, t, tp, tx, uiKitGlobalTranslations, useI18n, useTranslatedValidation };
