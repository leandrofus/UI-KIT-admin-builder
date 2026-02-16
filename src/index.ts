/**
 * @fileoverview Dynamic UI Kit - Main Entry Point
 * 
 * A framework-agnostic, JSON-driven UI component library for building
 * dynamic tables, forms, and modals. Built with React but designed
 * for maximum flexibility and reusability.
 * 
 * @module @dnstyle/dynamic-ui-kit
 * @version 0.1.0
 * @license MIT
 * 
 * @example
 * // Basic import
 * import { usePaginatedData, useFormState } from '@dnstyle/dynamic-ui-kit';
 * 
 * // Import specific modules
 * import { validateConfig } from '@dnstyle/dynamic-ui-kit/config';
 * import { createServiceAdapter } from '@dnstyle/dynamic-ui-kit/adapters';
 * import { FieldRegistry } from '@dnstyle/dynamic-ui-kit/fields';
 */

// =============================================================================
// CORE EXPORTS
// =============================================================================

// Types - All primitive types and interfaces
export type {
  // Primitive types
  PrimitiveValue,
  FieldValue,
  DataRecord,
  SortDirection,

  // Pagination
  PaginationParams,
  PaginatedResponse,
  ServerTableQueryParams,

  // Fields
  FieldType,
  FieldOption,
  FieldCondition,
  FieldConfig,
  ValidationRule,
  FormSection,
  FormConfig,

  // Columns
  ColumnDataType,
  ColumnAlign,
  ColumnAction,
  StatusConfig,
  ColumnConfig,
  TableConfig,
  TableFilterConfig,
  PaginationConfig,
  SelectionConfig,

  // Filters
  FilterOperator,
  AdvancedFilter,

  // Event handlers
  TableEventHandlers,
  FormEventHandlers,

  // Modal mode
  ModalMode,

  // Utility types
  DeepPartial,
  KeysOfType,
  RequireKeys,
} from './core/types';

// Validators
export {
  validateRequired,
  validateMin,
  validateMax,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateEmail,
  validateUrl,
  validateField,
  validateForm,
  evaluateConditions,
} from './core/validators';

// Utilities
export {
  getNestedValue,
  setNestedValue,
  hasNestedValue,
  formatValue,
  formatDate,
  formatPhone,
  compareValues,
  sortData,
  matchesSearchTerm,
  filterBySearchTerm,
  paginateData,
  calculatePagination,
  generateId,
  getRowKey,
  deepMerge,
  debounce,
  throttle,
  cn,
  pick,
  omit,
} from './core/utils';
export type { FormatLocale } from './core/utils';

// =============================================================================
// HOOKS EXPORTS
// =============================================================================

export {
  usePaginatedData,
} from './hooks/usePaginatedData';
export type {
  PaginatedDataState,
  PaginatedDataActions,
  UsePaginatedDataOptions,
} from './hooks/usePaginatedData';

export { useServerTableData } from './hooks/useServerTableData';
export type {
  UseServerTableDataOptions,
  UseServerTableDataReturn,
} from './hooks/useServerTableData';
export type { SortState as ServerTableSortState } from './hooks/useServerTableData';

export {
  useFormState,
} from './hooks/useFormState';
export type {
  FormState,
  FormActions,
  FieldProps,
  UseFormStateOptions,
} from './hooks/useFormState';

export {
  useColumnConfig,
} from './hooks/useColumnConfig';
export type {
  ColumnConfigState,
  ColumnConfigActions,
  UseColumnConfigOptions,
} from './hooks/useColumnConfig';

export {
  useTableSelection,
} from './hooks/useTableSelection';
export type {
  TableSelectionState,
  TableSelectionActions,
  UseTableSelectionOptions,
} from './hooks/useTableSelection';

// Re-export components (so consumers can import from package root)
export * from './components';

// =============================================================================
// ADAPTERS EXPORTS
// =============================================================================

export {
  createServiceAdapter,
  createAxiosAdapter,
} from './adapters/ServiceAdapter';
export type {
  ServiceResponse,
  ListOptions,
  IServiceAdapter,
  ServiceAdapterConfig,
  RequestConfig,
  AxiosAdapterConfig,
} from './adapters/ServiceAdapter';

export {
  createFormAdapter,
  commonTransformers,
} from './adapters/FormAdapter';
export type {
  FieldTransformer,
  FormAdapterConfig,
  IFormAdapter,
} from './adapters/FormAdapter';

// =============================================================================
// FIELD SYSTEM EXPORTS
// =============================================================================

export {
  FieldRegistry,
  FieldRegistryContext,
  getDefaultRegistry,
  setDefaultRegistry,
  registerField,
  registerFields,
  getField,
  useFieldRegistry,
} from './field-system/FieldRegistry';
export type {
  BaseFieldProps,
  FieldComponent,
  FieldRegistration,
  FieldRegistryOptions,
} from './field-system/FieldRegistry';

export {
  useFieldFactory,
  createFieldFactory,
} from './field-system/FieldFactory';
export type {
  FieldFactoryOptions,
  RenderedFieldProps,
} from './field-system/FieldFactory';

export {
  TextField,
  NumberField,
  CurrencyField,
  TextareaField,
  SelectField,
  CheckboxField,
  SwitchField,
  HiddenField,
  baseFields,
} from './field-system/BaseFields';
export type {
  TextFieldProps,
  NumberFieldProps,
  CurrencyFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  SelectOption,
  CheckboxFieldProps,
  SwitchFieldProps,
} from './field-system/BaseFields';

// =============================================================================
// CONFIG SYSTEM EXPORTS
// =============================================================================

export {
  validateTableConfig,
  validateFormConfig,
  validateConfig,
  formatValidationErrors,
  assertValidConfig,
} from './config-system/ConfigValidator';
export type {
  ValidationError,
  ValidationResult,
  ValidatorOptions,
} from './config-system/ConfigValidator';

export {
  parseTableConfig,
  parseFormConfig,
  parseConfig,
  ConfigLoader,
  createConfigLoader,
} from './config-system/ConfigParser';
export type {
  RawColumnConfig,
  RawFieldConfig,
  RawSectionConfig,
  RawTableConfig,
  RawFormConfig,
  ParserOptions,
  ConfigLoaderOptions,
} from './config-system/ConfigParser';

export {
  translateConfig,
  isLikelyTranslationKey,
  parseModalConfig,
  getModalTitle,
  getModalSubmitLabel,
} from './config-system';
export type {
  I18nLike,
  RawModalConfig,
  ParsedModalConfig,
  ModalTitleOrLabelByMode,
} from './config-system';

// =============================================================================
// COMPONENT EXPORTS
// =============================================================================

export {
  TableRenderer,
  FormRenderer,
  DynamicModal,
  TableToolbar,
  SidebarRenderer,
} from './components';
export type {
  TableRendererProps,
  TableRendererRef,
  SortDirection as TableSortDirection,
  ColumnSortState,
  FilterValue,
  TableFilterState,
  FormRendererProps,
  TableToolbarProps,
  SidebarRendererProps,
  SidebarItem,
  SidebarItemType,
} from './components';

// =============================================================================
// I18N EXPORTS
// =============================================================================

export {
  I18n,
  I18nContext,
  I18nProvider,
  getI18n,
  initI18n,
  useI18n,
  useTranslatedValidation,
  t,
  tx,
  tp,
  resolveLabel,
  defaultEnTranslations,
  defaultEsTranslations,
} from './i18n/I18n';
export type {
  TranslationValue,
  TranslationDictionary,
  LocaleConfig,
  I18nConfig,
  InterpolationParams,
  PluralForms,
  I18nProviderProps,
} from './i18n/I18n';

// =============================================================================
// VERSION INFO
// =============================================================================

export const VERSION = '0.1.0';

export const LIB_INFO = {
  name: 'dynamic-ui-kit',
  version: VERSION,
  description: 'JSON-driven dynamic UI components for React',
  repository: 'https://github.com/leandrofus/UI-KIT-admin-builder',
};
