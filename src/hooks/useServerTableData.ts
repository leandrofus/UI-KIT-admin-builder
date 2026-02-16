/**
 * @fileoverview useServerTableData - Server-side table data with pagination, sort, search, filters, selection
 *
 * Single contract for "table fed by server": holds page, pageSize, sort, searchTerm,
 * advancedFilters, selectedRows; calls fetchFn(params) and exposes refresh/setters.
 * Compatible with TableRenderer and optional integration with adapters (ListOptions).
 *
 * @module hooks/useServerTableData
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  DataRecord,
  SortDirection,
  PaginatedResponse,
  AdvancedFilter,
  ServerTableQueryParams,
} from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface UseServerTableDataOptions<T = DataRecord> {
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

export interface UseServerTableDataReturn<T = DataRecord> {
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

// =============================================================================
// HELPERS
// =============================================================================

function getRowId<T>(row: T, rowKey: keyof T | string): string | number {
  const key = rowKey as keyof T;
  const val = (row as Record<string, unknown>)[key as string];
  return val as string | number;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Server-side table data: pagination, sort, search, advanced filters, selection.
 * Call fetchFn with current params; expose state and setters for TableRenderer.
 */
export function useServerTableData<T extends DataRecord = DataRecord>(
  options: UseServerTableDataOptions<T>
): UseServerTableDataReturn<T> {
  const {
    fetchFn,
    pageSize: initialPageSize = 10,
    searchDebounce = 300,
    autoFetch = true,
    defaultSort = { column: null, direction: null },
    rowKey = 'id',
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [sort, setSortState] = useState<SortState>(defaultSort);
  const [searchTerm, setSearchTermState] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [refreshCounter, setRefreshCounter] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    if (searchDebounce <= 0) {
      setDebouncedSearchTerm(searchTerm);
      return;
    }
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), searchDebounce);
    return () => clearTimeout(t);
  }, [searchTerm, searchDebounce]);

  // Reset to page 1 when search or filters change (so next fetch uses page 1)
  useEffect(() => {
    setPageState(1);
  }, [debouncedSearchTerm, advancedFilters.length]);

  const fetchData = useCallback(async () => {
    const params: ServerTableQueryParams = {
      page,
      pageSize,
      sortColumn: sort.column ?? undefined,
      sortDirection: sort.direction,
      searchTerm: debouncedSearchTerm || undefined,
      advancedFilters: advancedFilters.length > 0 ? advancedFilters : undefined,
      filters:
        advancedFilters.length > 0 ? { advanced: advancedFilters } : undefined,
    };

    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFn(params);
      setData(response.data ?? []);
      setTotalItems(response.total ?? 0);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Error loading data');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [
    fetchFn,
    page,
    pageSize,
    sort.column,
    sort.direction,
    debouncedSearchTerm,
    advancedFilters,
  ]);

  // Single effect: fetch when params or refresh change
  useEffect(() => {
    if (!autoFetch && refreshCounter === 0) return;
    fetchData();
  }, [fetchData, refreshCounter, autoFetch]);

  const setPage = useCallback((p: number) => setPageState(Math.max(1, p)), []);
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1);
  }, []);
  const setSort = useCallback((s: SortState) => {
    setSortState(s);
    setPageState(1);
  }, []);
  const setSearchTerm = useCallback((term: string) => setSearchTermState(term), []);
  const setAdvancedFiltersCallback = useCallback((filters: AdvancedFilter[]) => setAdvancedFilters(filters), []);
  const addFilter = useCallback((filter: AdvancedFilter) => setAdvancedFilters((prev) => [...prev, filter]), []);
  const removeFilter = useCallback((index: number) => setAdvancedFilters((prev) => prev.filter((_, i) => i !== index)), []);

  const refresh = useCallback(async () => {
    setRefreshCounter((c) => c + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTermState('');
    setAdvancedFilters([]);
    setSelectedRows(new Set());
    setPageState(1);
  }, []);

  const selectedData = data.filter((row) => selectedRows.has(getRowId(row, rowKey)));

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return {
    data,
    totalItems,
    loading,
    error,
    page,
    pageSize,
    sort,
    searchTerm,
    advancedFilters,
    selectedRows,
    setPage,
    setPageSize,
    setSort,
    setSearchTerm,
    setAdvancedFilters: setAdvancedFiltersCallback,
    addFilter,
    removeFilter,
    setSelectedRows,
    refresh,
    clearFilters,
    selectedData,
  };
}

export default useServerTableData;
