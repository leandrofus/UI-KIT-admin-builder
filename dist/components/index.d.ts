import React__default, { CSSProperties, ReactNode } from 'react';
import { D as DataRecord, T as TableConfig, b as ColumnConfig, j as FormConfig, h as FieldValue, e as FieldConfig$1, l as FormSection, M as ModalMode } from '../types-L6joewgw.js';
import * as react_jsx_runtime from 'react/jsx-runtime';

/**
 * TableRenderer Component
 *
 * A flexible, configurable data table component with built-in support for:
 * - Pagination (with customizable page sizes)
 * - Sorting (single and multi-column)
 * - Filtering (text, select, date range)
 * - Row selection (single and multi-select)
 * - Custom cell rendering
 * - Column visibility toggles
 * - Responsive design with horizontal scroll
 *
 * @module components/TableRenderer
 */

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc' | null;
/**
 * Column sort state
 */
interface ColumnSortState {
    key: string;
    direction: SortDirection;
}
/**
 * Filter value can be string, array (for multi-select), or object (for ranges)
 */
type FilterValue = string | string[] | {
    from?: string | number;
    to?: string | number;
};
/**
 * Table filter state
 */
interface TableFilterState {
    [columnKey: string]: FilterValue;
}
/**
 * Props for the TableRenderer component
 */
interface TableRendererProps<T extends DataRecord = DataRecord> {
    /** Table configuration object */
    config: TableConfig;
    /** Data array to display */
    data: T[];
    /** Total number of records (for server-side pagination) */
    totalCount?: number;
    /** Loading state indicator */
    loading?: boolean;
    /** Error message to display */
    error?: string | null;
    /** Current page number (1-indexed) */
    page?: number;
    /** Number of items per page */
    pageSize?: number;
    /** Available page size options */
    pageSizeOptions?: number[];
    /** Callback when page changes */
    onPageChange?: (page: number) => void;
    /** Callback when page size changes */
    onPageSizeChange?: (pageSize: number) => void;
    /** Callback when sort changes */
    onSortChange?: (sort: ColumnSortState | null) => void;
    /** Callback when filters change */
    onFilterChange?: (filters: TableFilterState) => void;
    /** Callback when row is clicked */
    onRowClick?: (row: T, index: number) => void;
    /** Callback when row is double-clicked */
    onRowDoubleClick?: (row: T, index: number) => void;
    /** Callback when selection changes */
    onSelectionChange?: (selectedIds: Array<string | number>) => void;
    /** Optional handler to open a Columns selector modal in toolbar */
    onToolbarOpenColumns?: () => void;
    /** Whether the toolbar should show a 'needs sync' indicator for columns */
    toolbarColumnsNeedsSync?: boolean;
    /** Selected row IDs (controlled mode) */
    selectedIds?: Array<string | number>;
    /** Row key accessor function or string */
    /** Theme mode: 'system' (prefers-color-scheme), 'light' or 'dark' */
    theme?: 'system' | 'light' | 'dark';
    /** Prevent layout shift when scrollbar appears/disappears (default: true) */
    preventLayoutShift?: boolean;
    rowKey?: string | ((row: T) => string | number);
    /** Custom class names */
    className?: string;
    /** Custom inline styles */
    style?: CSSProperties;
    /** Empty state render function */
    renderEmpty?: () => ReactNode;
    /** Loading state render function */
    renderLoading?: () => ReactNode;
    /** Error state render function */
    renderError?: (error: string) => ReactNode;
    /** Custom header render function */
    renderHeader?: (columns: ColumnConfig[]) => ReactNode;
    /** Custom row render function */
    renderRow?: (row: T, index: number, columns: ColumnConfig[]) => ReactNode;
    /** Actions column content (rendered at the end of each row) */
    renderActions?: (row: T, index: number) => ReactNode;
    /** Enable sticky header */
    stickyHeader?: boolean;
    /** Maximum height before scrolling (enables virtual scroll appearance) */
    maxHeight?: string | number;
    /** Stripe alternate rows */
    striped?: boolean;
    /** Add hover effect to rows */
    hoverable?: boolean;
    /** Add border between rows */
    bordered?: boolean;
    /** Compact row padding */
    compact?: boolean;
    /** Enable row selection */
    selectable?: boolean;
    /** Selection mode: single or multiple */
    selectionMode?: 'single' | 'multiple';
    /** Show row numbers */
    showRowNumbers?: boolean;
    /** Value to display for null/undefined cells */
    emptyValue?: string;
    /** Enable tree table (hierarchical rows) */
    isTreeTable?: boolean;
    /** Row keys that are expanded */
    expandedRowKeys?: Array<string | number>;
    /** Callback when a parent row is expanded/collapsed */
    onToggleExpand?: (row: T, expanded: boolean) => void;
    /** Custom sub-row render function */
    renderSubRow?: (row: T) => ReactNode;
    /** Feature flags for conditional rendering */
    featureFlags?: Record<string, boolean>;
    /** Show toolbar above table */
    showToolbar?: boolean;
    /** Show search input in toolbar */
    showToolbarSearch?: boolean;
    /** Search placeholder text */
    toolbarSearchPlaceholder?: string;
    /** Current search value (for controlled search) */
    toolbarSearchValue?: string;
    /** Callback when toolbar search changes */
    onToolbarSearch?: (query: string) => void;
    /** Show refresh button in toolbar */
    showToolbarRefresh?: boolean;
    /** Callback when refresh button is clicked */
    onToolbarRefresh?: () => void;
    /** Show create button in toolbar */
    showToolbarCreate?: boolean;
    /** Create button label */
    toolbarCreateLabel?: string;
    /** Callback when create button is clicked */
    onToolbarCreate?: () => void;
    /** Show advanced search button in toolbar */
    showToolbarAdvancedSearch?: boolean;
    /** Callback when advanced search button is clicked */
    onToolbarAdvancedSearch?: () => void;
    /** Delete selected button label */
    toolbarDeleteLabel?: string;
    /** Callback when delete selected is clicked */
    onToolbarDeleteSelected?: () => void;
    /** Callback when toggle enabled is clicked in toolbar */
    onToolbarToggleEnabled?: () => void;
    /** Custom toolbar content render function */
    renderToolbarCustomContent?: () => ReactNode;
    /** Disable toolbar */
    toolbarDisabled?: boolean;
    /** Component to render icons (e.g. from Lucide) */
    IconComponent?: React__default.ComponentType<{
        name: string;
        className?: string;
    }>;
}
/**
 * Table renderer ref interface
 */
interface TableRendererRef {
    /** Clear all filters */
    clearFilters: () => void;
    /** Clear selection */
    clearSelection: () => void;
    /** Reset to first page */
    resetPage: () => void;
    /** Get current filter state */
    getFilters: () => TableFilterState;
    /** Get selected row IDs */
    getSelectedIds: () => Array<string | number>;
}
/**
 * TableRenderer with forwardRef support
 */
declare const TableRenderer: <T extends DataRecord>(props: TableRendererProps<T> & {
    ref?: React__default.ForwardedRef<TableRendererRef>;
}) => JSX.Element;

/**
 * @fileoverview FormRenderer Component
 *
 * Renders dynamic forms based on JSON configuration with support for:
 * - Grouped sections with collapsible headers
 * - Conditional field visibility
 * - Computed field values
 * - Inline validation
 * - Grid-based layouts
 *
 * @module components/FormRenderer
 */

/**
 * Form values type
 */
type FormValues = Record<string, FieldValue>;
/**
 * Form errors type
 */
type FormErrors = Record<string, string | undefined>;
/**
 * Form touched state type
 */
type FormTouched = Record<string, boolean>;
/**
 * Field render props passed to renderField
 */
interface FieldRenderProps {
    /** Field configuration */
    field: FieldConfig$1;
    /** Current field value */
    value: FieldValue;
    /** All form values */
    formData: FormValues;
    /** Field error message */
    error?: string;
    /** Whether field has been touched */
    touched: boolean;
    /** Whether field is disabled */
    disabled: boolean;
    /** Whether field is read-only */
    readOnly: boolean;
    /** Handle value change */
    onChange: (value: FieldValue) => void;
    /** Handle field blur */
    onBlur: () => void;
}
/**
 * Section render props
 */
interface SectionRenderProps {
    /** Section configuration */
    section: FormSection;
    /** Whether section is collapsed */
    isCollapsed: boolean;
    /** Toggle collapse */
    toggleCollapse: () => void;
    /** Rendered field elements */
    children: React__default.ReactNode;
}
/**
 * FormRenderer props
 */
interface FormRendererProps<T extends DataRecord = DataRecord> {
    /** Form configuration from JSON */
    config: FormConfig;
    /** Current form values (controlled mode) */
    values?: T;
    /** Initial values (uncontrolled mode) */
    initialValues?: T;
    /** Validation errors from parent */
    errors?: FormErrors;
    /** Form submit handler */
    onSubmit?: (values: T) => void | Promise<void>;
    /** Form cancel handler */
    onCancel?: () => void;
    /** Field value change handler */
    onChange?: (name: string, value: FieldValue, values: T) => void;
    /** Field blur handler */
    onBlur?: (name: string) => void;
    /** Validation error callback */
    onValidationError?: (errors: FormErrors) => void;
    /** Whether form is loading/submitting */
    loading?: boolean;
    /** Whether form is disabled */
    disabled?: boolean;
    /** Whether form is read-only */
    readOnly?: boolean;
    /** Custom field renderer */
    renderField?: (props: FieldRenderProps) => React__default.ReactNode;
    /** Custom section renderer */
    renderSection?: (props: SectionRenderProps) => React__default.ReactNode;
    /** Feature flags for conditional rendering */
    featureFlags?: Record<string, boolean>;
    /** Additional class name */
    className?: string;
    /** Hide form buttons */
    hideButtons?: boolean;
    /** Custom footer content */
    footer?: React__default.ReactNode;
    /** Custom header content */
    header?: React__default.ReactNode;
}
/**
 * FormRenderer ref interface
 */
interface FormRendererRef<T extends DataRecord = DataRecord> {
    /** Get current form values */
    getValues: () => T;
    /** Set form values */
    setValues: (values: Partial<T>) => void;
    /** Set a single field value */
    setValue: (name: string, value: FieldValue) => void;
    /** Validate all fields */
    validate: () => boolean;
    /** Reset form to initial values */
    reset: () => void;
    /** Get validation errors */
    getErrors: () => FormErrors;
    /** Check if form is dirty */
    isDirty: () => boolean;
    /** Submit the form programmatically */
    submit: () => Promise<void>;
}
declare const FormRenderer: <T extends DataRecord = DataRecord>(props: FormRendererProps<T> & {
    ref?: React__default.ForwardedRef<FormRendererRef<T>>;
}) => React__default.ReactElement;

/**
 * @fileoverview DynamicModal Component
 *
 * A modal dialog wrapper for dynamic forms with support for:
 * - Multiple tabs/sections
 * - Loading and error states
 * - Confirmation dialogs
 * - Custom actions (save, delete, cancel)
 * - Backdrop click handling
 * - Keyboard shortcuts (Escape to close)
 *
 * @module components/DynamicModal
 */

/**
 * Modal size variants
 */
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
/**
 * Tab configuration for tabbed modals
 */
interface ModalTab {
    /** Unique tab identifier */
    id: string;
    /** Tab label */
    label: string;
    /** Tab icon (optional) */
    icon?: React__default.ReactNode;
    /** Tab content (FormConfig or custom content) */
    content?: FormConfig;
    /** Custom render function for tab content */
    render?: (formData: DataRecord) => React__default.ReactNode;
    /** Whether tab is disabled */
    disabled?: boolean;
    /** Badge count or text */
    badge?: string | number;
}
/**
 * Modal action button
 */
interface ModalAction {
    /** Unique action identifier */
    id: string;
    /** Button label */
    label: string;
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    /** Icon (optional) */
    icon?: React__default.ReactNode;
    /** Whether action is disabled */
    disabled?: boolean;
    /** Whether action is loading */
    loading?: boolean;
    /** Click handler */
    onClick?: () => void | Promise<void>;
    /** Position in footer */
    position?: 'left' | 'right';
}
/**
 * Confirmation dialog config
 */
interface ConfirmationConfig {
    /** Dialog title */
    title: string;
    /** Dialog message */
    message: string;
    /** Confirm button label */
    confirmLabel?: string;
    /** Cancel button label */
    cancelLabel?: string;
    /** Confirm button variant */
    confirmVariant?: 'primary' | 'danger';
}
/**
 * Title or submit label: single string or per-mode (create/edit/view)
 */
type TitleOrLabelByMode = string | {
    create?: string;
    edit?: string;
    view?: string;
};
/**
 * DynamicModal props
 */
interface DynamicModalProps<T extends DataRecord = DataRecord> {
    /** Whether modal is open */
    open: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal mode: create (new), edit (existing), or view (read-only). When 'view', submit/delete are hidden and form is read-only. */
    mode?: ModalMode;
    /** Modal title (string or per-mode object) */
    title: string | TitleOrLabelByMode;
    /** Modal subtitle/description */
    subtitle?: string;
    /** Submit button label (string or per-mode). Only shown when mode !== 'view' and onSubmit is provided. */
    submitLabel?: TitleOrLabelByMode;
    /** Modal size */
    size?: ModalSize;
    /** Form configuration (for single-form modals) */
    config?: FormConfig;
    /** Tabs configuration (for tabbed modals) */
    tabs?: ModalTab[];
    /** Initial form values */
    initialValues?: T;
    /** Submit handler */
    onSubmit?: (values: T) => void | Promise<void>;
    /** Delete handler (shows delete button if provided) */
    onDelete?: () => void | Promise<void>;
    /** Custom actions */
    actions?: ModalAction[];
    /** External loading state */
    loading?: boolean;
    /** External error message */
    error?: string;
    /** Validation errors */
    errors?: FormErrors;
    /** Whether to close on backdrop click */
    closeOnBackdropClick?: boolean;
    /** Whether to close on Escape key */
    closeOnEscape?: boolean;
    /** Custom header content */
    header?: React__default.ReactNode;
    /** Custom footer content */
    footer?: React__default.ReactNode;
    /** Additional class name */
    className?: string;
    /** Delete confirmation config */
    deleteConfirmation?: ConfirmationConfig;
    /** Whether to show close button in header */
    showCloseButton?: boolean;
    /** Custom field renderer for FormRenderer */
    renderField?: React__default.ComponentProps<typeof FormRenderer>['renderField'];
    /** Custom section renderer for FormRenderer */
    renderSection?: React__default.ComponentProps<typeof FormRenderer>['renderSection'];
    /** Feature flags for conditional rendering */
    featureFlags?: Record<string, boolean>;
    /** Theme mode: 'system' (prefers-color-scheme), 'light' or 'dark' */
    theme?: 'system' | 'light' | 'dark';
    /** Entity name for dynamic translations (e.g. "Delete {{entity}}") */
    entityName?: string;
}
/**
 * DynamicModal ref interface
 */
interface DynamicModalRef<T extends DataRecord = DataRecord> {
    /** Get current form values */
    getValues: () => T;
    /** Set form values */
    setValues: (values: Partial<T>) => void;
    /** Validate form */
    validate: () => boolean;
    /** Reset form */
    reset: () => void;
    /** Close the modal */
    close: () => void;
    /** Submit the form */
    submit: () => Promise<void>;
}
declare const DynamicModal: <T extends DataRecord = DataRecord>(props: DynamicModalProps<T> & {
    ref?: React__default.ForwardedRef<DynamicModalRef<T>>;
}) => React__default.ReactElement | null;

/**
 * TableToolbar Component
 *
 * Renders a toolbar above a table with search, filters, and action buttons
 *
 * Features:
 * - Text search input
 * - Advanced search modal
 * - Refresh button
 * - Create button
 * - Selection actions (show only when rows are selected)
 * - Dynamic column filters
 */

interface TableToolbarProps {
    /** Show search input */
    showSearch?: boolean;
    /** Search placeholder text */
    searchPlaceholder?: string;
    /** Current search value */
    searchValue?: string;
    /** Callback when search input changes */
    onSearch?: (query: string) => void;
    /** Show refresh button */
    showRefresh?: boolean;
    /** Callback when refresh button is clicked */
    onRefresh?: () => void;
    /** Loading state for refresh button */
    refreshLoading?: boolean;
    /** Show create button */
    showCreate?: boolean;
    /** Label for create button */
    createLabel?: string;
    /** Callback when create button is clicked */
    onCreate?: () => void;
    /** Show advanced search */
    showAdvancedSearch?: boolean;
    /** Callback when advanced search is opened */
    onAdvancedSearch?: () => void;
    /** Number of selected rows (shows selection actions) */
    selectedCount?: number;
    /** Callback when selection actions are triggered */
    onClearSelection?: () => void;
    /** Callback when delete selected is clicked */
    onDeleteSelected?: () => void;
    /** Callback when toggle enabled is clicked */
    onToggleEnabled?: () => void;
    /** Delete selected button label */
    deleteLabel?: string;
    /** Callback when export selected is clicked */
    onExport?: () => void;
    /** Show export button in main toolbar */
    showExport?: boolean;
    /** Custom toolbar height */
    height?: string | number;
    /** Custom class name */
    className?: string;
    /** Column definitions (for advanced filtering) */
    columns?: ColumnConfig[];
    /** Custom toolbar content (renders after standard buttons) */
    renderCustomContent?: () => React__default.ReactNode;
    /** Optional handler to open a Columns selector modal */
    onOpenColumns?: () => void;
    /** Show a columns button (only rendered if onOpenColumns is provided) */
    showColumnsButton?: boolean;
    /** Whether column prefs need syncing (will show a small indicator) */
    columnsNeedsSync?: boolean;
    /** Show view switcher (Table/Kanban) */
    showViewSwitcher?: boolean;
    /** Current active view */
    activeView?: 'table' | 'kanban';
    /** Callback when view changes */
    onViewChange?: (view: 'table' | 'kanban') => void;
    /** Disable entire toolbar */
    disabled?: boolean;
    /** Show border bottom */
    bordered?: boolean;
}
declare function TableToolbar(props: TableToolbarProps): React__default.ReactElement;

type SidebarItemType = 'link' | 'dropdown' | 'group' | 'separator';
interface SidebarItem {
    type: SidebarItemType;
    id?: string;
    label: string;
    icon?: string;
    path?: string;
    children?: SidebarItem[];
    roles?: string[];
    badge?: string;
    description?: string;
}
interface SidebarRendererProps {
    items: SidebarItem[];
    collapsed: boolean;
    onToggleCollapse?: (collapsed: boolean) => void;
    currentPath: string;
    onNavigate?: (path: string) => void;
    LinkComponent?: React__default.ComponentType<any>;
    userRole?: string;
    t?: (key: string) => string;
    logoContent?: React__default.ReactNode;
    headerContent?: React__default.ReactNode;
    footerContent?: React__default.ReactNode;
    onLogout?: () => void;
}
declare const SidebarRenderer: React__default.FC<SidebarRendererProps>;

interface KanbanItem {
    id: number | string;
    title: string;
    subtitle?: string;
    status: string;
    color?: string;
    tags?: {
        label: string;
        color?: string;
    }[];
    metadata?: Record<string, any>;
    originalData?: DataRecord;
}
interface KanbanColumnDef {
    id: string;
    title: string;
    color?: string;
}
interface KanbanRendererProps {
    columns: KanbanColumnDef[];
    data: DataRecord[];
    /** Mapper function to convert DataRecord to KanbanItem */
    mapRecord?: (record: DataRecord) => KanbanItem;
    /** Property names to use for auto-mapping if mapRecord is not provided */
    mapping?: {
        id?: string;
        title?: string;
        subtitle?: string;
        status?: string;
        color?: string;
        tags?: string;
    };
    onItemMove?: (itemId: string | number, newStatus: string) => void;
    onCardClick?: (item: KanbanItem) => void;
    loading?: boolean;
}

/**
 * KanbanRenderer
 *
 * Generic Kanban component for Dynamic UI Kit.
 * Maps DataRecord[] to KanbanItem[] and handles layout.
 */
declare function KanbanRenderer({ columns, data, mapRecord, mapping, onItemMove, onCardClick, loading }: KanbanRendererProps): react_jsx_runtime.JSX.Element;

type FieldType = 'string' | 'number' | 'date' | 'select' | 'boolean' | 'range' | 'entity';
interface FieldOption {
    value: string | number;
    label: string;
}
interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: FieldOption[];
    colSpan?: number;
    excludeFromAdvancedSearch?: boolean;
    entityType?: string;
}
interface AdvancedSearchModalProps {
    open: boolean;
    title?: string;
    fields: FieldConfig[];
    currentFilters?: any[];
    onClose: () => void;
    onApply: (filters: any[]) => void;
    onFilterChange?: (filters: any[]) => void;
    /** If true, doesn't render the external overlay; useful for embedding inside another modal */
    inline?: boolean;
    /** List of field names to exclude from this specific instance */
    excludeFields?: string[];
    /** Custom field renderer */
    renderField?: (field: FieldConfig, value: any, onChange: (val: any) => void) => React__default.ReactNode;
}
declare function AdvancedSearchModal({ open, title, fields, currentFilters, onClose, onApply, onFilterChange, inline, excludeFields, renderField }: AdvancedSearchModalProps): react_jsx_runtime.JSX.Element | null;

interface TabItem {
    id: string;
    label: string;
    icon?: React__default.ReactNode;
    disabled?: boolean;
}
interface TabRendererProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
    variant?: 'underline' | 'pills' | 'ghost';
}
declare const TabRenderer: React__default.FC<TabRendererProps>;

export { type FieldConfig as AdvancedSearchFieldConfig, type FieldOption as AdvancedSearchFieldOption, type FieldType as AdvancedSearchFieldType, AdvancedSearchModal, type AdvancedSearchModalProps, type ColumnSortState, type ConfirmationConfig, DynamicModal, type DynamicModalProps, type DynamicModalRef, type FieldRenderProps, type FilterValue, type FormErrors, FormRenderer, type FormRendererProps, type FormRendererRef, type FormTouched, type FormValues, type KanbanColumnDef, type KanbanItem, KanbanRenderer, type KanbanRendererProps, type ModalAction, type ModalSize, type ModalTab, type SectionRenderProps, type SidebarItem, type SidebarItemType, SidebarRenderer, type SidebarRendererProps, type SortDirection, type TabItem, TabRenderer, type TabRendererProps, type TableFilterState, TableRenderer, type TableRendererProps, type TableRendererRef, TableToolbar, type TableToolbarProps, type TitleOrLabelByMode };
