/**
 * @fileoverview Hook for managing paginated data state
 * 
 * Handles pagination, sorting, and search state for tables.
 * Works with both client-side and server-side pagination.
 * 
 * @module hooks/usePaginatedData
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { 
  DataRecord, 
  SortDirection, 
  PaginationConfig,
  AdvancedFilter,
  PaginatedResponse,
  PaginationParams 
} from '../core/types';
import { 
  sortData, 
  filterBySearchTerm, 
  paginateData, 
  calculatePagination,
  getNestedValue 
} from '../core/utils';

// =============================================================================
// TYPES
// =============================================================================

/**
 * State for paginated data
 */
export interface PaginatedDataState<T = DataRecord> {
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
export interface PaginatedDataActions<T = DataRecord> {
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
export interface UsePaginatedDataOptions<T = DataRecord> {
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

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

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
export function usePaginatedData<T extends DataRecord = DataRecord>(
  options: UsePaginatedDataOptions<T> = {}
): { state: PaginatedDataState<T>; actions: PaginatedDataActions<T> } {
  const {
    initialData = [],
    totalItems,
    pagination = {},
    defaultSortColumn = null,
    defaultSortDirection = null,
    searchableColumns = [],
    fetcher,
    onParamsChange,
    fetchOnMount = true,
  } = options;

  const defaultPageSize = pagination.pageSize ?? 10;

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [rawData, setRawData] = useState<T[]>(initialData);
  const [serverTotal, setServerTotal] = useState<number | undefined>(totalItems);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  // Is this server-side pagination?
  const isServerSide = !!fetcher || serverTotal !== undefined;

  // Process data (client-side only)
  const processedData = useMemo(() => {
    if (isServerSide) {
      return rawData;
    }

    let result = [...rawData];

    // Apply search filter
    if (searchTerm && searchableColumns.length > 0) {
      result = filterBySearchTerm(result, searchTerm, searchableColumns);
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      result = sortData(result, sortColumn, sortDirection);
    }

    return result;
  }, [rawData, searchTerm, searchableColumns, sortColumn, sortDirection, isServerSide]);

  // Calculate total
  const total = isServerSide ? (serverTotal ?? 0) : processedData.length;

  // Paginate (client-side only)
  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return rawData;
    }
    return paginateData(processedData, page, pageSize);
  }, [processedData, page, pageSize, isServerSide, rawData]);

  // Calculate pagination metadata
  const paginationMeta = useMemo(
    () => calculatePagination(total, page, pageSize),
    [total, page, pageSize]
  );

  // ==========================================================================
  // SERVER-SIDE FETCHING
  // ==========================================================================

  useEffect(() => {
    if (!fetcher || (!fetchOnMount && refreshCounter === 0)) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: PaginationParams = {
          page,
          pageSize,
          sortColumn: sortColumn ?? undefined,
          sortDirection,
        };

        const response = await fetcher(params);
        setRawData(response.data);
        setServerTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetcher, page, pageSize, sortColumn, sortDirection, refreshCounter, fetchOnMount]);

  // Notify parent of param changes
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange({
        page,
        pageSize,
        sortColumn: sortColumn ?? undefined,
        sortDirection,
      });
    }
  }, [page, pageSize, sortColumn, sortDirection, onParamsChange]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, advancedFilters]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const goToPage = useCallback((newPage: number) => {
    const maxPage = Math.ceil(total / pageSize) || 1;
    setPage(Math.max(1, Math.min(newPage, maxPage)));
  }, [total, pageSize]);

  const nextPage = useCallback(() => {
    if (paginationMeta.hasNextPage) {
      setPage(p => p + 1);
    }
  }, [paginationMeta.hasNextPage]);

  const previousPage = useCallback(() => {
    if (paginationMeta.hasPreviousPage) {
      setPage(p => p - 1);
    }
  }, [paginationMeta.hasPreviousPage]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const setSort = useCallback((column: string, direction: SortDirection) => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  const toggleSort = useCallback((column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSetAdvancedFilters = useCallback((filters: AdvancedFilter[]) => {
    setAdvancedFilters(filters);
  }, []);

  const addFilter = useCallback((filter: AdvancedFilter) => {
    setAdvancedFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setAdvancedFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setAdvancedFilters([]);
  }, []);

  const refresh = useCallback(() => {
    setRefreshCounter(c => c + 1);
  }, []);

  const handleSetData = useCallback((data: T[], newTotal?: number) => {
    setRawData(data);
    if (newTotal !== undefined) {
      setServerTotal(newTotal);
    }
  }, []);

  const handleSetLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleSetError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const reset = useCallback(() => {
    setRawData(initialData);
    setServerTotal(totalItems);
    setPage(1);
    setPageSize(defaultPageSize);
    setSortColumn(defaultSortColumn);
    setSortDirection(defaultSortDirection);
    setSearchTerm('');
    setAdvancedFilters([]);
    setIsLoading(false);
    setError(null);
  }, [initialData, totalItems, defaultPageSize, defaultSortColumn, defaultSortDirection]);

  // ==========================================================================
  // RETURN
  // ==========================================================================

  const state: PaginatedDataState<T> = {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages: paginationMeta.totalPages,
    sortColumn,
    sortDirection,
    searchTerm,
    advancedFilters,
    isLoading,
    error,
    displayRange: paginationMeta.displayRange,
    hasNextPage: paginationMeta.hasNextPage,
    hasPreviousPage: paginationMeta.hasPreviousPage,
  };

  const actions: PaginatedDataActions<T> = {
    goToPage,
    nextPage,
    previousPage,
    setPageSize: handleSetPageSize,
    setSort,
    toggleSort,
    setSearchTerm: handleSetSearchTerm,
    setAdvancedFilters: handleSetAdvancedFilters,
    addFilter,
    removeFilter,
    clearFilters,
    refresh,
    setData: handleSetData,
    setLoading: handleSetLoading,
    setError: handleSetError,
    reset,
  };

  return { state, actions };
}

export default usePaginatedData;
