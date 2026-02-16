/**
 * @fileoverview Config Validator - Validates JSON configuration schemas
 * 
 * Provides comprehensive validation for table and form configurations,
 * with helpful error messages for debugging.
 * 
 * @module config-system/ConfigValidator
 */

import type {
  TableConfig,
  FormConfig,
  ColumnConfig,
  FieldConfig,
  FormSection,
  ValidationRule,
  FieldCondition,
  DataRecord,
} from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Validation error details
 */
export interface ValidationError {
  /** Path to the invalid property */
  path: string;
  /** Error message */
  message: string;
  /** Suggested fix */
  suggestion?: string;
  /** Severity level */
  severity: 'error' | 'warning';
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed (no errors) */
  valid: boolean;
  /** List of validation errors */
  errors: ValidationError[];
  /** List of warnings */
  warnings: ValidationError[];
}

/**
 * Validator options
 */
export interface ValidatorOptions {
  /** Strict mode (treat warnings as errors) */
  strict?: boolean;
  /** Known field types (for type validation) */
  knownFieldTypes?: string[];
  /** Known column types */
  knownColumnTypes?: string[];
  /** Custom validators */
  customValidators?: Record<string, (value: unknown, path: string) => ValidationError[]>;
}

// =============================================================================
// DEFAULT OPTIONS
// =============================================================================

const DEFAULT_FIELD_TYPES = [
  'text', 'number', 'email', 'password', 'tel', 'url',
  'textarea', 'select', 'multiselect', 'checkbox', 'radio',
  'switch', 'date', 'datetime', 'time', 'file', 'image',
  'currency', 'percent', 'hidden', 'entity', 'generic',
];

const DEFAULT_COLUMN_TYPES = [
  'text', 'number', 'currency', 'percent', 'date', 'datetime',
  'boolean', 'badge', 'link', 'image', 'actions', 'custom',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createError(
  path: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
  suggestion?: string
): ValidationError {
  return { path, message, severity, suggestion };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate a validation rule configuration
 */
function validateValidationRule(
  rule: unknown,
  path: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(rule)) {
    errors.push(createError(path, 'Validation rule must be an object'));
    return errors;
  }

  const r = rule as Record<string, unknown>;

  // Check for known rule types
  const knownRules = [
    'required', 'min', 'max', 'minLength', 'maxLength',
    'pattern', 'email', 'url', 'custom', 'match'
  ];

  const hasKnownRule = knownRules.some(k => k in r);
  if (!hasKnownRule) {
    errors.push(createError(
      path,
      'Validation rule has no known validation type',
      'warning',
      `Add one of: ${knownRules.join(', ')}`
    ));
  }

  // Validate specific rules
  if ('min' in r && typeof r.min !== 'number') {
    errors.push(createError(`${path}.min`, 'min must be a number'));
  }

  if ('max' in r && typeof r.max !== 'number') {
    errors.push(createError(`${path}.max`, 'max must be a number'));
  }

  if ('minLength' in r && typeof r.minLength !== 'number') {
    errors.push(createError(`${path}.minLength`, 'minLength must be a number'));
  }

  if ('maxLength' in r && typeof r.maxLength !== 'number') {
    errors.push(createError(`${path}.maxLength`, 'maxLength must be a number'));
  }

  if ('pattern' in r && typeof r.pattern !== 'string') {
    errors.push(createError(`${path}.pattern`, 'pattern must be a string (regex)'));
  }

  if ('custom' in r && typeof r.custom !== 'function') {
    errors.push(createError(
      `${path}.custom`,
      'custom must be a function',
      'warning',
      'Custom validators in JSON configs will be ignored'
    ));
  }

  return errors;
}

/**
 * Validate condition group
 */
function validateConditionGroup(
  condition: unknown,
  path: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(condition)) {
    errors.push(createError(path, 'Condition must be an object'));
    return errors;
  }

  const c = condition as unknown as FieldCondition & {
    conditions?: FieldCondition[];
    logic?: 'and' | 'or';
  };

  if (!c.field && !c.conditions) {
    errors.push(createError(
      path,
      'Condition must have either "field" or "conditions"',
      'error',
      'For single condition: { field: "status", operator: "eq", value: "active" }'
    ));
  }

  if (c.field) {
    if (!isNonEmptyString(c.field)) {
      errors.push(createError(`${path}.field`, 'field must be a non-empty string'));
    }

    if (!c.operator) {
      errors.push(createError(`${path}.operator`, 'operator is required'));
    } else {
      const validOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'contains', 'startsWith', 'endsWith', 'empty', 'notEmpty'];
      if (!validOperators.includes(c.operator)) {
        errors.push(createError(
          `${path}.operator`,
          `Invalid operator: ${c.operator}`,
          'error',
          `Valid operators: ${validOperators.join(', ')}`
        ));
      }
    }
  }

  if (c.conditions) {
    if (!isValidArray(c.conditions)) {
      errors.push(createError(`${path}.conditions`, 'conditions must be an array'));
    } else {
      (c.conditions as unknown[]).forEach((sub: unknown, i: number) => {
        errors.push(...validateConditionGroup(sub, `${path}.conditions[${i}]`));
      });
    }

    if (c.logic && !['and', 'or'].includes(c.logic)) {
      errors.push(createError(
        `${path}.logic`,
        'logic must be "and" or "or"',
        'error'
      ));
    }
  }

  return errors;
}

/**
 * Validate a field configuration
 */
function validateFieldConfig(
  field: unknown,
  path: string,
  options: ValidatorOptions
): ValidationError[] {
  const errors: ValidationError[] = [];
  const knownTypes = options.knownFieldTypes || DEFAULT_FIELD_TYPES;

  if (!isObject(field)) {
    errors.push(createError(path, 'Field configuration must be an object'));
    return errors;
  }

  const f = field as unknown as FieldConfig;

  // Required fields
  if (!isNonEmptyString(f.name)) {
    errors.push(createError(`${path}.name`, 'name is required and must be a non-empty string'));
  }

  if (!isNonEmptyString(f.type)) {
    errors.push(createError(`${path}.type`, 'type is required'));
  } else if (!knownTypes.includes(f.type) && f.type !== 'generic') {
    errors.push(createError(
      `${path}.type`,
      `Unknown field type: ${f.type}`,
      'warning',
      `Known types: ${knownTypes.join(', ')}. Use "generic" for custom types.`
    ));
  }

  // Label recommendation
  if (!f.label) {
    errors.push(createError(
      `${path}.label`,
      'label is recommended for accessibility',
      'warning'
    ));
  }

  // Validate options for select fields
  if (['select', 'multiselect', 'radio'].includes(f.type)) {
    if (!f.options && !f.entityType) {
      errors.push(createError(
        `${path}.options`,
        `${f.type} field requires options or entityType`,
        'error'
      ));
    }
  }

  // Validate validation rules
  if (f.validation) {
    if (isValidArray(f.validation)) {
      f.validation.forEach((rule, i) => {
        errors.push(...validateValidationRule(rule, `${path}.validation[${i}]`));
      });
    } else if (isObject(f.validation)) {
      errors.push(...validateValidationRule(f.validation, `${path}.validation`));
    }
  }

  // Validate showWhen
  if (f.showWhen) {
    errors.push(...validateConditionGroup(f.showWhen, `${path}.showWhen`));
  }

  // Validate computed fields
  if (f.computed) {
    if (!isObject(f.computed)) {
      errors.push(createError(`${path}.computed`, 'computed must be an object'));
    } else {
      const c = f.computed as Record<string, unknown>;
      if (!isNonEmptyString(c.formula)) {
        errors.push(createError(`${path}.computed.formula`, 'computed.formula is required'));
      }
      if (!isValidArray(c.deps)) {
        errors.push(createError(`${path}.computed.deps`, 'computed.deps must be an array of field names'));
      }
    }
  }

  // Validate format options
  if (f.format) {
    if (!isObject(f.format)) {
      errors.push(createError(`${path}.format`, 'format must be an object'));
    } else {
      const fmt = f.format as Record<string, unknown>;
      if (fmt.toFixed !== undefined) {
        if (!Number.isInteger(fmt.toFixed) || (fmt.toFixed as number) < 0) {
          errors.push(createError(`${path}.format.toFixed`, 'format.toFixed must be an integer >= 0'));
        }
      }
    }
  }

  return errors;
}

/**
 * Validate a form section
 */
function validateFormSection(
  section: unknown,
  path: string,
  options: ValidatorOptions
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isObject(section)) {
    errors.push(createError(path, 'Section must be an object'));
    return errors;
  }

  const s = section as unknown as FormSection;

  // Validate fields
  if (!isValidArray(s.fields)) {
    errors.push(createError(`${path}.fields`, 'fields is required and must be an array'));
  } else if (s.fields.length === 0) {
    errors.push(createError(`${path}.fields`, 'fields array is empty', 'warning'));
  } else {
    s.fields.forEach((field, i) => {
      errors.push(...validateFieldConfig(field, `${path}.fields[${i}]`, options));
    });
  }

  // Validate showWhen
  if (s.showWhen) {
    errors.push(...validateConditionGroup(s.showWhen, `${path}.showWhen`));
  }

  return errors;
}

/**
 * Validate a column configuration
 */
function validateColumnConfig(
  column: unknown,
  path: string,
  options: ValidatorOptions
): ValidationError[] {
  const errors: ValidationError[] = [];
  const knownTypes = options.knownColumnTypes || DEFAULT_COLUMN_TYPES;

  if (!isObject(column)) {
    errors.push(createError(path, 'Column configuration must be an object'));
    return errors;
  }

  const c = column as unknown as ColumnConfig;

  // Required fields
  if (!isNonEmptyString(c.key)) {
    errors.push(createError(`${path}.key`, 'key is required and must be a non-empty string'));
  }

  if (!isNonEmptyString(c.header)) {
    errors.push(createError(
      `${path}.header`,
      'header is recommended',
      'warning',
      'Will display column key if header is not provided'
    ));
  }

  // Validate type
  if (c.type && !knownTypes.includes(c.type) && c.type !== 'custom') {
    errors.push(createError(
      `${path}.type`,
      `Unknown column type: ${c.type}`,
      'warning',
      `Known types: ${knownTypes.join(', ')}`
    ));
  }

  // Validate width
  if (c.width !== undefined && typeof c.width !== 'number' && typeof c.width !== 'string') {
    errors.push(createError(`${path}.width`, 'width must be a number or string'));
  }

  return errors;
}

// =============================================================================
// MAIN VALIDATORS
// =============================================================================

/**
 * Validate a TableConfig
 */
export function validateTableConfig(
  config: unknown,
  options: ValidatorOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError('', 'Table config must be an object')],
      warnings: [],
    };
  }

  const c = config as unknown as TableConfig;

  // Validate columns
  if (!isValidArray(c.columns)) {
    errors.push(createError('columns', 'columns is required and must be an array'));
  } else if (c.columns.length === 0) {
    errors.push(createError('columns', 'columns array is empty'));
  } else {
    c.columns.forEach((col, i) => {
      errors.push(...validateColumnConfig(col, `columns[${i}]`, options));
    });

    // Check for duplicate keys
    const keys = c.columns.map(col => col.key);
    const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
    if (duplicates.length > 0) {
      errors.push(createError(
        'columns',
        `Duplicate column keys: ${[...new Set(duplicates)].join(', ')}`,
        'error'
      ));
    }
  }

  // Validate pagination
  if (c.pagination !== undefined && typeof c.pagination !== 'boolean') {
    if (isObject(c.pagination)) {
      const p = c.pagination as Record<string, unknown>;
      if (p.pageSize && typeof p.pageSize !== 'number') {
        errors.push(createError('pagination.pageSize', 'pageSize must be a number'));
      }
    } else {
      errors.push(createError('pagination', 'pagination must be boolean or object'));
    }
  }

  // Apply custom validators
  if (options.customValidators) {
    for (const [key, validator] of Object.entries(options.customValidators)) {
      const configObj = c as unknown as Record<string, unknown>;
      if (key in configObj) {
        errors.push(...validator(configObj[key], key));
      }
    }
  }

  // Separate errors and warnings
  const actualErrors = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');

  return {
    valid: options.strict ? errors.length === 0 : actualErrors.length === 0,
    errors: actualErrors,
    warnings,
  };
}

/**
 * Validate a FormConfig
 */
export function validateFormConfig(
  config: unknown,
  options: ValidatorOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError('', 'Form config must be an object')],
      warnings: [],
    };
  }

  const c = config as unknown as FormConfig;

  // Validate sections
  if (!isValidArray(c.sections)) {
    errors.push(createError('sections', 'sections is required and must be an array'));
  } else if (c.sections.length === 0) {
    errors.push(createError('sections', 'sections array is empty'));
  } else {
    c.sections.forEach((section, i) => {
      errors.push(...validateFormSection(section, `sections[${i}]`, options));
    });
  }

  // Check for duplicate field names
  const allFields = c.sections?.flatMap(s => s.fields) || [];
  const names = allFields.map(f => f.name);
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
  if (duplicates.length > 0) {
    errors.push(createError(
      'sections',
      `Duplicate field names: ${[...new Set(duplicates)].join(', ')}`,
      'error'
    ));
  }

  // Validate id
  if (!isNonEmptyString(c.id)) {
    errors.push(createError('id', 'id is recommended', 'warning'));
  }

  // Apply custom validators
  if (options.customValidators) {
    for (const [key, validator] of Object.entries(options.customValidators)) {
      const configObj = c as unknown as Record<string, unknown>;
      if (key in configObj) {
        errors.push(...validator(configObj[key], key));
      }
    }
  }

  // Separate errors and warnings
  const actualErrors = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');

  return {
    valid: options.strict ? errors.length === 0 : actualErrors.length === 0,
    errors: actualErrors,
    warnings,
  };
}

/**
 * Validate any config (auto-detects type)
 */
export function validateConfig(
  config: unknown,
  options: ValidatorOptions = {}
): ValidationResult {
  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError('', 'Config must be an object')],
      warnings: [],
    };
  }

  const c = config as Record<string, unknown>;

  // Detect type
  if ('columns' in c) {
    return validateTableConfig(config, options);
  }

  if ('sections' in c) {
    return validateFormConfig(config, options);
  }

  return {
    valid: false,
    errors: [createError('', 'Unknown config type. Must have "columns" (table) or "sections" (form)')],
    warnings: [],
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.errors.length > 0) {
    lines.push('Errors:');
    result.errors.forEach(e => {
      lines.push(`  ✗ ${e.path || 'root'}: ${e.message}`);
      if (e.suggestion) {
        lines.push(`    → ${e.suggestion}`);
      }
    });
  }

  if (result.warnings.length > 0) {
    lines.push('Warnings:');
    result.warnings.forEach(w => {
      lines.push(`  ⚠ ${w.path || 'root'}: ${w.message}`);
      if (w.suggestion) {
        lines.push(`    → ${w.suggestion}`);
      }
    });
  }

  return lines.join('\n');
}

/**
 * Assert config is valid (throws on error)
 */
export function assertValidConfig(
  config: unknown,
  options: ValidatorOptions = {}
): void {
  const result = validateConfig(config, options);

  if (!result.valid) {
    throw new Error(`Invalid configuration:\n${formatValidationErrors(result)}`);
  }
}

export default validateConfig;
