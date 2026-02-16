/**
 * @fileoverview Config System module exports
 * 
 * @module config-system
 */

// Config Validator
export {
  validateTableConfig,
  validateFormConfig,
  validateConfig,
  formatValidationErrors,
  assertValidConfig,
} from './ConfigValidator';
export type {
  ValidationError,
  ValidationResult,
  ValidatorOptions,
} from './ConfigValidator';

// Config Parser
export {
  parseTableConfig,
  parseFormConfig,
  parseConfig,
  ConfigLoader,
  createConfigLoader,
} from './ConfigParser';
export type {
  RawColumnConfig,
  RawFieldConfig,
  RawSectionConfig,
  RawTableConfig,
  RawFormConfig,
  ParserOptions,
  ConfigLoaderOptions,
} from './ConfigParser';

// Translate config (i18n keys in JSON configs)
export {
  translateConfig,
  isLikelyTranslationKey,
} from './translateConfig';
export type { I18nLike } from './translateConfig';

// Modal config (canonical format + parsing)
export {
  parseModalConfig,
  getModalTitle,
  getModalSubmitLabel,
} from './modalConfig';
export type {
  RawModalConfig,
  ParsedModalConfig,
  TitleOrLabelByMode as ModalTitleOrLabelByMode,
} from './modalConfig';
