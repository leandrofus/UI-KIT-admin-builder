/**
 * @fileoverview Hook for managing table column configuration
 * 
 * Handles column visibility, ordering, and resizing.
 * 
 * @module hooks/useColumnConfig
 */

import { useState, useCallback, useMemo } from 'react';
import type { ColumnConfig, DataRecord, SortDirection } from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Column state (visibility, order, width)
 */
export interface ColumnState {
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
export interface ColumnConfigState {
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
export interface ColumnConfigActions {
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
export interface UseColumnConfigOptions<T extends DataRecord = DataRecord> {
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

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

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
export function useColumnConfig<T extends DataRecord = DataRecord>(
  options: UseColumnConfigOptions<T>
): { state: ColumnConfigState; actions: ColumnConfigActions } {
  const {
    columns: initialColumns,
    storageKey,
    defaultSortColumn = null,
    defaultSortDirection = null,
    onConfigChange,
  } = options;

  // ==========================================================================
  // INITIAL STATE
  // ==========================================================================

  const getInitialState = useCallback((): ColumnConfigState => {
    // Try to load from storage
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load column config from storage:', e);
      }
    }

    // Build default state from columns
    const columnsState: Record<string, ColumnState> = {};
    initialColumns.forEach((col, index) => {
      columnsState[col.key] = {
        key: col.key,
        visible: col.visible !== false,
        width: col.width,
        order: index,
      };
    });

    const visibleKeys = initialColumns
      .filter(col => col.visible !== false)
      .map(col => col.key);

    return {
      columns: columnsState,
      visibleColumnKeys: visibleKeys,
      sortColumn: defaultSortColumn,
      sortDirection: defaultSortDirection,
    };
  }, [initialColumns, storageKey, defaultSortColumn, defaultSortDirection]);

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [state, setState] = useState<ColumnConfigState>(getInitialState);

  // ==========================================================================
  // MEMOIZED VALUES
  // ==========================================================================

  const columnMap = useMemo(() => {
    const map = new Map<string, ColumnConfig<T>>();
    initialColumns.forEach(col => map.set(col.key, col));
    return map;
  }, [initialColumns]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const updateState = useCallback((updater: (prev: ColumnConfigState) => ColumnConfigState) => {
    setState(prev => {
      const newState = updater(prev);
      if (onConfigChange) {
        onConfigChange(newState);
      }
      return newState;
    });
  }, [onConfigChange]);

  const toggleColumn = useCallback((key: string) => {
    updateState(prev => {
      const column = prev.columns[key];
      if (!column) return prev;

      const newVisible = !column.visible;
      const newColumns = {
        ...prev.columns,
        [key]: { ...column, visible: newVisible },
      };

      const newVisibleKeys = newVisible
        ? [...prev.visibleColumnKeys, key].sort((a, b) => {
            return (prev.columns[a]?.order ?? 0) - (prev.columns[b]?.order ?? 0);
          })
        : prev.visibleColumnKeys.filter(k => k !== key);

      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: newVisibleKeys,
      };
    });
  }, [updateState]);

  const setColumnVisible = useCallback((key: string, visible: boolean) => {
    updateState(prev => {
      const column = prev.columns[key];
      if (!column || column.visible === visible) return prev;

      const newColumns = {
        ...prev.columns,
        [key]: { ...column, visible },
      };

      const newVisibleKeys = visible
        ? [...prev.visibleColumnKeys, key].sort((a, b) => {
            return (prev.columns[a]?.order ?? 0) - (prev.columns[b]?.order ?? 0);
          })
        : prev.visibleColumnKeys.filter(k => k !== key);

      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: newVisibleKeys,
      };
    });
  }, [updateState]);

  const setColumnWidth = useCallback((key: string, width: number | string) => {
    updateState(prev => {
      const column = prev.columns[key];
      if (!column) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [key]: { ...column, width },
        },
      };
    });
  }, [updateState]);

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    updateState(prev => {
      const keys = [...prev.visibleColumnKeys];
      const [removed] = keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, removed);

      // Update order in column states
      const newColumns = { ...prev.columns };
      keys.forEach((key, index) => {
        if (newColumns[key]) {
          newColumns[key] = { ...newColumns[key], order: index };
        }
      });

      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: keys,
      };
    });
  }, [updateState]);

  const moveColumn = useCallback((key: string, toIndex: number) => {
    updateState(prev => {
      const fromIndex = prev.visibleColumnKeys.indexOf(key);
      if (fromIndex === -1) return prev;

      const keys = [...prev.visibleColumnKeys];
      keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, key);

      // Update order in column states
      const newColumns = { ...prev.columns };
      keys.forEach((k, index) => {
        if (newColumns[k]) {
          newColumns[k] = { ...newColumns[k], order: index };
        }
      });

      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: keys,
      };
    });
  }, [updateState]);

  const setSort = useCallback((column: string | null, direction: SortDirection) => {
    updateState(prev => ({
      ...prev,
      sortColumn: column,
      sortDirection: direction,
    }));
  }, [updateState]);

  const toggleSort = useCallback((column: string) => {
    updateState(prev => {
      if (prev.sortColumn !== column) {
        return { ...prev, sortColumn: column, sortDirection: 'asc' };
      } else if (prev.sortDirection === 'asc') {
        return { ...prev, sortDirection: 'desc' };
      } else if (prev.sortDirection === 'desc') {
        return { ...prev, sortColumn: null, sortDirection: null };
      } else {
        return { ...prev, sortDirection: 'asc' };
      }
    });
  }, [updateState]);

  const reset = useCallback(() => {
    setState(getInitialState());
    if (storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [getInitialState, storageKey]);

  const getVisibleColumns = useCallback(<TData extends DataRecord>(): ColumnConfig<TData>[] => {
    return state.visibleColumnKeys
      .map(key => columnMap.get(key))
      .filter((col): col is ColumnConfig<T> => col !== undefined)
      .map(col => {
        const colState = state.columns[col.key];
        if (colState?.width) {
          return { ...col, width: colState.width } as ColumnConfig<TData>;
        }
        return col as unknown as ColumnConfig<TData>;
      });
  }, [state.visibleColumnKeys, state.columns, columnMap]);

  const save = useCallback(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save column config to storage:', e);
      }
    }
  }, [storageKey, state]);

  const load = useCallback(() => {
    setState(getInitialState());
  }, [getInitialState]);

  // ==========================================================================
  // RETURN
  // ==========================================================================

  const actions: ColumnConfigActions = {
    toggleColumn,
    setColumnVisible,
    setColumnWidth,
    reorderColumns,
    moveColumn,
    reset,
    getVisibleColumns,
    setSort,
    toggleSort,
    save,
    load,
  };

  return { state, actions };
}

export default useColumnConfig;
