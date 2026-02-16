/**
 * @fileoverview Form Adapter - Normalizes form data handling
 * 
 * Provides transformation between form values and API data formats,
 * handling computed fields, file uploads, and data normalization.
 * 
 * @module adapters/FormAdapter
 */

import type { 
  DataRecord, 
  FieldValue, 
  FieldConfig, 
  FormSection 
} from '../core/types';
import { getNestedValue, setNestedValue } from '../core/utils';
import { evaluateConditions } from '../core/validators';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Field transformer function
 */
export type FieldTransformer = (value: FieldValue, formData: DataRecord) => FieldValue;

/**
 * Form adapter configuration
 */
export interface FormAdapterConfig {
  /** Transform data from API format to form format */
  toForm?: (data: DataRecord) => DataRecord;
  /** Transform data from form format to API format */
  toApi?: (data: DataRecord) => DataRecord;
  /** Field-specific transformers (to form) */
  fieldTransformers?: Record<string, FieldTransformer>;
  /** Field-specific transformers (to API) */
  apiTransformers?: Record<string, FieldTransformer>;
  /** Fields to exclude when sending to API */
  excludeFields?: string[];
  /** Fields to include only (whitelist) */
  includeFields?: string[];
  /** Rename fields when sending to API */
  fieldMapping?: Record<string, string>;
  /** Compute fields before sending to API */
  computedFields?: Record<string, (data: DataRecord) => FieldValue>;
  /** Default values for missing fields */
  defaults?: DataRecord;
}

/**
 * Form adapter interface
 */
export interface IFormAdapter {
  /** Transform API data to form values */
  toFormValues: (data: DataRecord) => DataRecord;
  /** Transform form values to API data */
  toApiData: (data: DataRecord) => DataRecord;
  /** Get initial values with defaults */
  getInitialValues: (data?: Partial<DataRecord>) => DataRecord;
  /** Apply computed fields */
  applyComputedFields: (data: DataRecord, fields: FieldConfig[]) => DataRecord;
  /** Get only visible field values */
  getVisibleValues: (data: DataRecord, fields: FieldConfig[]) => DataRecord;
}

// =============================================================================
// FORM ADAPTER FACTORY
// =============================================================================

/**
 * Create a form adapter with the given configuration
 * 
 * @example
 * const productFormAdapter = createFormAdapter({
 *   toForm: (data) => ({
 *     ...data,
 *     price: data.price / 100, // Convert cents to dollars
 *   }),
 *   toApi: (data) => ({
 *     ...data,
 *     price: Math.round(data.price * 100), // Convert back to cents
 *   }),
 *   defaults: {
 *     active: true,
 *     stock: 0,
 *   },
 *   excludeFields: ['_id', 'createdAt', 'updatedAt'],
 * });
 */
export function createFormAdapter(config: FormAdapterConfig = {}): IFormAdapter {
  const {
    toForm: customToForm,
    toApi: customToApi,
    fieldTransformers = {},
    apiTransformers = {},
    excludeFields = [],
    includeFields,
    fieldMapping = {},
    computedFields = {},
    defaults = {},
  } = config;

  /**
   * Transform API data to form values
   */
  const toFormValues = (data: DataRecord): DataRecord => {
    if (!data) return { ...defaults };

    // Start with data
    let result: DataRecord = { ...data };

    // Apply custom transformation first
    if (customToForm) {
      result = customToForm(result);
    }

    // Apply field-specific transformers
    for (const [fieldName, transformer] of Object.entries(fieldTransformers)) {
      const value = getNestedValue(result, fieldName);
      if (value !== undefined) {
        result = setNestedValue(result, fieldName, transformer(value, result));
      }
    }

    // Apply defaults for missing values
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (result[key] === undefined || result[key] === null) {
        result[key] = defaultValue;
      }
    }

    return result;
  };

  /**
   * Transform form values to API data
   */
  const toApiData = (data: DataRecord): DataRecord => {
    if (!data) return {};

    let result: DataRecord = { ...data };

    // Apply field-specific API transformers
    for (const [fieldName, transformer] of Object.entries(apiTransformers)) {
      const value = getNestedValue(result, fieldName);
      if (value !== undefined) {
        result = setNestedValue(result, fieldName, transformer(value, result));
      }
    }

    // Apply computed fields
    for (const [fieldName, compute] of Object.entries(computedFields)) {
      result[fieldName] = compute(result);
    }

    // Filter fields
    if (includeFields && includeFields.length > 0) {
      const filtered: DataRecord = {};
      for (const field of includeFields) {
        if (field in result) {
          filtered[field] = result[field];
        }
      }
      result = filtered;
    } else if (excludeFields.length > 0) {
      for (const field of excludeFields) {
        delete result[field];
      }
    }

    // Rename fields
    for (const [fromKey, toKey] of Object.entries(fieldMapping)) {
      if (fromKey in result) {
        result[toKey] = result[fromKey];
        delete result[fromKey];
      }
    }

    // Apply custom transformation last
    if (customToApi) {
      result = customToApi(result);
    }

    return result;
  };

  /**
   * Get initial values with defaults
   */
  const getInitialValues = (data?: Partial<DataRecord>): DataRecord => {
    if (!data) return { ...defaults };
    return toFormValues({ ...defaults, ...data });
  };

  /**
   * Apply computed fields based on field configuration
   */
  const applyComputedFields = (data: DataRecord, fields: FieldConfig[]): DataRecord => {
    const result = { ...data };

    for (const field of fields) {
      if (field.computed && field.computed.formula) {
        const { formula, deps } = field.computed;

        // Check if all dependencies have values
        const hasAllDeps = deps.every(dep => {
          const value = getNestedValue(result, dep);
          return value !== undefined && value !== null && value !== '';
        });

        if (hasAllDeps) {
          try {
            // Simple formula evaluation (safe subset)
            const computedValue = evaluateFormula(formula, result, deps);
            result[field.name] = computedValue;
          } catch (e) {
            console.warn(`Failed to compute field ${field.name}:`, e);
          }
        }
      }
    }

    return result;
  };

  /**
   * Get only visible field values
   */
  const getVisibleValues = (data: DataRecord, fields: FieldConfig[]): DataRecord => {
    const result: DataRecord = {};

    for (const field of fields) {
      // Skip hidden fields
      if (field.type === 'hidden') continue;

      // Check visibility condition
      if (field.showWhen && !evaluateConditions(field.showWhen, data)) {
        continue;
      }

      const value = getNestedValue(data, field.name);
      if (value !== undefined) {
        result[field.name] = value;
      }
    }

    return result;
  };

  return {
    toFormValues,
    toApiData,
    getInitialValues,
    applyComputedFields,
    getVisibleValues,
  };
}

// =============================================================================
// FORMULA EVALUATION (SAFE SUBSET)
// =============================================================================

/**
 * Evaluate a simple formula string
 * Supports: +, -, *, /, field references, and basic functions
 */
function evaluateFormula(
  formula: string, 
  data: DataRecord, 
  deps: string[]
): FieldValue {
  // Create a context with field values
  const context: Record<string, number> = {};
  
  for (const dep of deps) {
    const value = getNestedValue(data, dep);
    context[dep] = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  }

  // Replace field references with values
  let expression = formula;
  for (const [key, value] of Object.entries(context)) {
    // Replace field name with value (handle both formats: {field} and field)
    expression = expression.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value));
  }

  // Simple safe eval for arithmetic expressions
  // Only allow: numbers, operators (+, -, *, /), parentheses, and Math functions
  const safeExpression = expression.replace(/[^0-9+\-*/().Math\s]/g, '');
  
  try {
    // Use Function constructor for slightly safer eval
    const fn = new Function(`return ${safeExpression}`);
    const result = fn();
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch {
    return 0;
  }
}

// =============================================================================
// COMMON TRANSFORMERS
// =============================================================================

/**
 * Common field transformers for reuse
 */
export const commonTransformers = {
  /** Convert cents to currency */
  centsToDecimal: (value: FieldValue): FieldValue => {
    if (typeof value === 'number') return value / 100;
    return value;
  },

  /** Convert currency to cents */
  decimalToCents: (value: FieldValue): FieldValue => {
    if (typeof value === 'number') return Math.round(value * 100);
    return value;
  },

  /** Parse string to number */
  toNumber: (value: FieldValue): FieldValue => {
    if (typeof value === 'string') return parseFloat(value) || 0;
    return value;
  },

  /** Convert to string */
  toString: (value: FieldValue): FieldValue => {
    if (value === null || value === undefined) return '';
    return String(value);
  },

  /** Parse ISO date string to Date */
  toDate: (value: FieldValue): FieldValue => {
    if (typeof value === 'string') return new Date(value);
    return value;
  },

  /** Convert Date to ISO string */
  toISOString: (value: FieldValue): FieldValue => {
    if (value instanceof Date) return value.toISOString();
    return value;
  },

  /** Parse JSON string */
  parseJSON: (value: FieldValue): FieldValue => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  },

  /** Stringify to JSON */
  toJSON: (value: FieldValue): FieldValue => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  },

  /** Trim whitespace */
  trim: (value: FieldValue): FieldValue => {
    if (typeof value === 'string') return value.trim();
    return value;
  },

  /** Convert empty string to null */
  emptyToNull: (value: FieldValue): FieldValue => {
    if (value === '' || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }
    return value;
  },

  /** Convert null/undefined to empty string */
  nullToEmpty: (value: FieldValue): FieldValue => {
    if (value === null || value === undefined) return '';
    return value;
  },

  /** Convert boolean string to boolean */
  toBoolean: (value: FieldValue): FieldValue => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  },
};

export default createFormAdapter;
