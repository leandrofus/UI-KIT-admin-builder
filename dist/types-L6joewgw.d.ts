/**
 * @fileoverview Core type definitions for Dynamic UI Kit
 *
 * This module contains all primitive types used across the library.
 * Types are designed to be generic and framework-agnostic where possible.
 *
 * @module core/types
 */
/** Supported primitive value types in the system */
type PrimitiveValue = string | number | boolean | null | undefined;
/** Any value that can be stored in a form field or table cell */
type FieldValue = PrimitiveValue | Date | PrimitiveValue[] | Record<string, unknown>;
/** Generic record type for data rows */
type DataRecord = Record<string, FieldValue>;
/**
 * Supported field types for form fields
 * Each type determines the input component and validation behavior
 */
type FieldType = 'text' | 'number' | 'currency' | 'percent' | 'email' | 'phone' | 'url' | 'password' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'switch' | 'radio' | 'date' | 'datetime' | 'time' | 'file' | 'image' | 'color' | 'range' | 'entity' | 'generic' | 'hidden';
/**
 * Option for select/multiselect/radio fields
 */
interface FieldOption {
    /** Unique value for the option */
    value: string | number;
    /** Display label */
    label: string;
    /** Optional icon */
    icon?: string;
    /** Whether option is disabled */
    disabled?: boolean;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Conditional display configuration for fields
 */
interface FieldCondition {
    /** Field name to check */
    field?: string;
    /** Feature flag key to check */
    feature?: string;
    /** Operator for comparison */
    operator: 'equals' | 'notEquals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty' | 'on' | 'off';
    /** Value to compare against */
    value?: FieldValue;
}
/**
 * Validation rule for a field
 */
interface ValidationRule {
    /** Rule type */
    type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
    /** Value for the rule (e.g., min value, max length, regex pattern) */
    value?: string | number | RegExp;
    /** Custom error message */
    message?: string;
    /** Custom validation function (for type: 'custom') */
    validate?: (value: FieldValue, formData?: DataRecord) => boolean | string;
}
/**
 * Complete field configuration
 */
interface FieldConfig {
    /** Unique field name (used as key in form data) */
    name: string;
    /** Field type */
    type: FieldType;
    /** Display label */
    label: string;
    /** Placeholder text */
    placeholder?: string;
    /** Help text shown below field */
    helpText?: string;
    /** Default value */
    defaultValue?: FieldValue;
    /** Whether field is required */
    required?: boolean;
    /** Whether field is disabled */
    disabled?: boolean;
    /** Whether field is read-only */
    readOnly?: boolean;
    /** Minimum value (for number fields) */
    min?: number;
    /** Maximum value (for number fields) */
    max?: number;
    /** Maximum length (for text fields) */
    maxLength?: number;
    /** Minimum length (for text fields) */
    minLength?: number;
    /** Validation rules */
    validation?: ValidationRule[];
    /** Options for select/multiselect/radio fields */
    options?: FieldOption[];
    /** Entity type for entity fields */
    entityType?: string;
    /** Condition for showing this field */
    showWhen?: FieldCondition | FieldCondition[];
    /** Custom component name (for type: 'generic') */
    component?: string;
    /** Additional props passed to the field component */
    props?: Record<string, unknown>;
    /** Grid column span (1-12) */
    colSpan?: number;
    /** Computed field configuration */
    computed?: {
        /** Formula or expression */
        formula: string;
        /** Field dependencies */
        deps: string[];
    };
    format?: {
        /** Number of decimal places to show for numeric values */
        toFixed?: number;
    };
    /** Layout direction for radio/checkbox groups */
    layout?: 'vertical' | 'horizontal';
}
/**
 * Supported column data types for table columns
 */
type ColumnDataType = 'text' | 'number' | 'currency' | 'percent' | 'date' | 'datetime' | 'boolean' | 'status' | 'badge' | 'link' | 'image' | 'avatar' | 'actions' | 'html' | 'custom';
/**
 * Sort direction for columns
 */
type SortDirection = 'asc' | 'desc' | null;
/**
 * Column alignment
 */
type ColumnAlign = 'left' | 'center' | 'right';
/**
 * Action button configuration for action columns
 */
interface ColumnAction<T = DataRecord> {
    /** Action identifier */
    id: string;
    /** Display label */
    label: string;
    /** Icon name */
    icon?: string;
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'ghost';
    /** Condition to show this action */
    showWhen?: (row: T) => boolean;
    /** Whether action is disabled */
    disabled?: boolean | ((row: T) => boolean);
    /** Confirmation message before executing */
    confirm?: string | {
        title: string;
        message: string;
    };
}
/**
 * Status configuration for status columns
 */
interface StatusConfig {
    /** Map of status value to display configuration */
    [key: string]: {
        label: string;
        color: string;
        icon?: string;
    };
}
/**
 * Complete column configuration
 */
interface ColumnConfig<T = DataRecord> {
    /** Unique column key */
    key: string;
    /** Property accessor (supports dot notation for nested properties) */
    accessor: keyof T | string;
    /** Column header label */
    header: string;
    /** Column data type */
    type: ColumnDataType;
    /** Whether column is sortable */
    sortable?: boolean;
    /** Whether column is filterable */
    filterable?: boolean;
    /** Whether column is visible */
    visible?: boolean;
    /** Column width (px, %, or 'auto') */
    width?: string | number;
    /** Minimum column width */
    minWidth?: string | number;
    /** Maximum column width */
    maxWidth?: string | number;
    /** Column alignment */
    align?: ColumnAlign;
    /** Whether column is sticky */
    sticky?: 'left' | 'right';
    /** Whether column is resizable by the user */
    resizable?: boolean;
    /** Custom formatter function */
    format?: (value: FieldValue, row: T) => string;
    /** Custom render function */
    render?: (value: FieldValue, row: T, index: number) => React.ReactNode;
    /** Condition for showing this column */
    showWhen?: FieldCondition | FieldCondition[];
    /** Actions for action columns */
    actions?: ColumnAction<T>[];
    /** Status config for status columns */
    statusConfig?: StatusConfig;
    /** Cell class name or function */
    cellClassName?: string | ((value: FieldValue, row: T) => string);
    /** Header class name */
    headerClassName?: string;
    /** Tooltip for column header */
    tooltip?: string;
}
/**
 * Filter configuration for tables
 */
interface TableFilterConfig {
    /** Enable global search */
    globalSearch?: boolean;
    /** Placeholder for search input */
    searchPlaceholder?: string;
    /** Enable column-specific filters */
    columnFilters?: boolean;
    /** Enable advanced filter modal */
    advancedFilters?: boolean;
    /** Debounce delay for search (ms) */
    debounceMs?: number;
}
/**
 * Pagination configuration
 */
interface PaginationConfig {
    /** Whether pagination is enabled */
    enabled?: boolean;
    /** Default page size */
    pageSize?: number;
    /** Available page size options */
    pageSizeOptions?: number[];
    /** Whether to show page size selector */
    showPageSizeSelector?: boolean;
    /** Whether to show total count */
    showTotal?: boolean;
    /** Position of pagination */
    position?: 'top' | 'bottom' | 'both';
}
/**
 * Selection configuration for tables
 */
interface SelectionConfig<T = DataRecord> {
    /** Selection mode */
    mode: 'single' | 'multiple' | 'none';
    /** Property to use as row identifier */
    rowKey?: keyof T | string;
    /** Whether to show checkboxes */
    showCheckbox?: boolean;
    /** Whether header checkbox selects all pages */
    selectAllPages?: boolean;
    /** Condition for whether a row is selectable */
    isSelectable?: (row: T) => boolean;
}
/**
 * Complete table configuration
 */
interface TableConfig<T = DataRecord> {
    /** Table identifier */
    id?: string;
    /** Column configurations */
    columns: ColumnConfig<T>[];
    /** Filter configuration */
    filters?: TableFilterConfig;
    /** Pagination configuration */
    pagination?: PaginationConfig;
    /** Selection configuration */
    selection?: SelectionConfig<T>;
    /** Row key property */
    rowKey?: keyof T | string;
    /** Default sort column */
    defaultSortColumn?: string;
    /** Default sort direction */
    defaultSortDirection?: SortDirection;
    /** Whether to show row numbers */
    showRowNumbers?: boolean;
    /** Whether table has striped rows */
    striped?: boolean;
    /** Whether rows are hoverable */
    hoverable?: boolean;
    /** Whether table is compact */
    compact?: boolean;
    /** Whether table has borders */
    bordered?: boolean;
    /** Empty state message */
    emptyMessage?: string;
    /** Loading state message */
    loadingMessage?: string;
    /** Column selector configuration */
    columnSelector?: {
        excludedColumns?: string[];
        labelMap?: Record<string, string>;
    };
}
/**
 * Modal display mode: create (new), edit (existing), or view (read-only)
 */
type ModalMode = 'create' | 'edit' | 'view';
/**
 * Form section configuration
 */
interface FormSection {
    /** Section identifier */
    id: string;
    /** Section title */
    title: string;
    /** Section description */
    description?: string;
    /** Whether section is collapsible */
    collapsible?: boolean;
    /** Whether section is collapsed by default */
    defaultCollapsed?: boolean;
    /** Section icon */
    icon?: string;
    /** Fields in this section */
    fields: FieldConfig[];
    /** Condition for showing this section */
    showWhen?: FieldCondition | FieldCondition[];
    /** Grid columns for this section (1-4) */
    columns?: number;
    /** Section width for grid layouts (full, 1/2, 1/3, 2/3) */
    width?: 'full' | '1/2' | '1/3' | '2/3';
}
/**
 * Tab configuration for forms
 */
interface TabConfig {
    /** Tab identifier */
    id: string;
    /** Tab label */
    label: string;
    /** Tab icon */
    icon?: string;
    /** Sections in this tab */
    sections: FormSection[];
    /** Condition for showing this tab */
    showWhen?: FieldCondition | FieldCondition[];
}
/**
 * Complete form/modal configuration
 */
interface FormConfig {
    /** Form identifier */
    id: string;
    /** Form title */
    title: string;
    /** Form description */
    description?: string;
    /** Form sections (if not using tabs) */
    sections?: FormSection[];
    /** Form tabs */
    tabs?: TabConfig[];
    /** Submit button text */
    submitLabel?: string;
    /** Cancel button text */
    cancelLabel?: string;
    /** Whether to show cancel button */
    showCancel?: boolean;
    /** Modal size */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Whether form is in loading state */
    loading?: boolean;
    /** Validation mode */
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}
/**
 * Pagination parameters for API requests
 */
interface PaginationParams {
    page: number;
    pageSize: number;
    sortColumn?: string;
    sortDirection?: SortDirection;
}
/**
 * Query parameters for server-side table fetch (used by useServerTableData).
 * Extends PaginationParams with search and advanced filters.
 */
interface ServerTableQueryParams extends PaginationParams {
    /** Search term for global search */
    searchTerm?: string;
    /** Advanced filters (e.g. for variable-based search) */
    advancedFilters?: AdvancedFilter[];
    /** Alternative: generic filters object for backend (e.g. { advanced: AdvancedFilter[] }) */
    filters?: Record<string, unknown>;
}
/**
 * Paginated response from API
 */
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
/**
 * Filter operator for advanced filters
 */
type FilterOperator = 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty';
/**
 * Advanced filter for tables
 */
interface AdvancedFilter {
    field: string;
    operator: FilterOperator;
    value: FieldValue;
    variableType?: 'text' | 'number' | 'date' | 'boolean';
}
/**
 * Table event handlers
 */
interface TableEventHandlers<T = DataRecord> {
    onRowClick?: (row: T, index: number) => void;
    onRowDoubleClick?: (row: T, index: number) => void;
    onSelectionChange?: (selectedRows: T[]) => void;
    onSort?: (column: string, direction: SortDirection) => void;
    onPageChange?: (page: number, pageSize: number) => void;
    onSearch?: (term: string) => void;
    onFilter?: (filters: AdvancedFilter[]) => void;
    onAction?: (actionId: string, row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
}
/**
 * Form event handlers
 */
interface FormEventHandlers<T = DataRecord> {
    onSubmit?: (data: T) => void | Promise<void>;
    onCancel?: () => void;
    onChange?: (name: string, value: FieldValue, formData: T) => void;
    onValidationError?: (errors: Record<string, string>) => void;
    onFieldBlur?: (name: string, value: FieldValue) => void;
}
/**
 * Make all properties optional deeply
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Extract keys of type T that have value type V
 */
type KeysOfType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
/**
 * Make specific keys required
 */
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type { AdvancedFilter as A, ColumnAction as C, DataRecord as D, FieldCondition as F, KeysOfType as K, ModalMode as M, PaginatedResponse as P, RequireKeys as R, SelectionConfig as S, TableConfig as T, ValidationRule as V, ColumnAlign as a, ColumnConfig as b, ColumnDataType as c, DeepPartial as d, FieldConfig as e, FieldOption as f, FieldType as g, FieldValue as h, FilterOperator as i, FormConfig as j, FormEventHandlers as k, FormSection as l, PaginationConfig as m, PaginationParams as n, PrimitiveValue as o, ServerTableQueryParams as p, SortDirection as q, StatusConfig as r, TableEventHandlers as s, TableFilterConfig as t, TabConfig as u };
