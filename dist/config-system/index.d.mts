import { e as FieldConfig, b as ColumnConfig, T as TableConfig, j as FormConfig, M as ModalMode } from '../types-L6joewgw.mjs';

/**
 * @fileoverview Config Validator - Validates JSON configuration schemas
 *
 * Provides comprehensive validation for table and form configurations,
 * with helpful error messages for debugging.
 *
 * @module config-system/ConfigValidator
 */
/**
 * Validation error details
 */
interface ValidationError {
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
interface ValidationResult {
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
interface ValidatorOptions {
    /** Strict mode (treat warnings as errors) */
    strict?: boolean;
    /** Known field types (for type validation) */
    knownFieldTypes?: string[];
    /** Known column types */
    knownColumnTypes?: string[];
    /** Custom validators */
    customValidators?: Record<string, (value: unknown, path: string) => ValidationError[]>;
}
/**
 * Validate a TableConfig
 */
declare function validateTableConfig(config: unknown, options?: ValidatorOptions): ValidationResult;
/**
 * Validate a FormConfig
 */
declare function validateFormConfig(config: unknown, options?: ValidatorOptions): ValidationResult;
/**
 * Validate any config (auto-detects type)
 */
declare function validateConfig(config: unknown, options?: ValidatorOptions): ValidationResult;
/**
 * Format validation errors for display
 */
declare function formatValidationErrors(result: ValidationResult): string;
/**
 * Assert config is valid (throws on error)
 */
declare function assertValidConfig(config: unknown, options?: ValidatorOptions): void;

/**
 * @fileoverview Config Parser - Parse and normalize JSON configurations
 *
 * Provides parsing and transformation of raw JSON configs into normalized
 * structures ready for use by components.
 *
 * @module config-system/ConfigParser
 */

/**
 * Raw column config (from JSON)
 */
interface RawColumnConfig {
    key: string;
    header?: string;
    type?: string;
    accessor?: string;
    [key: string]: unknown;
}
/**
 * Raw field config (from JSON)
 */
interface RawFieldConfig {
    name: string;
    type: string;
    label?: string;
    [key: string]: unknown;
}
/**
 * Raw section config (from JSON)
 */
interface RawSectionConfig {
    id?: string;
    title?: string;
    fields: RawFieldConfig[];
    [key: string]: unknown;
}
/**
 * Raw table config (from JSON)
 */
interface RawTableConfig {
    columns: RawColumnConfig[];
    [key: string]: unknown;
}
/**
 * Raw form config (from JSON)
 */
interface RawFormConfig {
    id?: string;
    title?: string;
    sections: RawSectionConfig[];
    entity?: string;
    [key: string]: unknown;
}
/**
 * Parser options
 */
interface ParserOptions {
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
/**
 * Parse a raw table config into a normalized TableConfig
 */
declare function parseTableConfig(raw: RawTableConfig, options?: ParserOptions): TableConfig;
/**
 * Parse a raw form config into a normalized FormConfig
 */
declare function parseFormConfig(raw: RawFormConfig, options?: ParserOptions): FormConfig;
/**
 * Parse any config (auto-detects type)
 */
declare function parseConfig<T extends TableConfig | FormConfig>(raw: RawTableConfig | RawFormConfig, options?: ParserOptions): T;
/**
 * Config loader options
 */
interface ConfigLoaderOptions extends ParserOptions {
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
declare class ConfigLoader {
    private cache;
    private options;
    constructor(options?: ConfigLoaderOptions);
    /**
     * Load a config from URL or path
     */
    load<T extends TableConfig | FormConfig>(path: string): Promise<T>;
    /**
     * Load multiple configs
     */
    loadMany<T extends TableConfig | FormConfig>(paths: string[]): Promise<T[]>;
    /**
     * Clear the cache
     */
    clearCache(): void;
    /**
     * Remove a specific config from cache
     */
    invalidate(path: string): void;
}
/**
 * Create a config loader instance
 */
declare function createConfigLoader(options?: ConfigLoaderOptions): ConfigLoader;

/**
 * @fileoverview Translate config - Resolve i18n keys in JSON configs
 *
 * Walks any config object and replaces string values that look like i18n keys
 * with the translated value using the library's I18n (or a provided instance).
 *
 * @module config-system/translateConfig
 */
/** i18n interface used for translation (t and optional resolveLabel) */
interface I18nLike {
    t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
    resolveLabel?: (key: string, fallback?: string) => string;
}
/**
 * Heuristic: determines if a string looks like an i18n key (e.g. 'product.modal.create').
 * - Contains at least one dot
 * - Only letters, numbers, underscore, dash and dots
 * - No spaces
 */
declare function isLikelyTranslationKey(s: string): boolean;
/**
 * Recursively translates all string values in a config that look like i18n keys.
 * Uses the provided i18n instance or the library's getI18n().
 * Does not mutate the original object; returns a deep copy with translated strings.
 */
declare function translateConfig<T>(obj: T, i18nInstance?: I18nLike): T;

/**
 * @fileoverview Modal config - Canonical modal config format and parsing
 *
 * Defines the canonical "modal config" format (title by mode, sections, footer labels)
 * and parseModalConfig(raw, mode) that returns a resolved config for DynamicModal.
 *
 * @module config-system/modalConfig
 */

/** Title or submit label: single string or per-mode */
type TitleOrLabelByMode = string | {
    create?: string;
    edit?: string;
    view?: string;
};
/** Raw modal config (JSON shape) - extends form with title/labels by mode */
interface RawModalConfig extends Omit<RawFormConfig, 'title'> {
    id: string;
    /** Title: string or per mode (create, edit, view) */
    title: string | {
        create?: string;
        edit?: string;
        view?: string;
    };
    subtitle?: string;
    icon?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    /** Flat fields (no sections) - will be wrapped in a default section */
    fields?: RawFieldConfig[];
    sections?: RawSectionConfig[];
    columns?: number;
    footer?: {
        submitLabel?: TitleOrLabelByMode;
        cancelLabel?: string;
        resetLabel?: string;
        align?: 'left' | 'center' | 'right' | 'between';
    };
    [key: string]: unknown;
}
/** Result of parseModalConfig: form config plus resolved title/labels for the given mode */
interface ParsedModalConfig {
    formConfig: FormConfig;
    title: string;
    submitLabel: string;
    cancelLabel?: string;
    size?: RawModalConfig['size'];
    subtitle?: string;
    icon?: string;
    showCloseButton?: boolean;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
}
/**
 * Resolves title for the given mode (string or record by mode).
 */
declare function getModalTitle(title: TitleOrLabelByMode | undefined, mode: ModalMode): string;
/**
 * Resolves submit button label for the given mode.
 */
declare function getModalSubmitLabel(submitLabel: TitleOrLabelByMode | undefined, mode: ModalMode): string;
/**
 * Parses raw modal JSON into a resolved config for the given mode.
 * - Normalizes sections (or flat fields) into FormConfig via parseFormConfig.
 * - Resolves title and submitLabel for the given mode.
 * Use translateConfig(raw) before calling if the JSON contains i18n keys.
 */
declare function parseModalConfig(raw: RawModalConfig, mode: ModalMode, options?: ParserOptions): ParsedModalConfig;

export { ConfigLoader, type ConfigLoaderOptions, type I18nLike, type TitleOrLabelByMode as ModalTitleOrLabelByMode, type ParsedModalConfig, type ParserOptions, type RawColumnConfig, type RawFieldConfig, type RawFormConfig, type RawModalConfig, type RawSectionConfig, type RawTableConfig, type ValidationError, type ValidationResult, type ValidatorOptions, assertValidConfig, createConfigLoader, formatValidationErrors, getModalSubmitLabel, getModalTitle, isLikelyTranslationKey, parseConfig, parseFormConfig, parseModalConfig, parseTableConfig, translateConfig, validateConfig, validateFormConfig, validateTableConfig };
