export { A as AdvancedFilter, C as ColumnAction, a as ColumnAlign, b as ColumnConfig, c as ColumnDataType, D as DataRecord, d as DeepPartial, F as FieldCondition, e as FieldConfig, f as FieldOption, g as FieldType, h as FieldValue, i as FilterOperator, j as FormConfig, k as FormEventHandlers, l as FormSection, K as KeysOfType, M as ModalMode, P as PaginatedResponse, m as PaginationConfig, n as PaginationParams, o as PrimitiveValue, R as RequireKeys, S as SelectionConfig, p as ServerTableQueryParams, q as SortDirection, r as StatusConfig, T as TableConfig, s as TableEventHandlers, t as TableFilterConfig, V as ValidationRule } from './types-L6joewgw.js';
export { FormatLocale, calculatePagination, cn, compareValues, debounce, deepMerge, evaluateConditions, filterBySearchTerm, formatDate, formatPhone, formatValue, generateId, getNestedValue, getRowKey, hasNestedValue, matchesSearchTerm, omit, paginateData, pick, setNestedValue, sortData, throttle, validateEmail, validateField, validateForm, validateMax, validateMaxLength, validateMin, validateMinLength, validatePattern, validateRequired, validateUrl } from './core/index.js';
export { ColumnConfigActions, ColumnConfigState, FieldProps, FormActions, FormState, PaginatedDataActions, PaginatedDataState, ServerTableSortState, TableSelectionActions, TableSelectionState, UseColumnConfigOptions, UseFormStateOptions, UsePaginatedDataOptions, UseServerTableDataOptions, UseServerTableDataReturn, UseTableSelectionOptions, useColumnConfig, useFormState, usePaginatedData, useServerTableData, useTableSelection } from './hooks/index.js';
export { AdvancedSearchFieldConfig, AdvancedSearchFieldOption, AdvancedSearchFieldType, AdvancedSearchModal, AdvancedSearchModalProps, ColumnSortState, ConfirmationConfig, DynamicModal, DynamicModalProps, DynamicModalRef, FieldRenderProps, FilterValue, FormErrors, FormRenderer, FormRendererProps, FormRendererRef, FormTouched, FormValues, KanbanColumnDef, KanbanItem, KanbanRenderer, KanbanRendererProps, ModalAction, ModalSize, ModalTab, SectionRenderProps, SidebarItem, SidebarItemType, SidebarRenderer, SidebarRendererProps, TabItem, TabRenderer, TabRendererProps, TableFilterState, TableRenderer, TableRendererProps, TableRendererRef, SortDirection as TableSortDirection, TableToolbar, TableToolbarProps, TitleOrLabelByMode } from './components/index.js';
export { AxiosAdapterConfig, FieldTransformer, FormAdapterConfig, IFormAdapter, IServiceAdapter, ListOptions, RequestConfig, ServiceAdapterConfig, ServiceResponse, commonTransformers, createAxiosAdapter, createFormAdapter, createServiceAdapter } from './adapters/index.js';
export { BaseFieldProps, CheckboxField, CheckboxFieldProps, CurrencyField, CurrencyFieldProps, FieldComponent, FieldFactoryOptions, FieldRegistration, FieldRegistry, FieldRegistryContext, FieldRegistryOptions, HiddenField, NumberField, NumberFieldProps, RenderedFieldProps, SelectField, SelectFieldProps, SelectOption, SwitchField, SwitchFieldProps, TextField, TextFieldProps, TextareaField, TextareaFieldProps, baseFields, createFieldFactory, getDefaultRegistry, getField, registerField, registerFields, setDefaultRegistry, useFieldFactory, useFieldRegistry } from './field-system/index.js';
export { ConfigLoader, ConfigLoaderOptions, I18nLike, ModalTitleOrLabelByMode, ParsedModalConfig, ParserOptions, RawColumnConfig, RawFieldConfig, RawFormConfig, RawModalConfig, RawSectionConfig, RawTableConfig, ValidationError, ValidationResult, ValidatorOptions, assertValidConfig, createConfigLoader, formatValidationErrors, getModalSubmitLabel, getModalTitle, isLikelyTranslationKey, parseConfig, parseFormConfig, parseModalConfig, parseTableConfig, translateConfig, validateConfig, validateFormConfig, validateTableConfig } from './config-system/index.js';
export { I18n, I18nConfig, I18nContext, I18nProvider, I18nProviderProps, InterpolationParams, LocaleConfig, PluralForms, TranslationDictionary, TranslationValue, defaultEnTranslations, defaultEsTranslations, getI18n, initI18n, resolveLabel, t, tp, tx, useI18n, useTranslatedValidation } from './i18n/index.js';
import 'react';
import 'react/jsx-runtime';

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

declare const VERSION = "0.1.0";
declare const LIB_INFO: {
    name: string;
    version: string;
    description: string;
    repository: string;
};

export { LIB_INFO, VERSION };
