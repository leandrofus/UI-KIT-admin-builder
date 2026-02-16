/**
 * @fileoverview Pure utility functions for Dynamic UI Kit
 * 
 * All utilities are pure functions with no side effects.
 * They handle common operations like value access, formatting, and transformation.
 * 
 * @module core/utils
 */

import type { 
  FieldValue, 
  DataRecord, 
  ColumnDataType,
  SortDirection 
} from './types';

// =============================================================================
// VALUE ACCESS UTILITIES
// =============================================================================

/**
 * Get a nested value from an object using dot notation
 * 
 * @example
 * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 * getNestedValue({ items: [{ id: 1 }] }, 'items.0.id') // 1
 */
export function getNestedValue<T = FieldValue>(
  obj: DataRecord | null | undefined,
  path: string,
  defaultValue?: T
): T | undefined {
  if (!obj || !path) {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }
  
  return (current as T) ?? defaultValue;
}

/**
 * Set a nested value in an object using dot notation (immutably)
 * 
 * @example
 * setNestedValue({ user: { name: 'John' } }, 'user.name', 'Jane')
 * // { user: { name: 'Jane' } }
 */
export function setNestedValue<T extends DataRecord>(
  obj: T,
  path: string,
  value: FieldValue
): T {
  const keys = path.split('.');
  const result = { ...obj };
  
  let current: Record<string, unknown> = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] ? { ...current[key] as object } : {};
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
  
  return result;
}

/**
 * Check if a value exists at the given path
 */
export function hasNestedValue(obj: DataRecord | null | undefined, path: string): boolean {
  const value = getNestedValue(obj, path);
  return value !== undefined && value !== null;
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Locale configuration for formatting
 */
export interface FormatLocale {
  locale?: string;
  currency?: string;
  timezone?: string;
}

const DEFAULT_LOCALE: FormatLocale = {
  locale: 'es-AR',
  currency: 'ARS',
  timezone: 'America/Argentina/Buenos_Aires',
};

/**
 * Format a value based on its column type
 */
export function formatValue(
  value: FieldValue,
  type: ColumnDataType,
  options?: FormatLocale & { decimals?: number }
): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const { locale, currency, decimals } = { ...DEFAULT_LOCALE, ...options };
  
  switch (type) {
    case 'text':
      return String(value);
    
    case 'number':
      if (typeof value === 'number' || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals ?? 0,
          maximumFractionDigits: decimals ?? 2,
        }).format(Number(value));
      }
      return String(value);
    
    case 'currency':
      if (typeof value === 'number' || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals ?? 2,
          maximumFractionDigits: decimals ?? 2,
        }).format(Number(value));
      }
      return String(value);
    
    case 'percent':
      if (typeof value === 'number' || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: decimals ?? 0,
          maximumFractionDigits: decimals ?? 2,
        }).format(Number(value) / 100);
      }
      return String(value);
    
    case 'date':
      return formatDate(value, { locale, includeTime: false });
    
    case 'datetime':
      return formatDate(value, { locale, includeTime: true });
    
    case 'boolean':
      return value ? 'Sí' : 'No';
    
    default:
      return String(value);
  }
}

/**
 * Format a date value
 */
export function formatDate(
  value: FieldValue,
  options?: { locale?: string; includeTime?: boolean; format?: string }
): string {
  if (!value) return '';
  
  const { locale = 'es-AR', includeTime = false } = options || {};
  
  let date: Date;
  
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    date = new Date(value);
  } else {
    return String(value);
  }
  
  if (isNaN(date.getTime())) {
    return String(value);
  }
  
  const dateOptions: Intl.DateTimeFormatOptions = includeTime
    ? { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }
    : { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
      };
  
  return new Intl.DateTimeFormat(locale, dateOptions).format(date);
}

/**
 * Format a phone number
 */
export function formatPhone(value: FieldValue): string {
  if (!value) return '';
  
  const digits = String(value).replace(/\D/g, '');
  
  // Argentina format: +54 9 11 1234-5678
  if (digits.startsWith('549') && digits.length >= 12) {
    const area = digits.slice(3, 5);
    const part1 = digits.slice(5, 9);
    const part2 = digits.slice(9);
    return `+54 9 ${area} ${part1}-${part2}`;
  }
  
  // Generic format
  if (digits.length >= 10) {
    const area = digits.slice(0, 2);
    const part1 = digits.slice(2, 6);
    const part2 = digits.slice(6);
    return `${area} ${part1}-${part2}`;
  }
  
  return String(value);
}

// =============================================================================
// SORTING UTILITIES
// =============================================================================

/**
 * Compare two values for sorting
 */
export function compareValues(
  a: FieldValue,
  b: FieldValue,
  direction: SortDirection = 'asc',
  type?: ColumnDataType
): number {
  // Handle null/undefined
  if (a === null || a === undefined) return direction === 'asc' ? 1 : -1;
  if (b === null || b === undefined) return direction === 'asc' ? -1 : 1;
  
  let comparison = 0;
  
  // Compare based on type
  if (type === 'number' || type === 'currency' || type === 'percent') {
    comparison = Number(a) - Number(b);
  } else if (type === 'date' || type === 'datetime') {
    comparison = new Date(a as string | number).getTime() - new Date(b as string | number).getTime();
  } else if (type === 'boolean') {
    comparison = (a ? 1 : 0) - (b ? 1 : 0);
  } else {
    // String comparison (case-insensitive)
    comparison = String(a).toLowerCase().localeCompare(String(b).toLowerCase());
  }
  
  return direction === 'desc' ? -comparison : comparison;
}

/**
 * Sort an array of records by a column
 */
export function sortData<T extends DataRecord>(
  data: T[],
  column: string,
  direction: SortDirection,
  type?: ColumnDataType
): T[] {
  if (!direction) return data;
  
  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, column);
    const valueB = getNestedValue(b, column);
    return compareValues(valueA, valueB, direction, type);
  });
}

// =============================================================================
// SEARCH/FILTER UTILITIES
// =============================================================================

/**
 * Check if a value matches a search term
 */
export function matchesSearchTerm(value: FieldValue, term: string): boolean {
  if (value === null || value === undefined) return false;
  
  const stringValue = String(value).toLowerCase();
  const searchTerm = term.toLowerCase().trim();
  
  return stringValue.includes(searchTerm);
}

/**
 * Filter records by a global search term across specified columns
 */
export function filterBySearchTerm<T extends DataRecord>(
  data: T[],
  term: string,
  columns: string[]
): T[] {
  if (!term.trim()) return data;
  
  return data.filter(row =>
    columns.some(column => {
      const value = getNestedValue(row, column);
      return matchesSearchTerm(value, term);
    })
  );
}

// =============================================================================
// PAGINATION UTILITIES
// =============================================================================

/**
 * Calculate pagination metadata
 */
export interface PaginationMeta {
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
export function calculatePagination(
  total: number,
  page: number,
  pageSize: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  
  return {
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex,
    endIndex,
    displayRange: total > 0 
      ? `${startIndex + 1}-${endIndex} de ${total}`
      : '0 resultados',
  };
}

/**
 * Paginate an array of data (client-side)
 */
export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
}

// =============================================================================
// ID/KEY UTILITIES
// =============================================================================

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'duk'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get the row key value from a record
 */
export function getRowKey<T extends DataRecord>(
  row: T,
  rowKey: keyof T | string = 'id'
): string | number {
  const value = getNestedValue(row, String(rowKey));
  return value !== undefined ? (value as string | number) : generateId('row');
}

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

// =============================================================================
// DEBOUNCE/THROTTLE UTILITIES
// =============================================================================

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// =============================================================================
// CLASS NAME UTILITIES
// =============================================================================

/**
 * Combine class names (similar to clsx/classnames)
 * Filters out falsy values and joins remaining strings with spaces
 */
export function cn(...classes: (string | number | undefined | null | false | 0)[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}
