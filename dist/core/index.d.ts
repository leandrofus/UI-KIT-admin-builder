import { F as FieldCondition, D as DataRecord, h as FieldValue, e as FieldConfig, V as ValidationRule, q as SortDirection, c as ColumnDataType } from '../types-L6joewgw.js';
export { A as AdvancedFilter, C as ColumnAction, a as ColumnAlign, b as ColumnConfig, d as DeepPartial, f as FieldOption, g as FieldType, i as FilterOperator, j as FormConfig, k as FormEventHandlers, l as FormSection, K as KeysOfType, M as ModalMode, P as PaginatedResponse, m as PaginationConfig, n as PaginationParams, o as PrimitiveValue, R as RequireKeys, S as SelectionConfig, p as ServerTableQueryParams, r as StatusConfig, u as TabConfig, T as TableConfig, s as TableEventHandlers, t as TableFilterConfig } from '../types-L6joewgw.js';

/**
 * @fileoverview Pure validation functions for Dynamic UI Kit
 *
 * All validators are pure functions with no side effects.
 * They can be used independently or composed together.
 *
 * @module core/validators
 */

/**
 * Result of a single validation
 */
interface ValidationResult {
    /** Whether validation passed */
    valid: boolean;
    /** Error message if validation failed */
    message?: string;
}
/**
 * Result of validating all fields
 */
interface FormValidationResult {
    /** Whether all validations passed */
    valid: boolean;
    /** Map of field names to error messages */
    errors: Record<string, string>;
}
/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
declare function isEmpty(value: FieldValue): boolean;
/**
 * Check if value is not empty
 */
declare function isNotEmpty(value: FieldValue): boolean;
/**
 * Validate required field
 */
declare function validateRequired(value: FieldValue, message?: string): ValidationResult;
/**
 * Validate minimum value (for numbers)
 */
declare function validateMin(value: FieldValue, min: number, message?: string): ValidationResult;
/**
 * Validate maximum value (for numbers)
 */
declare function validateMax(value: FieldValue, max: number, message?: string): ValidationResult;
/**
 * Validate minimum length (for strings and arrays)
 */
declare function validateMinLength(value: FieldValue, minLength: number, message?: string): ValidationResult;
/**
 * Validate maximum length (for strings and arrays)
 */
declare function validateMaxLength(value: FieldValue, maxLength: number, message?: string): ValidationResult;
/**
 * Validate against a regex pattern
 */
declare function validatePattern(value: FieldValue, pattern: string | RegExp, message?: string): ValidationResult;
/**
 * Validate email format
 */
declare function validateEmail(value: FieldValue, message?: string): ValidationResult;
/**
 * Validate URL format
 */
declare function validateUrl(value: FieldValue, message?: string): ValidationResult;
/**
 * Validate phone number format (basic)
 */
declare function validatePhone(value: FieldValue, message?: string): ValidationResult;
/**
 * Apply a single validation rule to a value
 */
declare function applyValidationRule(value: FieldValue, rule: ValidationRule, formData?: DataRecord): ValidationResult;
/**
 * Validate a field value against all its rules
 */
declare function validateField(value: FieldValue, field: FieldConfig, formData?: DataRecord): ValidationResult;
/**
 * Validate all fields in a form
 */
declare function validateForm(formData: DataRecord, fields: FieldConfig[]): FormValidationResult;
/**
 * Evaluate a single field condition
 */
declare function evaluateCondition(condition: FieldCondition, formData: DataRecord, featureFlags?: Record<string, boolean>): boolean;
/**
 * Evaluate multiple conditions (AND logic)
 */
declare function evaluateConditions(conditions: FieldCondition | FieldCondition[], formData: DataRecord, featureFlags?: Record<string, boolean>): boolean;
/**
 * Validate a field configuration
 */
declare function validateFieldConfig(config: unknown): {
    valid: boolean;
    errors: string[];
};
/**
 * Validate a column configuration
 */
declare function validateColumnConfig(config: unknown): {
    valid: boolean;
    errors: string[];
};

/**
 * @fileoverview Pure utility functions for Dynamic UI Kit
 *
 * All utilities are pure functions with no side effects.
 * They handle common operations like value access, formatting, and transformation.
 *
 * @module core/utils
 */

/**
 * Get a nested value from an object using dot notation
 *
 * @example
 * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 * getNestedValue({ items: [{ id: 1 }] }, 'items.0.id') // 1
 */
declare function getNestedValue<T = FieldValue>(obj: DataRecord | null | undefined, path: string, defaultValue?: T): T | undefined;
/**
 * Set a nested value in an object using dot notation (immutably)
 *
 * @example
 * setNestedValue({ user: { name: 'John' } }, 'user.name', 'Jane')
 * // { user: { name: 'Jane' } }
 */
declare function setNestedValue<T extends DataRecord>(obj: T, path: string, value: FieldValue): T;
/**
 * Check if a value exists at the given path
 */
declare function hasNestedValue(obj: DataRecord | null | undefined, path: string): boolean;
/**
 * Locale configuration for formatting
 */
interface FormatLocale {
    locale?: string;
    currency?: string;
    timezone?: string;
}
/**
 * Format a value based on its column type
 */
declare function formatValue(value: FieldValue, type: ColumnDataType, options?: FormatLocale & {
    decimals?: number;
}): string;
/**
 * Format a date value
 */
declare function formatDate(value: FieldValue, options?: {
    locale?: string;
    includeTime?: boolean;
    format?: string;
}): string;
/**
 * Format a phone number
 */
declare function formatPhone(value: FieldValue): string;
/**
 * Compare two values for sorting
 */
declare function compareValues(a: FieldValue, b: FieldValue, direction?: SortDirection, type?: ColumnDataType): number;
/**
 * Sort an array of records by a column
 */
declare function sortData<T extends DataRecord>(data: T[], column: string, direction: SortDirection, type?: ColumnDataType): T[];
/**
 * Check if a value matches a search term
 */
declare function matchesSearchTerm(value: FieldValue, term: string): boolean;
/**
 * Filter records by a global search term across specified columns
 */
declare function filterBySearchTerm<T extends DataRecord>(data: T[], term: string, columns: string[]): T[];
/**
 * Calculate pagination metadata
 */
interface PaginationMeta {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
    displayRange: string;
}
/**
 * Calculate pagination metadata from total and page info
 */
declare function calculatePagination(total: number, page: number, pageSize: number): PaginationMeta;
/**
 * Paginate an array of data (client-side)
 */
declare function paginateData<T>(data: T[], page: number, pageSize: number): T[];
/**
 * Generate a unique ID
 */
declare function generateId(prefix?: string): string;
/**
 * Get the row key value from a record
 */
declare function getRowKey<T extends DataRecord>(row: T, rowKey?: keyof T | string): string | number;
/**
 * Deep merge two objects
 */
declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T;
/**
 * Pick specific keys from an object
 */
declare function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Omit specific keys from an object
 */
declare function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Create a debounced function
 */
declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Create a throttled function
 */
declare function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Combine class names (similar to clsx/classnames)
 * Filters out falsy values and joins remaining strings with spaces
 */
declare function cn(...classes: (string | number | undefined | null | false | 0)[]): string;

export { ColumnDataType, DataRecord, FieldCondition, FieldConfig, FieldValue, type FormValidationResult, type FormatLocale, type PaginationMeta, SortDirection, type ValidationResult, ValidationRule, applyValidationRule, calculatePagination, cn, compareValues, debounce, deepMerge, evaluateCondition, evaluateConditions, filterBySearchTerm, formatDate, formatPhone, formatValue, generateId, getNestedValue, getRowKey, hasNestedValue, isEmpty, isNotEmpty, matchesSearchTerm, omit, paginateData, pick, setNestedValue, sortData, throttle, validateColumnConfig, validateEmail, validateField, validateFieldConfig, validateForm, validateMax, validateMaxLength, validateMin, validateMinLength, validatePattern, validatePhone, validateRequired, validateUrl };
