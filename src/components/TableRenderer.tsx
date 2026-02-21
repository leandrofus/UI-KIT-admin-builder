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

import React, { 
  useMemo, 
  useCallback, 
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type CSSProperties 
} from 'react';

import type { 
  TableConfig, 
  ColumnConfig, 
  DataRecord, 
  FieldValue
} from '../core/types';
import { cn } from '../core/utils';
import { evaluateConditions } from '../core/validators';
import { useI18n, resolveLabel, t } from '../i18n/I18n';
import { TableToolbar } from './TableToolbar';

// ============================================================================
// Types
// ============================================================================

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Column sort state
 */
export interface ColumnSortState {
  key: string;
  direction: SortDirection;
}

/**
 * Filter value can be string, array (for multi-select), or object (for ranges)
 */
export type FilterValue = 
  | string 
  | string[] 
  | { from?: string | number; to?: string | number };

/**
 * Table filter state
 */
export interface TableFilterState {
  [columnKey: string]: FilterValue;
}

/**
 * Props for the TableRenderer component
 */
export interface TableRendererProps<T extends DataRecord = DataRecord> {
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
  
  // =========================================================================
  // TOOLBAR PROPS
  // =========================================================================
  
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
  IconComponent?: React.ComponentType<{ name: string; className?: string }>;
}

/**
 * Table renderer ref interface
 */
export interface TableRendererRef {
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

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Default empty state component
 */
function DefaultEmptyState(): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="dui-table-empty">
      <svg 
        className="dui-table-empty-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
        width="48"
        height="48"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
        />
      </svg>
      <p className="dui-table-empty-text">{t('table.empty')}</p>
    </div>
  );
}

/**
 * Default loading state component
 */
function DefaultLoadingState(): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="dui-table-loading">
      <div className="dui-table-loading-spinner" />
      <p className="dui-table-loading-text">{t('table.loading')}</p>
    </div>
  );
}

/**
 * Default error state component
 */
function DefaultErrorState({ error }: { error: string }): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="dui-table-error">
      <svg 
        className="dui-table-error-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
        width="48"
        height="48"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <p className="dui-table-error-text">{t('table.error')}</p>
      <p className="dui-table-error-detail">{error}</p>
    </div>
  );
}

/**
 * Sort indicator icon
 */
function SortIndicator({ direction }: { direction: SortDirection }): JSX.Element {
  if (!direction) {
    return (
      <svg className="dui-table-sort-icon dui-table-sort-inactive" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M7 10l5-5 5 5H7z M7 14l5 5 5-5H7z" />
      </svg>
    );
  }
  
  return (
    <svg 
      className={cn('dui-table-sort-icon', direction === 'desc' && 'dui-table-sort-desc')} 
      viewBox="0 0 24 24" 
      width="16" 
      height="16" 
      fill="currentColor"
    >
      {direction === 'asc' 
        ? <path d="M7 14l5-5 5 5H7z" />
        : <path d="M7 10l5 5 5-5H7z" />
      }
    </svg>
  );
}

/**
 * Checkbox component for row selection
 */
function Checkbox({ 
  checked, 
  indeterminate, 
  onChange,
  disabled 
}: { 
  checked: boolean; 
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}): JSX.Element {
  const ref = React.useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);
  
  return (
    <input
      ref={ref}
      type="checkbox"
      className="dui-table-checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}

// ============================================================================
// Cell Renderers
// ============================================================================

// Utilities for resize-based truncation
const MIN_CHAR_DISPLAY = 6;
const CHAR_PX = 8; // heuristic px per char
const MIN_PX = MIN_CHAR_DISPLAY * CHAR_PX;

// Utility: parse computed width as number of pixels
const parseWidthPx = (col: any): number | null => {
  const w = col._computedWidth ?? col.width;
  if (w == null) return null;
  if (typeof w === 'number') return w;
  const str = String(w).trim();
  const m = str.match(/^(\d+)/);
  if (m) return Number(m[1]);
  return null;
};

/**
 * Get the value from a row using accessor
 */
function getCellValue<T extends DataRecord>(
  row: T, 
  column: ColumnConfig
): unknown {
  const accessor = column.accessor || column.key;
  
  // Handle nested paths like "user.name"
  if (typeof accessor === 'string' && accessor.includes('.')) {
    return accessor.split('.').reduce((obj: unknown, key: string) => {
      if (obj && typeof obj === 'object') {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, row);
  }
  
  return row[accessor as string];
}

/**
 * Format cell value based on column configuration
 */
function formatCellValue<T extends DataRecord>(
  value: unknown, 
  column: ColumnConfig<T>,
  row: T,
  emptyValuePlaceholder: string
): ReactNode {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return emptyValuePlaceholder;
  }
  
  // Use custom render function if provided
  if (column.render) {
    // Cast to any to avoid type conflicts with nested React types during build
    return column.render(value as FieldValue, row, 0) as unknown as ReactNode;
  }

  // Use format function if provided
  if (column.format) {
    return column.format(value as FieldValue, row);
  }
  
  // Type-specific formatting
  switch (column.type) {
    case 'number':
    case 'currency':
    case 'percent': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(num)) return String(value);

      const localeToUse = (column as any).locale || 'es-AR';
      
      if (column.type === 'currency') {
        const currencyCode = (column as any).currency || 'USD';
        return new Intl.NumberFormat(localeToUse, { 
          style: 'currency', 
          currency: currencyCode,
          minimumFractionDigits: 2 
        }).format(num);
      }
      
      if (column.type === 'percent') {
        return new Intl.NumberFormat(localeToUse, { 
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2 
        }).format(num / 100);
      }
      
      return new Intl.NumberFormat(localeToUse).format(num);
    }
    
    case 'date':
    case 'datetime': {
      const date = value instanceof Date ? value : new Date(String(value));
      if (isNaN(date.getTime())) return String(value);
      const localeToUse = (column as any).locale || 'es-AR';
      
      return new Intl.DateTimeFormat(localeToUse, {
        dateStyle: 'medium',
        timeStyle: column.type === 'datetime' ? 'short' : undefined
      }).format(date);
    }
    
    case 'boolean':
      return value ? '✓' : '✗';
    
    case 'badge':
    case 'status': {
      const namespace = (column as any).translationNamespace || (column.type === 'status' ? 'status' : undefined);
      
      // Arrays -> render each item as a badge
      if (Array.isArray(value)) {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            {(value as any[]).map((item, i) => {
              const display = (item && typeof item === 'object') ? (item.label ?? item.name ?? String(item)) : resolveLabel(String(item), undefined, namespace);
              return <span key={i} className={cn('dui-table-badge')}>{display}</span>;
            })}
          </div>
        );
      }

      // Lookup in variants if available
      const variants = (column as any).variants as any[];
      if (variants && variants.length > 0) {
        const variant = variants.find(v => 
          String(v.value).toLowerCase() === String(value).toLowerCase() || 
          String(v.id).toLowerCase() === String(value).toLowerCase()
        );
        if (variant) {
          const display = resolveLabel(variant.label || variant.name || String(variant.value), undefined, namespace);
          const colorValue = variant.color || 'gray';
          const isHex = /^#|^rgb|^hsl/.test(colorValue);
          
          return (
            <span 
              className={cn('dui-table-badge', !isHex && `dui-table-badge-${colorValue.toLowerCase()}`)}
              style={isHex ? { backgroundColor: colorValue, color: '#fff', border: 'none' } : undefined}
            >
              {display}
            </span>
          );
        }
      }

      // Objects -> try to display sensible nested label
      if (value && typeof value === 'object') {
        const obj = value as Record<string, any>;
        const display = obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj);
        const color = obj.color;
        
        return (
          <span 
            className={cn('dui-table-badge')}
            style={color ? { backgroundColor: color, color: '#fff' } : undefined}
          >
            {resolveLabel(String(display), undefined, namespace)}
          </span>
        );
      }

      return (
        <span className={cn('dui-table-badge', `dui-table-badge-${String(value).toLowerCase()}`)}>
          {resolveLabel(String(value), undefined, namespace)}
        </span>
      );
    }
    
    case 'link':
      return (
        <a 
          href={String(value)} 
          className="dui-table-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {String(value)}
        </a>
      );
    
    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: String(value) }} />;
    
    default:
      // If value is object/array try to resolve to a human string
      if (Array.isArray(value)) {
        return (value as any[]).map((v, i) => <span key={i}>{(v && typeof v === 'object') ? (v.label ?? v.name ?? String(v)) : String(v)}</span>);
      }

      if (value && typeof value === 'object') {
        const obj = value as Record<string, any>;
        const display = obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj);
        // Truncate if column is very narrow
        const widthPx = parseWidthPx(column as any);
        if (widthPx !== null && widthPx <= MIN_PX && typeof display === 'string') {
          return String(display).length > MIN_CHAR_DISPLAY ? `${String(display).slice(0, MIN_CHAR_DISPLAY)}…` : String(display);
        }
        return String(display);
      }

      // Primitive (string/number)
      {
        const s = String(value);
        const widthPx = parseWidthPx(column as any);
        if (widthPx !== null && widthPx <= MIN_PX) {
          return s.length > MIN_CHAR_DISPLAY ? `${s.slice(0, MIN_CHAR_DISPLAY)}…` : s;
        }
        return s;
      }
  }
}

// ============================================================================
// Pagination Component
// ============================================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange
}: PaginationProps): JSX.Element {
  const { t } = useI18n();
  
  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  
  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 9; // Increased from 7 to show more pages
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        pages.push('ellipsis');
      }
      
      // Show 2 pages before and after current page (5 total including current)
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  return (
    <div className="dui-table-pagination">
      <div className="dui-table-pagination-info">
        {t('table.pagination.showing', 
          { start: startRecord, end: endRecord, total: totalCount }, 
          `Showing ${startRecord} to ${endRecord} of ${totalCount} entries`
        )}
      </div>
      
      <div className="dui-table-pagination-controls">
        <div className="dui-table-pagination-pagesize">
          <label>{t('table.pagination.pageSize', {}, 'Page size')}:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="dui-table-pagination-select"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        
        <nav className="dui-table-pagination-nav">
          <button
            className="dui-table-pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label={t('table.pagination.first')}
          >
            «
          </button>
          
          <button
            className="dui-table-pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label={t('table.pagination.previous')}
          >
            ‹
          </button>
          
          {pageNumbers.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="dui-table-pagination-ellipsis">…</span>
            ) : (
              <button
                key={page}
                className={cn(
                  'dui-table-pagination-btn',
                  page === currentPage && 'dui-table-pagination-btn-active'
                )}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          ))}
          
          <button
            className="dui-table-pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label={t('table.pagination.next')}
          >
            ›
          </button>
          
          <button
            className="dui-table-pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label={t('table.pagination.last')}
          >
            »
          </button>
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// Selection Hook (simplified inline version)
// ============================================================================

function useSimpleSelection<T extends DataRecord>(
  data: T[],
  rowKeyProp: string | ((row: T) => string | number),
  mode: 'single' | 'multiple',
  initialSelection?: Array<string | number>,
  onSelectionChange?: (ids: Array<string | number>) => void
) {
  // Internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] = useState<Set<string | number>>(new Set());

  // Effective selection: use prop if provided, otherwise internal state
  const selected = useMemo(() => {
    if (initialSelection !== undefined) {
      return new Set(initialSelection);
    }
    return internalSelected;
  }, [initialSelection, internalSelected]);
  
  const getKey = useCallback((row: T): string | number => {
    if (typeof rowKeyProp === 'function') {
      return rowKeyProp(row);
    }
    return row[rowKeyProp] as string | number;
  }, [rowKeyProp]);
  
  const isSelected = useCallback((key: string | number): boolean => {
    return selected.has(key);
  }, [selected]);

  const updateSelection = useCallback((newSet: Set<string | number>) => {
    // Only update internal state if we're uncontrolled
    if (initialSelection === undefined) {
      setInternalSelected(newSet);
    }
    // Always notify parent
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSet));
    }
  }, [initialSelection, onSelectionChange]);
  
  const toggle = useCallback((key: string | number) => {
    const next = new Set(selected);
    if (mode === 'single') {
      if (selected.has(key)) {
        next.clear();
      } else {
        next.clear();
        next.add(key);
      }
    } else {
      if (selected.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }
    updateSelection(next);
  }, [mode, selected, updateSelection]);
  
  const toggleAll = useCallback(() => {
    let next: Set<string | number>;
    if (selected.size === data.length) {
      next = new Set();
    } else {
      next = new Set(data.map(getKey));
    }
    updateSelection(next);
  }, [data, getKey, selected.size, updateSelection]);
  
  const clear = useCallback(() => {
    updateSelection(new Set());
  }, [updateSelection]);
  
  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const isAllSelected = data.length > 0 && selected.size === data.length;
  const isSomeSelected = selected.size > 0 && selected.size < data.length;
  
  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggle,
    toggleAll,
    clear,
  };
}

// ============================================================================
// Main TableRenderer Component
// ============================================================================

/**
 * TableRenderer - A flexible, configurable data table component
 */
function TableRendererInner<T extends DataRecord>(
  props: TableRendererProps<T>,
  ref: React.ForwardedRef<TableRendererRef>
): JSX.Element {
  const {
    config,
    data,
    totalCount: externalTotalCount,
    loading = false,
    error = null,
    page: externalPage,
    pageSize: externalPageSize,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onFilterChange,
    onRowClick,
    onRowDoubleClick,
    onSelectionChange,
    selectedIds: externalSelectedIds,
    rowKey = 'id',
    className,
    style,
    renderEmpty = () => <DefaultEmptyState />,
    renderLoading = () => <DefaultLoadingState />,
    renderError = (err) => <DefaultErrorState error={err} />,
    renderHeader,
    renderRow,
    renderActions,
    stickyHeader = false,
    maxHeight,
    striped = false,
    hoverable = true,
    bordered = false,
    compact = false,
    selectable = false,
    selectionMode = 'multiple',
    showRowNumbers = false,
    emptyValue = '—',
    isTreeTable,
    expandedRowKeys: controlledExpandedKeys,
    onToggleExpand,
    renderSubRow,
    theme = 'system',
    preventLayoutShift = true,
    featureFlags = {},
    // Toolbar props
    showToolbar = false,
    showToolbarSearch = false,
    toolbarSearchPlaceholder,
    toolbarSearchValue = '',
    onToolbarSearch,
    showToolbarRefresh = false,
    onToolbarRefresh,
    showToolbarCreate = false,
    toolbarCreateLabel,
    onToolbarCreate,
    showToolbarAdvancedSearch = false,
    onToolbarAdvancedSearch,
    toolbarDeleteLabel,
    onToolbarDeleteSelected,
    onToolbarToggleEnabled,
    renderToolbarCustomContent,
    // Handler to open Columns selector modal provided by page hook
    onToolbarOpenColumns,
    // whether prefs need sync (optional)
    toolbarColumnsNeedsSync,
    toolbarDisabled = false,
    IconComponent,
  } = props;
  
  const { t } = useI18n();
  
  // Internal state for uncontrolled mode
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(
    config.pagination?.pageSize ?? 10
  );
  const [sortState, setSortState] = useState<ColumnSortState | null>(null);
  const [filters, setFilters] = useState<TableFilterState>({});
  
  // Determine controlled vs uncontrolled mode
  const isPageControlled = externalPage !== undefined;
  const currentPage = isPageControlled ? externalPage : internalPage;
  const currentPageSize = externalPageSize ?? internalPageSize;
  const totalCount = externalTotalCount ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / currentPageSize));
  
  // Get visible columns
  const visibleColumns = useMemo(() => {
    return config.columns.filter((col) => {
      if (col.visible === false) return false;
      if (!col.showWhen) return true;
      // Note: In tables, we usually don't have a "row" context for the column itself 
      // unless it's per-row visibility, but here it's per-column visibility.
      // We pass an empty record for formData since column showWhen usually depends on feature flags.
      return evaluateConditions(col.showWhen, {}, featureFlags);
    });
  }, [config.columns, featureFlags]);
  
  // Row key getter
  const getKey = useCallback((row: T): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return (row as DataRecord)[rowKey] as string | number;
  }, [rowKey]);
  
  // Selection
  const selection = useSimpleSelection(
    data,
    rowKey,
    selectionMode,
    externalSelectedIds,
    onSelectionChange
  );
  
  // Determine if we should show a status dot column (green circle)
  // We check if any of the rows has one of the common status properties
  const showStatusColumn = useMemo(() => {
    return data.slice(0, 50).some(row => 
      (row as any).isEnabled !== undefined || 
      (row as any).active !== undefined || 
      (row as any).isActive !== undefined ||
      (row as any).available !== undefined ||
      (row as any).quantityAvailable !== undefined
    );
  }, [data]);
  
  // Expanded keys for tree table
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string | number>>(new Set());

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (isPageControlled && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  }, [isPageControlled, onPageChange]);
  
  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    setInternalPageSize(newPageSize);
    handlePageChange(1);
  }, [onPageSizeChange, handlePageChange]);
  
  // Handle sort change
  const handleSortChange = useCallback((column: ColumnConfig) => {
    if (!column.sortable) return;
    
    const newSort: ColumnSortState | null = sortState?.key === column.key
      ? sortState.direction === 'asc'
        ? { key: column.key, direction: 'desc' }
        : sortState.direction === 'desc'
          ? null
          : { key: column.key, direction: 'asc' }
      : { key: column.key, direction: 'asc' };
    
    setSortState(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  }, [sortState, onSortChange]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);
  
  // Reset page
  const resetPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);
  
  // Expose ref methods
  useImperativeHandle(ref, () => ({
    clearFilters,
    clearSelection: selection.clear,
    resetPage,
    getFilters: () => filters,
    getSelectedIds: () => selection.selectedIds
  }), [clearFilters, selection.clear, resetPage, filters, selection.selectedIds]);
  
  // Apply client-side sorting (if no server-side handler provided) and pagination if not controlled
  const processedData = useMemo(() => {
    let working = [...data];

    // If no server-side sorting handler is provided, apply client-side sort using sortState
    if (!onSortChange && sortState) {
      const col = config.columns.find(c => c.key === sortState.key);
      if (col) {
        const getSortValue = (row: T) => {
          const v = getCellValue(row, col as ColumnConfig);
          // Primitive numbers
          if (typeof v === 'number') return v;
          if (v == null) return '';
          // Arrays -> join or use first element
          if (Array.isArray(v)) {
            return (v as any[]).map(it => (it && typeof it === 'object') ? (it.label ?? it.name ?? String(it)) : String(it)).join(' ');
          }
          if (typeof v === 'object') {
            const obj = v as Record<string, any>;
            return (obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj));
          }
          return String(v).toLowerCase();
        };

        working.sort((a, b) => {
          const av = getSortValue(a);
          const bv = getSortValue(b);

          if (typeof av === 'number' && typeof bv === 'number') {
            return sortState.direction === 'asc' ? av - bv : bv - av;
          }

          return sortState.direction === 'asc'
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av));
        });
      }
    }

    if (isPageControlled) return working;
    const start = (currentPage - 1) * currentPageSize;
    return working.slice(start, start + currentPageSize);
  }, [data, isPageControlled, currentPage, currentPageSize, sortState, onSortChange, config.columns]);

  // Expose the data we'll display in the table body (processedData may be paginated already)
  const displayData = processedData;
  
  // Compute effective theme: when 'system', prefer document's Bootstrap attribute `data-bs-theme`, fall back to prefers-color-scheme
  const effectiveTheme = (() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    // theme === 'system'
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const bs = document.documentElement.getAttribute('data-bs-theme');
      if (bs === 'dark' || bs === 'light') return bs as 'dark' | 'light';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  })();

  // Column resize state & handlers
  const [resizing, setResizing] = useState<{ key: string | null; startX: number; startWidth: number } | null>(null);

  // --- Sticky Left Columns Calculation ---
  const stickyLeftOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentOffset = 0;

    // 1. Selection column
    if (selectable) {
      offsets['selection'] = currentOffset;
      currentOffset += 48; // 3rem
    }

    // 2. Row numbers
    if (showRowNumbers) {
      offsets['rownum'] = currentOffset;
      currentOffset += 48; // 3rem
    }

    // 3. Status column
    if (showStatusColumn) {
      offsets['status'] = currentOffset;
      currentOffset += 40; // Synchronized with CSS 40px
    }

    // 4. First data column
    if (visibleColumns.length > 0) {
      const firstCol = visibleColumns[0];
      offsets[String(firstCol.key)] = currentOffset;
    }

    return offsets;
  }, [selectable, showRowNumbers, showStatusColumn, visibleColumns]);

  const startColumnResize = useCallback((e: React.MouseEvent, key: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    const el = (e.target as HTMLElement).closest('th') as HTMLElement | null;
    if (!el) return;
    const startWidth = el.getBoundingClientRect().width;
    setResizing({ key: String(key), startX: (e as any).clientX, startWidth });
  }, []);

  // Ensure columns are resizable by default unless explicitly disabled
  useEffect(() => {
    try {
      (config.columns as any[]).forEach((c: any) => {
        if (c.resizable === undefined) c.resizable = true;
      });
    } catch (e) {
      // ignore - defensive
    }
  }, [config.columns]);

  // When resizing, we recompute table minimum width to allow table to grow
  useEffect(() => {
    if (!resizing) return;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - (resizing.startX || 0);
      let newWidth = Math.max(MIN_PX, Math.max(40, (resizing.startWidth || 0) + dx));

      // store in config.columns _computedWidth for simplicity
      (config.columns as any[]).forEach((c: any) => {
        if (String(c.key) === resizing.key) c._computedWidth = `${newWidth}px`;
      });

      // Also expand table minWidth to the sum of columns to allow table expansion
      try {
        const sum = (config.columns as any[]).reduce((acc, c: any) => {
          const w = parseWidthPx(c) ?? 120;
          return acc + w;
        }, 0);
        if (tableElRef.current) {
          tableElRef.current.style.minWidth = `${sum}px`;
        }
      } catch (e) {
        // ignore
      }

      // Force re-render by updating state (trick: setResizing with same key)
      setResizing(cur => cur ? { ...cur } : cur);
    };
    const onUp = () => {
      // Persist widths to localStorage using table id
      try {
        const storageKey = `dn:col_widths:${config.id || 'table'}`;
        const widths: Record<string, string> = {};
        (config.columns as any[]).forEach((c: any) => {
          if (c._computedWidth) widths[String(c.key)] = String(c._computedWidth);
        });
        localStorage.setItem(storageKey, JSON.stringify({ widths }));
      } catch (e) {
        // ignore storage errors
      }
      setResizing(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [resizing, config.columns]);


  // On mount: restore column widths from localStorage if present
  useEffect(() => {
    try {
      const storageKey = `dn:col_widths:${config.id || 'table'}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.widths) {
          (config.columns as any[]).forEach((c: any) => {
            if (parsed.widths[c.key]) c._computedWidth = parsed.widths[c.key];
          });
          // Trigger render
          setResizing(cur => cur ? { ...cur } : cur);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [config.id, config.columns]);

  // Utility: parse computed width as number of pixels
  const parseWidthPx = (col: any): number | null => {
    const w = col._computedWidth ?? col.width;
    if (w == null) return null;
    if (typeof w === 'number') return w;
    const str = String(w).trim();
    const m = str.match(/^(\d+)/);
    if (m) return Number(m[1]);
    return null;
  };

  // Minimum chars to display when shrunk; approximate px per char
  const MIN_CHAR_DISPLAY = 6;
  const CHAR_PX = 8; // heuristic
  const MIN_PX = MIN_CHAR_DISPLAY * CHAR_PX;

  // Table ref to allow expanding table width when user enlarges columns
  const tableElRef = React.useRef<HTMLTableElement | null>(null);

  // Render loading state
  if (loading && data.length === 0) {
    return (
      <div className={cn('dui-table-container', effectiveTheme === 'dark' ? 'dui-theme--dark' : 'dui-theme--light', className)} style={style}>
        {renderLoading()}
      </div>
    );
  }
  
  // Render error state
  if (error && data.length === 0) {
    return (
      <div className={cn('dui-table-container', effectiveTheme === 'dark' ? 'dui-theme--dark' : 'dui-theme--light', className)} style={style}>
        {renderError(error)}
      </div>
    );
  }
  
  // Calculate table classes
  const tableClasses = cn(
    'dui-table',
    striped && 'dui-table-striped',
    hoverable && 'dui-table-hoverable',
    bordered && 'dui-table-bordered',
    compact && 'dui-table-compact',
    stickyHeader && 'dui-table-sticky-header'
  );
  
  // Container styles
  const containerStyle: CSSProperties = {
    ...style,
    ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {})
  };
  
  return (
    <div className={cn('dui-table-container', effectiveTheme === 'dark' ? 'dui-theme--dark' : 'dui-theme--light', className)} style={containerStyle}>
      {/* Toolbar */}
      {showToolbar && (
        <TableToolbar
          showSearch={showToolbarSearch}
          searchPlaceholder={toolbarSearchPlaceholder}
          searchValue={toolbarSearchValue}
          onSearch={onToolbarSearch}
          showRefresh={showToolbarRefresh}
          onRefresh={onToolbarRefresh}
          showCreate={showToolbarCreate}
          createLabel={typeof toolbarCreateLabel !== 'undefined' ? toolbarCreateLabel : (config && (config as any).toolbarCreateLabel)}
          onCreate={onToolbarCreate}
          showAdvancedSearch={showToolbarAdvancedSearch}
          onAdvancedSearch={onToolbarAdvancedSearch}
          selectedCount={selection.selectedIds.length}
          onClearSelection={selection.clear}
          onDeleteSelected={onToolbarDeleteSelected}
          onToggleEnabled={onToolbarToggleEnabled}
          deleteLabel={toolbarDeleteLabel}
          renderCustomContent={renderToolbarCustomContent}
          onOpenColumns={onToolbarOpenColumns}
          showColumnsButton={Boolean(onToolbarOpenColumns)}
          columnsNeedsSync={toolbarColumnsNeedsSync}
          disabled={toolbarDisabled}
          columns={config.columns}
        />
      )}
      
      <div className="dui-table-wrapper" style={preventLayoutShift ? { scrollbarGutter: 'stable' as any } : {}}>
        <table className={tableClasses}>
          <thead className="dui-table-head">
            {renderHeader ? (
              renderHeader(visibleColumns)
            ) : (
              <tr className="dui-table-row dui-table-header-row">
                {selectable && selectionMode === 'multiple' && (
                  <th 
                    className={cn("dui-table-th dui-table-th-checkbox dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last")}
                    style={{ left: stickyLeftOffsets['selection'], backgroundColor: 'var(--dui-table-header-bg)' }}
                  >
                    <Checkbox
                      checked={selection.isAllSelected}
                      indeterminate={selection.isSomeSelected && !selection.isAllSelected}
                      onChange={() => selection.toggleAll()}
                    />
                  </th>
                )}
                
                {selectable && selectionMode === 'single' && (
                  <th 
                    className={cn("dui-table-th dui-table-th-radio dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last")}
                    style={{ left: stickyLeftOffsets['selection'], backgroundColor: 'var(--dui-table-header-bg)' }}
                  />
                )}
                
                {showRowNumbers && (
                  <th 
                    className={cn("dui-table-th dui-table-th-rownum dui-table-sticky-left", visibleColumns.length === 0 && !showStatusColumn && "dui-table-sticky-left-last")}
                    style={{ left: stickyLeftOffsets['rownum'], backgroundColor: 'var(--dui-table-header-bg)' }}
                  >#</th>
                )}
                
                {showStatusColumn && (
                  <th 
                    className={cn("dui-table-th dui-table-th-status dui-table-sticky-left", visibleColumns.length === 0 && "dui-table-sticky-left-last")}
                    style={{ width: '2.5rem', textAlign: 'center', left: stickyLeftOffsets['status'], backgroundColor: 'var(--dui-table-header-bg)' }} 
                  />
                )}
                
                {visibleColumns.map((column, index) => {
                  const isActionsCol = column.key === 'actions' || (column as any).type === 'actions' || (column as any).dataType === 'actions';
                  const isFirstDataCol = index === 0;
                  
                  return (
                    <th
                      key={column.key}
                      className={cn(
                        'dui-table-th',
                        column.sortable && 'dui-table-th-sortable',
                        column.align && `dui-table-th-${column.align}`,
                        isActionsCol && 'dui-table-th-actions',
                        isFirstDataCol && 'dui-table-sticky-left dui-table-sticky-left-last'
                      )}
                      style={{
                        width: (column as any)._computedWidth ?? column.width,
                        minWidth: column.minWidth ?? `${MIN_PX}px`,
                        maxWidth: column.maxWidth,
                        backgroundColor: (isActionsCol || isFirstDataCol) ? 'var(--dui-table-header-bg)' : undefined,
                        left: isFirstDataCol ? stickyLeftOffsets[String(column.key)] : undefined,
                        zIndex: (isFirstDataCol || isActionsCol) ? 15 : undefined
                      }}
                      onClick={() => column.sortable && handleSortChange(column)}
                    >
                    <div className="dui-table-th-content">
                      <span className="dui-table-th-text">{(function getColumnLabel() {
                        const headerStr = typeof column.header === 'string' ? column.header : '';
                        const namespace = (column as any).translationNamespace;
                        
                        // Prefer explicit translations for the column key
                        const tByKey = t(`columns.labels.${String(column.key)}`);
                        if (tByKey && tByKey !== `columns.labels.${String(column.key)}`) return tByKey;
                        
                        // Otherwise resolve label from header or humanize
                        return resolveLabel(headerStr || String(column.key), undefined, namespace);
                      })()}</span>
                      {column.sortable && (
                        <SortIndicator 
                          direction={sortState?.key === column.key ? sortState.direction : null} 
                        />
                      )}
                    </div>

                    {/* Resize handle */}
                    {column.resizable && (
                      <div
                        className="dui-table-th-resize-handle"
                        onMouseDown={(e) => startColumnResize(e, column.key)}
                        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 8, cursor: 'col-resize' }}
                        role="separator"
                        aria-orientation="horizontal"
                      />
                    )}
                  </th>
                );
              })}                
                {renderActions && (
                  <th className="dui-table-th dui-table-th-actions" style={{ backgroundColor: 'var(--dui-table-header-bg)' }}>
                    {t('table.actions')}
                  </th>
                )}
              </tr>
            )}
          </thead>
          
          <tbody className="dui-table-body">
            {displayData.length === 0 ? (
              <tr>
                <td 
                  colSpan={
                    visibleColumns.length + 
                    (selectable ? 1 : 0) + 
                    (showRowNumbers ? 1 : 0) + 
                    (showStatusColumn ? 1 : 0) + 
                    (renderActions ? 1 : 0) +
                    (isTreeTable ? 1 : 0)
                  }
                  className="dui-table-td-empty"
                >
                  {renderEmpty()}
                </td>
              </tr>
            ) : (
              displayData.map((row, index) => {
                const key = getKey(row);
                const rowIndex = (currentPage - 1) * currentPageSize + index;
                const isRowSelected = selectable && selection.isSelected(key);
                const isExpanded = controlledExpandedKeys? controlledExpandedKeys.includes(key) : internalExpandedKeys.has(key);
                const isChild = !!(row as any).parentId;
                
                if (renderRow) {
                  return renderRow(row, rowIndex, visibleColumns);
                }
                
                const toggleExpand = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const nextExpanded = !isExpanded;
                  if (!controlledExpandedKeys) {
                    const next = new Set(internalExpandedKeys);
                    if (nextExpanded) next.add(key);
                    else next.delete(key);
                    setInternalExpandedKeys(next);
                  }
                  onToggleExpand?.(row, nextExpanded);
                };

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        'dui-table-row',
                        isRowSelected && 'dui-table-row-selected',
                        onRowClick && 'dui-table-row-clickable',
                        isChild && 'dui-table-row-child'
                      )}
                      onClick={(e) => {
                        if ((e as React.MouseEvent).button !== 0) return;
                        onRowClick?.(row, rowIndex);
                      }}
                      onDoubleClick={(e) => {
                        if ((e as React.MouseEvent).button !== 0) return;
                        onRowDoubleClick?.(row, rowIndex);
                      }}
                      onContextMenu={(e) => { e.stopPropagation(); }}
                    >
                      {isTreeTable && (
                        <td className="dui-table-td dui-table-td-tree-toggle" onClick={(e) => e.stopPropagation()}>
                          {((row as any).hasChildren || (row as any).isVariable || (row as any).children?.length > 0) && (
                            <button type="button" onClick={toggleExpand} className="dui-table-tree-btn">
                              <span className={cn('dui-table-tree-icon', isExpanded && 'dui-table-tree-icon--expanded')}>
                                {IconComponent ? <IconComponent name="chevron-right" /> : (isExpanded ? '▼' : '▶')}
                              </span>
                            </button>
                          )}
                        </td>
                      )}

                      {selectable && selectionMode === 'multiple' && (
                        <td 
                          className={cn("dui-table-td dui-table-td-checkbox dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last")}
                          style={{ left: stickyLeftOffsets['selection'], backgroundColor: 'inherit' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox
                              checked={isRowSelected}
                              onChange={() => selection.toggle(key)}
                            />
                          </div>
                        </td>
                      )}
                      
                      {selectable && selectionMode === 'single' && (
                        <td 
                          className={cn("dui-table-td dui-table-td-radio dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last")}
                          style={{ left: stickyLeftOffsets['selection'], backgroundColor: 'inherit' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input
                              type="radio"
                              className="dui-table-radio"
                              checked={isRowSelected}
                              onChange={() => selection.toggle(key)}
                            />
                          </div>
                        </td>
                      )}
                      
                      {showRowNumbers && (
                        <td 
                          className={cn("dui-table-td dui-table-td-rownum dui-table-sticky-left", visibleColumns.length === 0 && !showStatusColumn && "dui-table-sticky-left-last")}
                          style={{ left: stickyLeftOffsets['rownum'], backgroundColor: 'inherit' }}
                        >
                          {rowIndex + 1}
                        </td>
                      )}
                      
                      {showStatusColumn && (
                        <td 
                          className={cn("dui-table-td dui-table-td-status dui-table-sticky-left", visibleColumns.length === 0 && "dui-table-sticky-left-last")}
                          style={{ textAlign: 'center', width: '2.5rem', left: stickyLeftOffsets['status'], backgroundColor: 'inherit' }} 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {(function renderStatusDot() {
                            const active = (row as any).isEnabled ?? (row as any).active ?? (row as any).isActive ?? (row as any).available ?? ((row as any).quantityAvailable !== undefined ? (row as any).quantityAvailable > 0 : undefined);
                            if (active === undefined) return null;
                            return (
                              <span 
                                className={cn(
                                  'dui-table-status-dot',
                                  active ? 'dui-table-status-dot--active' : 'dui-table-status-dot--inactive'
                                )}
                                title={active ? t('common.active', { default: 'Activo' }) : t('common.inactive', { default: 'Inactivo' })}
                                style={{ marginLeft: 0 }}
                              />
                            );
                          })()}
                        </td>
                      )}
                      
                      {visibleColumns.map((column, colIndex) => {
                        const isFirstDataCol = colIndex === 0;
                        if ((column as any).type === 'actions' || (column as any).dataType === 'actions') {
                          const actions = (column as any).actions || [];

                          return (
                            <td
                              key={column.key}
                              className={cn(
                                'dui-table-td',
                                column.align && `dui-table-td-${column.align}`,
                                'dui-table-td-actions'
                              )}
                              style={{
                                width: column.width,
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                                backgroundColor: 'var(--dui-table-bg)',
                                position: 'sticky',
                                right: 0,
                                zIndex: 5
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div style={{ 
                                display: 'flex', 
                                gap: 8, 
                                justifyContent: column.align === 'center' ? 'center' : (column.align === 'right' ? 'flex-end' : undefined) 
                              }}>
                                {actions.map((action: any) => {
                                  let renderedIcon: React.ReactNode = action.icon;
                                  
                                  if (typeof action.icon === 'string') {
                                    if (IconComponent) {
                                      renderedIcon = <IconComponent name={action.icon} className="w-4 h-4" />;
                                    }
                                  }

                                    const getVariantClass = (v?: string) => {
                                      if (!v) return 'btn-ghost';
                                      if (v.includes('ghost')) return `btn-${v}`;
                                      if (v.includes('outline')) return `btn-${v}`;
                                      if (v === 'info' || v === 'primary') return 'btn-ghost text-primary';
                                      if (v === 'warning') return 'btn-ghost text-warning';
                                      if (v === 'danger') return 'btn-ghost text-danger';
                                      return `btn-ghost text-${v}`;
                                    };

                                    return (
                                      <button
                                        key={action.id}
                                        type="button"
                                        title={typeof action.label === 'string' ? resolveLabel(action.label) : undefined}
                                        className={`btn btn-sm ${getVariantClass(action.variant)}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          action.onClick?.(row, rowIndex);
                                        }}
                                      >
                                        {renderedIcon ? renderedIcon : (typeof action.label === 'string' ? resolveLabel(action.label) : action.label)}
                                      </button>
                                    );
                                })}
                              </div>
                            </td>
                          );
                        }

                        const value = getCellValue(row, column);
                        const formattedValue = formatCellValue(
                          value, 
                          column as ColumnConfig<T>, 
                          row, 
                          emptyValue
                        );
                        
                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'dui-table-td',
                              column.align && `dui-table-td-${column.align}`,
                              isFirstDataCol && 'dui-table-sticky-left dui-table-sticky-left-last'
                            )}
                            style={{
                              width: column.width,
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              left: isFirstDataCol ? stickyLeftOffsets[String(column.key)] : undefined,
                              backgroundColor: isFirstDataCol ? 'inherit' : undefined,
                              paddingLeft: isFirstDataCol && isChild ? '2rem' : undefined
                            }}
                          >
                            {formattedValue}
                          </td>
                        );
                      })}
                      
                      {renderActions && (
                        <td 
                          className="dui-table-td dui-table-td-actions"
                          style={{ backgroundColor: 'var(--dui-table-bg)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {renderActions(row, rowIndex)}
                        </td>
                      )}
                    </tr>
                    
                    {isExpanded && renderSubRow && (
                      <tr className="dui-table-row-sub">
                        <td colSpan={visibleColumns.length + (selectable ? 1 : 0) + (showRowNumbers ? 1 : 0) + (showStatusColumn ? 1 : 0) + (renderActions ? 1 : 0) + (isTreeTable ? 1 : 0)}>
                          <div className="dui-table-subrow-content">
                            {renderSubRow(row)}
                          </div>
                        </td>
                      </tr>
                    )}

                    {isExpanded && (row as any).children && (row as any).children.map((child: any, childIdx: number) => {
                       // Recursively render child rows if needed, but for now flat children with indentation handles it
                       // Actually better if displayData is ALREADY flattened or if we handle nested here.
                       // For simplicity with server-side pagination, we'll assume children are nested in the parent object.
                       return null; // For now handled by ProductsPage inserting them into the list or using renderSubRow
                    })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

        </table>
      </div>
      
      {loading && data.length > 0 && (
        <div className="dui-table-loading-overlay">
          <div className="dui-table-loading-spinner" />
        </div>
      )}
      
      {config.pagination?.enabled !== false && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={currentPageSize}
          totalCount={totalCount}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}

/**
 * TableRenderer with forwardRef support
 */
export const TableRenderer = forwardRef(TableRendererInner) as <T extends DataRecord>(
  props: TableRendererProps<T> & { ref?: React.ForwardedRef<TableRendererRef> }
) => JSX.Element;

(TableRenderer as React.FC).displayName = 'TableRenderer';

export default TableRenderer;
