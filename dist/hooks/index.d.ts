import { D as DataRecord, q as SortDirection, A as AdvancedFilter, m as PaginationConfig, n as PaginationParams, P as PaginatedResponse, p as ServerTableQueryParams, h as FieldValue, e as FieldConfig, l as FormSection, b as ColumnConfig, S as SelectionConfig } from '../types-L6joewgw.js';

/**
 * @fileoverview Hook for managing paginated data state
 *
 * Handles pagination, sorting, and search state for tables.
 * Works with both client-side and server-side pagination.
 *
 * @module hooks/usePaginatedData
 */

/**
 * State for paginated data
 */
interface PaginatedDataState<T = DataRecord> {
    /** Current data (after filtering, sorting, pagination) */
    data: T[];
    /** Total number of items (before pagination) */
    total: number;
    /** Current page (1-indexed) */
    page: number;
    /** Items per page */
    pageSize: number;
    /** Total number of pages */
    totalPages: number;
    /** Current sort column */
    sortColumn: string | null;
    /** Current sort direction */
    sortDirection: SortDirection;
    /** Current search term */
    searchTerm: string;
    /** Active advanced filters */
    advancedFilters: AdvancedFilter[];
    /** Whether data is loading */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** Pagination display text */
    displayRange: string;
    /** Whether there is a next page */
    hasNextPage: boolean;
    /** Whether there is a previous page */
    hasPreviousPage: boolean;
}
/**
 * Actions for paginated data
 */
interface PaginatedDataActions<T = DataRecord> {
    /** Go to a specific page */
    goToPage: (page: number) => void;
    /** Go to next page */
    nextPage: () => void;
    /** Go to previous page */
    previousPage: () => void;
    /** Change page size */
    setPageSize: (size: number) => void;
    /** Set sort column and direction */
    setSort: (column: string, direction: SortDirection) => void;
    /** Toggle sort for a column */
    toggleSort: (column: string) => void;
    /** Set search term */
    setSearchTerm: (term: string) => void;
    /** Set advanced filters */
    setAdvancedFilters: (filters: AdvancedFilter[]) => void;
    /** Add an advanced filter */
    addFilter: (filter: AdvancedFilter) => void;
    /** Remove an advanced filter */
    removeFilter: (index: number) => void;
    /** Clear all filters */
    clearFilters: () => void;
    /** Refresh data (for server-side) */
    refresh: () => void;
    /** Set data directly (for external updates) */
    setData: (data: T[], total?: number) => void;
    /** Set loading state */
    setLoading: (loading: boolean) => void;
    /** Set error state */
    setError: (error: string | null) => void;
    /** Reset to initial state */
    reset: () => void;
}
/**
 * Options for usePaginatedData hook
 */
interface UsePaginatedDataOptions<T = DataRecord> {
    /** Initial data (for client-side pagination) */
    initialData?: T[];
    /** Total items (for server-side pagination) */
    totalItems?: number;
    /** Pagination configuration */
    pagination?: PaginationConfig;
    /** Initial sort column */
    defaultSortColumn?: string;
    /** Initial sort direction */
    defaultSortDirection?: SortDirection;
    /** Columns to search in (for client-side search) */
    searchableColumns?: string[];
    /** Data fetcher function (for server-side pagination) */
    fetcher?: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
    /** Callback when pagination params change */
    onParamsChange?: (params: PaginationParams) => void;
    /** Whether to fetch on mount */
    fetchOnMount?: boolean;
}
/**
 * Hook for managing paginated data state
 *
 * @example
 * // Client-side pagination
 * const { state, actions } = usePaginatedData({
 *   initialData: products,
 *   pagination: { pageSize: 10 },
 *   searchableColumns: ['name', 'sku'],
 * });
 *
 * @example
 * // Server-side pagination
 * const { state, actions } = usePaginatedData({
 *   fetcher: async (params) => {
 *     const response = await api.get('/products', { params });
 *     return response.data;
 *   },
 *   pagination: { pageSize: 20 },
 * });
 */
declare function usePaginatedData<T extends DataRecord = DataRecord>(options?: UsePaginatedDataOptions<T>): {
    state: PaginatedDataState<T>;
    actions: PaginatedDataActions<T>;
};

/**
 * @fileoverview useServerTableData - Server-side table data with pagination, sort, search, filters, selection
 *
 * Single contract for "table fed by server": holds page, pageSize, sort, searchTerm,
 * advancedFilters, selectedRows; calls fetchFn(params) and exposes refresh/setters.
 * Compatible with TableRenderer and optional integration with adapters (ListOptions).
 *
 * @module hooks/useServerTableData
 */

interface SortState {
    column: string | null;
    direction: SortDirection;
}
interface UseServerTableDataOptions<T = DataRecord> {
    /** Fetch function: receives query params, returns paginated response */
    fetchFn: (params: ServerTableQueryParams) => Promise<PaginatedResponse<T>>;
    /** Default page size */
    pageSize?: number;
    /** Search debounce in ms (0 = no debounce) */
    searchDebounce?: number;
    /** Fetch on mount */
    autoFetch?: boolean;
    /** Initial sort */
    defaultSort?: SortState;
    /** Row key for selection (default 'id') */
    rowKey?: keyof T | string;
}
interface UseServerTableDataReturn<T = DataRecord> {
    data: T[];
    totalItems: number;
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    sort: SortState;
    searchTerm: string;
    advancedFilters: AdvancedFilter[];
    selectedRows: Set<string | number>;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSort: (sort: SortState) => void;
    setSearchTerm: (term: string) => void;
    setAdvancedFilters: (filters: AdvancedFilter[]) => void;
    addFilter: (filter: AdvancedFilter) => void;
    removeFilter: (index: number) => void;
    setSelectedRows: (rows: Set<string | number>) => void;
    refresh: () => Promise<void>;
    clearFilters: () => void;
    selectedData: T[];
}
/**
 * Server-side table data: pagination, sort, search, advanced filters, selection.
 * Call fetchFn with current params; expose state and setters for TableRenderer.
 */
declare function useServerTableData<T extends DataRecord = DataRecord>(options: UseServerTableDataOptions<T>): UseServerTableDataReturn<T>;

/**
 * @fileoverview Hook for managing form state
 *
 * Handles form values, validation, touched state, and submission.
 * Designed for dynamic forms with conditional fields.
 *
 * @module hooks/useFormState
 */

/**
 * Form state
 */
interface FormState<T = DataRecord> {
    /** Current form values */
    values: T;
    /** Validation errors by field name */
    errors: Record<string, string>;
    /** Which fields have been touched */
    touched: Record<string, boolean>;
    /** Whether form is currently submitting */
    isSubmitting: boolean;
    /** Whether form has been modified */
    isDirty: boolean;
    /** Whether form is valid */
    isValid: boolean;
    /** Submit count */
    submitCount: number;
}
/**
 * Form actions
 */
interface FormActions<T = DataRecord> {
    /** Set a single field value */
    setValue: (name: string, value: FieldValue) => void;
    /** Set multiple values at once */
    setValues: (values: Partial<T>) => void;
    /** Mark a field as touched */
    setTouched: (name: string, isTouched?: boolean) => void;
    /** Mark multiple fields as touched */
    setAllTouched: () => void;
    /** Set a field error manually */
    setError: (name: string, error: string | undefined) => void;
    /** Clear all errors */
    clearErrors: () => void;
    /** Validate a single field */
    validateField: (name: string) => boolean;
    /** Validate all fields */
    validateAll: () => boolean;
    /** Handle field change (sets value and optionally validates) */
    handleChange: (name: string, value: FieldValue) => void;
    /** Handle field blur (marks touched and validates) */
    handleBlur: (name: string) => void;
    /** Submit the form */
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    /** Reset form to initial values */
    reset: (newValues?: Partial<T>) => void;
    /** Get field props helper */
    getFieldProps: (name: string) => FieldProps;
    /** Check if a field should be visible */
    isFieldVisible: (field: FieldConfig) => boolean;
    /** Get all visible fields from sections */
    getVisibleFields: (sections: FormSection[]) => FieldConfig[];
}
/**
 * Props to spread on a field component
 */
interface FieldProps {
    name: string;
    value: FieldValue;
    error?: string;
    touched: boolean;
    onChange: (value: FieldValue) => void;
    onBlur: () => void;
}
/**
 * Options for useFormState hook
 */
interface UseFormStateOptions<T = DataRecord> {
    /** Initial form values */
    initialValues: T;
    /** Field configurations for validation */
    fields?: FieldConfig[];
    /** Form sections (alternative to fields) */
    sections?: FormSection[];
    /** Validation mode */
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
    /** Submit handler */
    onSubmit?: (values: T) => void | Promise<void>;
    /** Change handler */
    onChange?: (name: string, value: FieldValue, values: T) => void;
    /** Validation error handler */
    onValidationError?: (errors: Record<string, string>) => void;
    /** Whether to validate on mount */
    validateOnMount?: boolean;
}
/**
 * Hook for managing form state
 *
 * @example
 * const { state, actions } = useFormState({
 *   initialValues: { name: '', email: '' },
 *   fields: [
 *     { name: 'name', type: 'text', label: 'Name', required: true },
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *   ],
 *   onSubmit: async (values) => {
 *     await api.post('/users', values);
 *   },
 * });
 */
declare function useFormState<T extends DataRecord = DataRecord>(options: UseFormStateOptions<T>): {
    state: FormState<T>;
    actions: FormActions<T>;
};

/**
 * @fileoverview Hook for managing table column configuration
 *
 * Handles column visibility, ordering, and resizing.
 *
 * @module hooks/useColumnConfig
 */

/**
 * Column state (visibility, order, width)
 */
interface ColumnState {
    /** Column key */
    key: string;
    /** Whether column is visible */
    visible: boolean;
    /** Column width (if customized) */
    width?: number | string;
    /** Column order index */
    order: number;
}
/**
 * Column configuration state
 */
interface ColumnConfigState {
    /** Column states by key */
    columns: Record<string, ColumnState>;
    /** Ordered list of visible column keys */
    visibleColumnKeys: string[];
    /** Current sort column */
    sortColumn: string | null;
    /** Current sort direction */
    sortDirection: SortDirection;
}
/**
 * Column configuration actions
 */
interface ColumnConfigActions {
    /** Toggle column visibility */
    toggleColumn: (key: string) => void;
    /** Set column visibility */
    setColumnVisible: (key: string, visible: boolean) => void;
    /** Set column width */
    setColumnWidth: (key: string, width: number | string) => void;
    /** Reorder columns */
    reorderColumns: (fromIndex: number, toIndex: number) => void;
    /** Move column to position */
    moveColumn: (key: string, toIndex: number) => void;
    /** Reset to default configuration */
    reset: () => void;
    /** Get ordered visible columns */
    getVisibleColumns: <T extends DataRecord>() => ColumnConfig<T>[];
    /** Set sort */
    setSort: (column: string | null, direction: SortDirection) => void;
    /** Toggle sort for a column */
    toggleSort: (column: string) => void;
    /** Save configuration (to localStorage or callback) */
    save: () => void;
    /** Load saved configuration */
    load: () => void;
}
/**
 * Options for useColumnConfig hook
 */
interface UseColumnConfigOptions<T extends DataRecord = DataRecord> {
    /** Column configurations */
    columns: ColumnConfig<T>[];
    /** Storage key for persistence */
    storageKey?: string;
    /** Default sort column */
    defaultSortColumn?: string;
    /** Default sort direction */
    defaultSortDirection?: SortDirection;
    /** Callback when configuration changes */
    onConfigChange?: (config: ColumnConfigState) => void;
}
/**
 * Hook for managing table column configuration
 *
 * @example
 * const { state, actions } = useColumnConfig({
 *   columns: tableColumns,
 *   storageKey: 'products-table-config',
 * });
 *
 * // Toggle column visibility
 * actions.toggleColumn('description');
 *
 * // Get visible columns for rendering
 * const visibleColumns = actions.getVisibleColumns();
 */
declare function useColumnConfig<T extends DataRecord = DataRecord>(options: UseColumnConfigOptions<T>): {
    state: ColumnConfigState;
    actions: ColumnConfigActions;
};

/**
 * @fileoverview Hook for managing row selection in tables
 *
 * Handles single and multiple row selection with keyboard support.
 *
 * @module hooks/useTableSelection
 */

/**
 * Selection state
 */
interface TableSelectionState<T = DataRecord> {
    /** Set of selected row keys */
    selectedKeys: Set<string | number>;
    /** Array of selected rows */
    selectedRows: T[];
    /** Whether all visible rows are selected */
    allSelected: boolean;
    /** Whether some (but not all) rows are selected */
    someSelected: boolean;
    /** Count of selected rows */
    selectedCount: number;
}
/**
 * Selection actions
 */
interface TableSelectionActions<T = DataRecord> {
    /** Select a single row (replaces selection in single mode) */
    select: (row: T) => void;
    /** Deselect a row */
    deselect: (row: T) => void;
    /** Toggle row selection */
    toggle: (row: T) => void;
    /** Select all visible rows */
    selectAll: (rows: T[]) => void;
    /** Deselect all rows */
    deselectAll: () => void;
    /** Toggle select all */
    toggleAll: (rows: T[]) => void;
    /** Check if a row is selected */
    isSelected: (row: T) => boolean;
    /** Check if a row is selectable */
    isSelectable: (row: T) => boolean;
    /** Set selection programmatically */
    setSelection: (rows: T[]) => void;
    /** Clear selection */
    clear: () => void;
}
/**
 * Options for useTableSelection hook
 */
interface UseTableSelectionOptions<T = DataRecord> {
    /** Selection configuration */
    config?: SelectionConfig<T>;
    /** Initial selected rows */
    initialSelection?: T[];
    /** Row key property */
    rowKey?: keyof T | string;
    /** Callback when selection changes */
    onSelectionChange?: (selectedRows: T[]) => void;
}
/**
 * Hook for managing table row selection
 *
 * @example
 * const { state, actions } = useTableSelection({
 *   config: { mode: 'multiple', showCheckbox: true },
 *   rowKey: 'id',
 *   onSelectionChange: (rows) => console.log('Selected:', rows),
 * });
 *
 * // Check if row is selected
 * const selected = actions.isSelected(row);
 *
 * // Toggle selection
 * actions.toggle(row);
 */
declare function useTableSelection<T extends DataRecord = DataRecord>(options?: UseTableSelectionOptions<T>): {
    state: TableSelectionState<T>;
    actions: TableSelectionActions<T>;
};

export { type ColumnConfigActions, type ColumnConfigState, type ColumnState, type FieldProps, type FormActions, type FormState, type PaginatedDataActions, type PaginatedDataState, type SortState as ServerTableSortState, type TableSelectionActions, type TableSelectionState, type UseColumnConfigOptions, type UseFormStateOptions, type UsePaginatedDataOptions, type UseServerTableDataOptions, type UseServerTableDataReturn, type UseTableSelectionOptions, useColumnConfig, useFormState, usePaginatedData, useServerTableData, useTableSelection };
