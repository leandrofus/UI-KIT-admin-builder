/**
 * @fileoverview Config Parser - Parse and normalize JSON configurations
 * 
 * Provides parsing and transformation of raw JSON configs into normalized
 * structures ready for use by components.
 * 
 * @module config-system/ConfigParser
 */

import type {
  TableConfig,
  FormConfig,
  ColumnConfig,
  FieldConfig,
  FieldType,
  FormSection,
  ValidationRule,
  ColumnDataType,
  DataRecord,
} from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Raw column config (from JSON)
 */
export interface RawColumnConfig {
  key: string;
  header?: string;
  type?: string;
  accessor?: string;
  [key: string]: unknown;
}

/**
 * Raw field config (from JSON)
 */
export interface RawFieldConfig {
  name: string;
  type: string;
  label?: string;
  [key: string]: unknown;
}

/**
 * Raw section config (from JSON)
 */
export interface RawSectionConfig {
  id?: string;
  title?: string;
  fields: RawFieldConfig[];
  [key: string]: unknown;
}

/**
 * Raw table config (from JSON)
 */
export interface RawTableConfig {
  columns: RawColumnConfig[];
  [key: string]: unknown;
}

/**
 * Raw form config (from JSON)
 */
export interface RawFormConfig {
  id?: string;
  title?: string;
  sections: RawSectionConfig[];
  entity?: string;
  [key: string]: unknown;
}

/**
 * Parser options
 */
export interface ParserOptions {
  /** Default column width */
  defaultColumnWidth?: number | string;
  /** Default column sortable */
  defaultSortable?: boolean;
  /** Default field required */
  defaultRequired?: boolean;
  /** Field name transformer */
  transformFieldName?: (name: string) => string;
  /** Column key transformer */
  transformColumnKey?: (key: string) => string;
  /** Generate labels from names/keys */
  generateLabels?: boolean;
  /** Custom field normalizers */
  fieldNormalizers?: Record<string, (field: RawFieldConfig) => Partial<FieldConfig>>;
  /** Custom column normalizers */
  columnNormalizers?: Record<string, (column: RawColumnConfig) => Partial<ColumnConfig>>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert string to title case for label generation
 */
function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/[_-]/g, ' ') // Replace underscores and dashes
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .replace(/\s\w/g, c => c.toUpperCase()); // Capitalize after spaces
}

/**
 * Deep clone an object
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  
  const cloned: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Merge defaults with user config
 */
function mergeDefaults<T extends object>(defaults: Partial<T>, config: T): T {
  const result = { ...defaults } as T;
  
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const value = config[key];
      if (value !== undefined) {
        result[key] = value;
      }
    }
  }
  
  return result;
}

// =============================================================================
// NORMALIZATION FUNCTIONS
// =============================================================================

/**
 * Normalize a validation rule
 */
function normalizeValidationRule(rule: unknown): ValidationRule | null {
  if (!rule || typeof rule !== 'object') return null;
  
  const r = rule as Record<string, unknown>;
  
  // If it already has type, treat as structured rule
  if ('type' in r && typeof r.type === 'string') {
    return {
      type: r.type as ValidationRule['type'],
      value: r.value as string | number | RegExp | undefined,
      message: typeof r.message === 'string' ? r.message : undefined,
    };
  }
  
  // Convert shorthand format to structured rules
  const rules: ValidationRule[] = [];
  
  if ('required' in r && r.required) {
    rules.push({ type: 'required', message: typeof r.message === 'string' ? r.message : undefined });
  }
  if ('min' in r && typeof r.min === 'number') {
    rules.push({ type: 'min', value: r.min });
  }
  if ('max' in r && typeof r.max === 'number') {
    rules.push({ type: 'max', value: r.max });
  }
  if ('minLength' in r && typeof r.minLength === 'number') {
    rules.push({ type: 'minLength', value: r.minLength });
  }
  if ('maxLength' in r && typeof r.maxLength === 'number') {
    rules.push({ type: 'maxLength', value: r.maxLength });
  }
  if ('pattern' in r && typeof r.pattern === 'string') {
    rules.push({ type: 'pattern', value: r.pattern });
  }
  if ('email' in r && r.email) {
    rules.push({ type: 'email' });
  }
  if ('url' in r && r.url) {
    rules.push({ type: 'url' });
  }

  return rules.length > 0 ? rules[0] : null;
}

/**
 * Condition (either single or compound)
 */
type ConditionOrGroup = {
  field?: string;
  operator?: string;
  value?: unknown;
  logic?: 'and' | 'or';
  conditions?: ConditionOrGroup[];
};

/**
 * Normalize a condition group
 */
function normalizeConditionGroup(condition: unknown): ConditionOrGroup | undefined {
  if (!condition || typeof condition !== 'object') return undefined;
  
  const c = condition as Record<string, unknown>;
  
  // Simple condition
  if (c.field && typeof c.field === 'string') {
    return {
      field: c.field,
      operator: typeof c.operator === 'string' ? c.operator : 'equals',
      value: c.value,
    };
  }
  
  // Compound condition
  if (Array.isArray(c.conditions)) {
    return {
      logic: (c.logic as 'and' | 'or') || 'and',
      conditions: c.conditions
        .map(normalizeConditionGroup)
        .filter((cond): cond is ConditionOrGroup => cond !== undefined),
    };
  }
  
  return undefined;
}

/**
 * Normalize a field configuration
 */
function normalizeField(
  raw: RawFieldConfig, 
  options: ParserOptions
): FieldConfig {
  const {
    defaultRequired = false,
    transformFieldName,
    generateLabels = true,
    fieldNormalizers = {},
  } = options;

  // Start with base normalization
  const name = transformFieldName ? transformFieldName(raw.name) : raw.name;
  
  const normalized: FieldConfig = {
    name,
    type: (raw.type || 'text') as FieldType,
    label: (raw.label || (generateLabels ? toTitleCase(name) : name)) as string,
    required: (raw.required as boolean | undefined) ?? defaultRequired,
    disabled: (raw.disabled as boolean | undefined) ?? false,
    readOnly: (raw.readOnly as boolean | undefined) ?? false,
    placeholder: raw.placeholder as string | undefined,
    helpText: raw.helpText as string | undefined,
    defaultValue: raw.defaultValue as FieldConfig['defaultValue'],
  };

  // Copy optional properties
  if (raw.options) {
    normalized.options = deepClone(raw.options) as FieldConfig['options'];
  }

  if (raw.entityType) {
    normalized.entityType = raw.entityType as string;
  }

  if (raw.min !== undefined) normalized.min = raw.min as number;
  if (raw.max !== undefined) normalized.max = raw.max as number;
  if (raw.minLength !== undefined) normalized.minLength = raw.minLength as number;
  if (raw.maxLength !== undefined) normalized.maxLength = raw.maxLength as number;

  // Normalize validation
  if (raw.validation) {
    if (Array.isArray(raw.validation)) {
      normalized.validation = raw.validation
        .map(normalizeValidationRule)
        .filter((r): r is ValidationRule => r !== null);
    } else {
      const rule = normalizeValidationRule(raw.validation);
      if (rule) normalized.validation = [rule];
    }
  }

  // Normalize showWhen
  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen) as FieldConfig['showWhen'];
  }

  // Normalize computed
  if (raw.computed && typeof raw.computed === 'object') {
    const c = raw.computed as Record<string, unknown>;
    if (typeof c.formula === 'string' && Array.isArray(c.deps)) {
      normalized.computed = {
        formula: c.formula,
        deps: c.deps.filter((d): d is string => typeof d === 'string'),
      };
    }
  }

  // Apply custom normalizer if exists
  if (fieldNormalizers[raw.type]) {
    Object.assign(normalized, fieldNormalizers[raw.type](raw));
  }

  // Copy any additional properties (for extensibility)
  const knownKeys = new Set([
    'name', 'type', 'label', 'required', 'disabled', 'readOnly',
    'placeholder', 'helperText', 'defaultValue', 'options', 'entityType',
    'min', 'max', 'minLength', 'maxLength', 'validation', 'showWhen', 'computed'
  ]);

  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== undefined) {
      (normalized as unknown as Record<string, unknown>)[key] = deepClone(raw[key]);
    }
  }

  return normalized;
}

/**
 * Normalize a form section
 */
function normalizeSection(
  raw: RawSectionConfig,
  options: ParserOptions
): FormSection {
  const normalized: FormSection = {
    id: raw.id || (raw.title?.toLowerCase().replace(/\s+/g, '-') ?? 'section'),
    title: raw.title ?? 'Section',
    description: raw.description as string | undefined,
    collapsible: (raw.collapsible as boolean | undefined) ?? false,
    defaultCollapsed: (raw.collapsed as boolean | undefined) ?? false,
    fields: raw.fields.map(f => normalizeField(f, options)),
  };

  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen) as FormSection['showWhen'];
  }

  // Copy columns layout
  if (raw.columns) {
    normalized.columns = raw.columns as number;
  }

  return normalized;
}

/**
 * Normalize a column configuration
 */
function normalizeColumn(
  raw: RawColumnConfig,
  options: ParserOptions
): ColumnConfig {
  const {
    defaultColumnWidth,
    defaultSortable = true,
    transformColumnKey,
    generateLabels = true,
    columnNormalizers = {},
  } = options;

  const key = transformColumnKey ? transformColumnKey(raw.key) : raw.key;

  const normalized: ColumnConfig = {
    key,
    accessor: raw.accessor || key,
    header: raw.header || (generateLabels ? toTitleCase(key) : key),
    type: (raw.type || 'text') as ColumnDataType,
    width: (typeof raw.width === 'string' || typeof raw.width === 'number') ? raw.width : defaultColumnWidth,
    minWidth: raw.minWidth as string | number | undefined,
    maxWidth: raw.maxWidth as string | number | undefined,
    sortable: (raw.sortable as boolean | undefined) ?? defaultSortable,
    filterable: (raw.filterable as boolean | undefined) ?? false,
    visible: raw.hidden ? false : (raw.visible as boolean | undefined) ?? true,
    align: (raw.align as ColumnConfig['align']) || 'left',
  };

  // Copy optional properties
  if (raw.format) normalized.format = raw.format as ColumnConfig['format'];
  if (raw.render) normalized.render = raw.render as ColumnConfig['render'];

  // Apply custom normalizer if exists
  const type = (raw.type || (raw as any).dataType || 'text') as string;
  if (columnNormalizers[type]) {
    Object.assign(normalized, columnNormalizers[type](raw));
  }
  // If dataType was provided (legacy), ensure it maps to type for downstream components
  normalized.type = type as any;

  // Normalize showWhen
  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen) as ColumnConfig['showWhen'];
  }

  // Copy any additional properties
  const knownKeys = new Set([
    'key', 'header', 'type', 'width', 'minWidth', 'maxWidth',
    'sortable', 'filterable', 'hidden', 'align', 'format',
    'render', 'accessor', 'sortAccessor', 'filterOptions'
  ]);

  for (const k in raw) {
    if (!knownKeys.has(k) && raw[k] !== undefined) {
      (normalized as unknown as Record<string, unknown>)[k] = deepClone(raw[k]);
    }
  }

  return normalized;
}

// =============================================================================
// MAIN PARSERS
// =============================================================================

/**
 * Parse a raw table config into a normalized TableConfig
 */
export function parseTableConfig(
  raw: RawTableConfig,
  options: ParserOptions = {}
): TableConfig {
  const columns = raw.columns.map(c => normalizeColumn(c, options));

  const config: TableConfig = {
    columns,
    pagination: raw.pagination as TableConfig['pagination'],
    selection: raw.selection as TableConfig['selection'],
    filters: raw.filters as TableConfig['filters'],
    striped: (raw.striped as boolean | undefined),
    bordered: (raw.bordered as boolean | undefined),
    compact: (raw.compact as boolean | undefined),
    hoverable: (raw.hoverable as boolean | undefined),
    emptyMessage: raw.emptyMessage as string | undefined,
    loadingMessage: raw.loadingMessage as string | undefined,
    rowKey: raw.rowKey as string | undefined,
    defaultSortColumn: raw.defaultSortColumn as string | undefined,
    defaultSortDirection: raw.defaultSortDirection as TableConfig['defaultSortDirection'],
  };

  // Copy any additional properties
  const knownKeys = new Set([
    'columns', 'pagination', 'selection', 'filters',
    'striped', 'bordered', 'compact', 'hoverable',
    'emptyMessage', 'loadingMessage', 'rowKey',
    'defaultSortColumn', 'defaultSortDirection'
  ]);

  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== undefined) {
      (config as unknown as Record<string, unknown>)[key] = deepClone(raw[key]);
    }
  }

  return config;
}

/**
 * Parse a raw form config into a normalized FormConfig
 */
export function parseFormConfig(
  raw: RawFormConfig,
  options: ParserOptions = {}
): FormConfig {
  const sections = raw.sections.map(s => normalizeSection(s, options));

  const config: FormConfig = {
    id: raw.id || 'form',
    title: raw.title || 'Form',
    sections,
    submitLabel: raw.submitLabel as string | undefined,
    cancelLabel: raw.cancelLabel as string | undefined,
    showCancel: (raw.showCancel as boolean | undefined),
    size: (raw.size as FormConfig['size']),
    validationMode: (raw.validationMode as FormConfig['validationMode']),
  };

  // Copy any additional properties
  const knownKeys = new Set([
    'id', 'title', 'sections', 'entity', 'submitLabel', 'cancelLabel',
    'showCancel', 'size', 'validationMode'
  ]);

  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== undefined) {
      (config as unknown as Record<string, unknown>)[key] = deepClone(raw[key]);
    }
  }

  return config;
}

/**
 * Parse any config (auto-detects type)
 */
export function parseConfig<T extends TableConfig | FormConfig>(
  raw: RawTableConfig | RawFormConfig,
  options: ParserOptions = {}
): T {
  if ('columns' in raw) {
    return parseTableConfig(raw as RawTableConfig, options) as T;
  }

  if ('sections' in raw) {
    return parseFormConfig(raw as RawFormConfig, options) as T;
  }

  throw new Error('Unknown config type. Must have "columns" (table) or "sections" (form)');
}

// =============================================================================
// CONFIG LOADER
// =============================================================================

/**
 * Config loader options
 */
export interface ConfigLoaderOptions extends ParserOptions {
  /** Base path for config files */
  basePath?: string;
  /** Cache loaded configs */
  cache?: boolean;
  /** Validate on load */
  validate?: boolean;
}

/**
 * Config loader for dynamically loading JSON configs
 */
export class ConfigLoader {
  private cache: Map<string, TableConfig | FormConfig> = new Map();
  private options: ConfigLoaderOptions;

  constructor(options: ConfigLoaderOptions = {}) {
    this.options = {
      basePath: '/configs',
      cache: true,
      validate: true,
      ...options,
    };
  }

  /**
   * Load a config from URL or path
   */
  async load<T extends TableConfig | FormConfig>(path: string): Promise<T> {
    // Check cache
    if (this.options.cache && this.cache.has(path)) {
      return this.cache.get(path) as T;
    }

    // Build full URL
    const url = path.startsWith('http') 
      ? path 
      : `${this.options.basePath}/${path}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }

      const raw = await response.json();
      const parsed = parseConfig<T>(raw, this.options);

      // Cache result
      if (this.options.cache) {
        this.cache.set(path, parsed);
      }

      return parsed;
    } catch (error) {
      throw new Error(`Failed to load config from ${path}: ${error}`);
    }
  }

  /**
   * Load multiple configs
   */
  async loadMany<T extends TableConfig | FormConfig>(paths: string[]): Promise<T[]> {
    return Promise.all(paths.map(path => this.load<T>(path)));
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific config from cache
   */
  invalidate(path: string): void {
    this.cache.delete(path);
  }
}

/**
 * Create a config loader instance
 */
export function createConfigLoader(options?: ConfigLoaderOptions): ConfigLoader {
  return new ConfigLoader(options);
}

export default parseConfig;
