/**
 * @fileoverview Pure validation functions for Dynamic UI Kit
 * 
 * All validators are pure functions with no side effects.
 * They can be used independently or composed together.
 * 
 * @module core/validators
 */

import type {
  FieldValue,
  PrimitiveValue,
  ValidationRule,
  FieldConfig,
  DataRecord,
  FieldCondition
} from './types';

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

/**
 * Result of a single validation
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error message if validation failed */
  message?: string;
}

/**
 * Result of validating all fields
 */
export interface FormValidationResult {
  /** Whether all validations passed */
  valid: boolean;
  /** Map of field names to error messages */
  errors: Record<string, string>;
}

// =============================================================================
// PRIMITIVE VALIDATORS
// =============================================================================

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: FieldValue): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: FieldValue): boolean {
  return !isEmpty(value);
}

/**
 * Validate required field
 */
export function validateRequired(value: FieldValue, message?: string): ValidationResult {
  const valid = isNotEmpty(value);
  return {
    valid,
    message: valid ? undefined : (message || 'Este campo es requerido'),
  };
}

/**
 * Validate minimum value (for numbers)
 */
export function validateMin(value: FieldValue, min: number, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(numValue)) return { valid: true };

  const valid = numValue >= min;
  return {
    valid,
    message: valid ? undefined : (message || `El valor debe ser mayor o igual a ${min}`),
  };
}

/**
 * Validate maximum value (for numbers)
 */
export function validateMax(value: FieldValue, max: number, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(numValue)) return { valid: true };

  const valid = numValue <= max;
  return {
    valid,
    message: valid ? undefined : (message || `El valor debe ser menor o igual a ${max}`),
  };
}

/**
 * Validate minimum length (for strings and arrays)
 */
export function validateMinLength(value: FieldValue, minLength: number, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  const length = typeof value === 'string' ? value.length :
    Array.isArray(value) ? value.length : 0;

  const valid = length >= minLength;
  return {
    valid,
    message: valid ? undefined : (message || `Debe tener al menos ${minLength} caracteres`),
  };
}

/**
 * Validate maximum length (for strings and arrays)
 */
export function validateMaxLength(value: FieldValue, maxLength: number, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  const length = typeof value === 'string' ? value.length :
    Array.isArray(value) ? value.length : 0;

  const valid = length <= maxLength;
  return {
    valid,
    message: valid ? undefined : (message || `No debe exceder ${maxLength} caracteres`),
  };
}

/**
 * Validate against a regex pattern
 */
export function validatePattern(value: FieldValue, pattern: string | RegExp, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  const valid = regex.test(String(value));

  return {
    valid,
    message: valid ? undefined : (message || 'El formato no es válido'),
  };
}

/**
 * Validate email format
 */
export function validateEmail(value: FieldValue, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(String(value));

  return {
    valid,
    message: valid ? undefined : (message || 'El email no es válido'),
  };
}

/**
 * Validate URL format
 */
export function validateUrl(value: FieldValue, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  try {
    // Para soportar rutas relativas al validar, usamos el origen actual como base
    new URL(String(value), window.location.origin);
    return { valid: true };
  } catch {
    return {
      valid: false,
      message: message || 'La URL no es válida',
    };
  }
}

/**
 * Validate phone number format (basic)
 */
export function validatePhone(value: FieldValue, message?: string): ValidationResult {
  if (isEmpty(value)) return { valid: true };

  // Allow digits, spaces, dashes, parentheses, and + prefix
  const phoneRegex = /^\+?[\d\s\-()]{6,20}$/;
  const valid = phoneRegex.test(String(value));

  return {
    valid,
    message: valid ? undefined : (message || 'El teléfono no es válido'),
  };
}

// =============================================================================
// COMPOSITE VALIDATORS
// =============================================================================

/**
 * Apply a single validation rule to a value
 */
export function applyValidationRule(
  value: FieldValue,
  rule: ValidationRule,
  formData?: DataRecord
): ValidationResult {
  switch (rule.type) {
    case 'required':
      return validateRequired(value, rule.message);

    case 'min':
      return validateMin(value, rule.value as number, rule.message);

    case 'max':
      return validateMax(value, rule.value as number, rule.message);

    case 'minLength':
      return validateMinLength(value, rule.value as number, rule.message);

    case 'maxLength':
      return validateMaxLength(value, rule.value as number, rule.message);

    case 'pattern':
      return validatePattern(value, rule.value as string | RegExp, rule.message);

    case 'email':
      return validateEmail(value, rule.message);

    case 'url':
      return validateUrl(value, rule.message);

    case 'custom':
      if (rule.validate) {
        const result = rule.validate(value, formData);
        if (typeof result === 'boolean') {
          return { valid: result, message: result ? undefined : rule.message };
        }
        // Si devuelve string, es el mensaje de error
        return { valid: false, message: result };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
}

/**
 * Validate a field value against all its rules
 */
export function validateField(
  value: FieldValue,
  field: FieldConfig,
  formData?: DataRecord
): ValidationResult {
  // Check required first
  if (field.required) {
    const requiredResult = validateRequired(value);
    if (!requiredResult.valid) {
      return requiredResult;
    }
  }

  // Skip other validations if empty and not required
  if (isEmpty(value)) {
    return { valid: true };
  }

  // Apply all validation rules
  if (field.validation) {
    for (const rule of field.validation) {
      const result = applyValidationRule(value, rule, formData);
      if (!result.valid) {
        return result;
      }
    }
  }

  return { valid: true };
}

/**
 * Validate all fields in a form
 */
export function validateForm(
  formData: DataRecord,
  fields: FieldConfig[]
): FormValidationResult {
  const errors: Record<string, string> = {};
  let valid = true;

  for (const field of fields) {
    // Skip hidden or disabled fields
    if (field.type === 'hidden' || field.disabled) {
      continue;
    }

    // Check showWhen condition
    if (field.showWhen && !evaluateConditions(field.showWhen, formData)) {
      continue;
    }

    const value = formData[field.name];
    const result = validateField(value, field, formData);

    if (!result.valid && result.message) {
      errors[field.name] = result.message;
      valid = false;
    }
  }

  return { valid, errors };
}

// =============================================================================
// CONDITION EVALUATION
// =============================================================================

/**
 * Evaluate a single field condition
 */
export function evaluateCondition(
  condition: FieldCondition,
  formData: DataRecord,
  featureFlags: Record<string, boolean> = {}
): boolean {
  // Normalize operator/op
  const operator = (condition as any).op || condition.operator;

  // If it's a feature check
  if (condition.feature) {
    const isEnabled = !!featureFlags[condition.feature];
    if (operator === 'on') return isEnabled;
    if (operator === 'off') return !isEnabled;
    if (operator === 'equals' || operator === '=') return isEnabled === !!condition.value;
    return isEnabled;
  }

  // Fallback to field check (legacy or explicit field check)
  if (!condition.field) return true;

  const fieldValue = formData[condition.field];
  const compareValue = condition.value;

  switch (operator) {
    case 'equals':
    case '=':
      return String(fieldValue) === String(compareValue);

    case 'notEquals':
    case '!=':
      return String(fieldValue) !== String(compareValue);

    case 'contains':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return fieldValue.toLowerCase().includes(compareValue.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(compareValue as PrimitiveValue);
      }
      return false;

    case 'gt':
    case '>':
      return Number(fieldValue) > Number(compareValue);

    case 'lt':
    case '<':
      return Number(fieldValue) < Number(compareValue);

    case 'gte':
    case '>=':
      return Number(fieldValue) >= Number(compareValue);

    case 'lte':
    case '<=':
      return Number(fieldValue) <= Number(compareValue);

    case 'in':
      if (Array.isArray(compareValue)) {
        return compareValue.map(String).includes(String(fieldValue));
      }
      return false;

    case 'notIn':
      if (Array.isArray(compareValue)) {
        return !compareValue.map(String).includes(String(fieldValue));
      }
      return true;

    case 'isEmpty':
    case 'empty':
      return isEmpty(fieldValue);

    case 'isNotEmpty':
    case 'notEmpty':
      return isNotEmpty(fieldValue);

    default:
      return true;
  }
}

/**
 * Evaluate multiple conditions (AND logic)
 */
export function evaluateConditions(
  conditions: FieldCondition | FieldCondition[],
  formData: DataRecord,
  featureFlags: Record<string, boolean> = {}
): boolean {
  const conditionArray = Array.isArray(conditions) ? conditions : [conditions];
  return conditionArray.every(c => evaluateCondition(c, formData, featureFlags));
}

// =============================================================================
// CONFIG VALIDATORS
// =============================================================================

/**
 * Validate a field configuration
 */
export function validateFieldConfig(config: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Field config must be an object');
    return { valid: false, errors };
  }

  const field = config as Record<string, unknown>;

  if (!field.name || typeof field.name !== 'string') {
    errors.push('Field must have a "name" property (string)');
  }

  if (!field.type || typeof field.type !== 'string') {
    errors.push('Field must have a "type" property (string)');
  }

  if (!field.label || typeof field.label !== 'string') {
    errors.push('Field must have a "label" property (string)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a column configuration
 */
export function validateColumnConfig(config: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Column config must be an object');
    return { valid: false, errors };
  }

  const column = config as Record<string, unknown>;

  if (!column.key || typeof column.key !== 'string') {
    errors.push('Column must have a "key" property (string)');
  }

  if (!column.accessor) {
    errors.push('Column must have an "accessor" property');
  }

  if (!column.header || typeof column.header !== 'string') {
    errors.push('Column must have a "header" property (string)');
  }

  if (!column.type || typeof column.type !== 'string') {
    errors.push('Column must have a "type" property (string)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
