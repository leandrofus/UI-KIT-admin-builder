/**
 * @fileoverview i18n module exports
 * 
 * @module i18n
 */

export {
  I18n,
  I18nContext,
  I18nProvider,
  getI18n,
  initI18n,
  t,
  tx,
  tp,
  resolveLabel,
  useI18n,
  useTranslatedValidation,
  uiKitGlobalTranslations,
} from './I18n';

export type {
  TranslationValue,
  TranslationDictionary,
  LocaleConfig,
  I18nConfig,
  InterpolationParams,
  PluralForms,
  I18nProviderProps,
} from './I18n';
