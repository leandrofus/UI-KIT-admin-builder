/**
 * @fileoverview Hook for managing row selection in tables
 * 
 * Handles single and multiple row selection with keyboard support.
 * 
 * @module hooks/useTableSelection
 */

import { useState, useCallback, useMemo } from 'react';
import type { DataRecord, SelectionConfig } from '../core/types';
import { getRowKey } from '../core/utils';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Selection state
 */
export interface TableSelectionState<T = DataRecord> {
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
export interface TableSelectionActions<T = DataRecord> {
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
export interface UseTableSelectionOptions<T = DataRecord> {
  /** Selection configuration */
  config?: SelectionConfig<T>;
  /** Initial selected rows */
  initialSelection?: T[];
  /** Row key property */
  rowKey?: keyof T | string;
  /** Callback when selection changes */
  onSelectionChange?: (selectedRows: T[]) => void;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

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
export function useTableSelection<T extends DataRecord = DataRecord>(
  options: UseTableSelectionOptions<T> = {}
): { state: TableSelectionState<T>; actions: TableSelectionActions<T> } {
  const {
    config = { mode: 'none' },
    initialSelection = [],
    rowKey = 'id',
    onSelectionChange,
  } = options;

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [selectedMap, setSelectedMap] = useState<Map<string | number, T>>(() => {
    const map = new Map<string | number, T>();
    initialSelection.forEach(row => {
      const key = getRowKey(row, rowKey);
      map.set(key, row);
    });
    return map;
  });

  // ==========================================================================
  // COMPUTED
  // ==========================================================================

  const selectedKeys = useMemo(() => {
    return new Set(selectedMap.keys());
  }, [selectedMap]);

  const selectedRows = useMemo(() => {
    return Array.from(selectedMap.values());
  }, [selectedMap]);

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const getKey = useCallback((row: T): string | number => {
    return getRowKey(row, rowKey);
  }, [rowKey]);

  const isSelectable = useCallback((row: T): boolean => {
    if (config.mode === 'none') return false;
    if (config.isSelectable) return config.isSelectable(row);
    return true;
  }, [config]);

  const notifyChange = useCallback((newMap: Map<string | number, T>) => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(newMap.values()));
    }
  }, [onSelectionChange]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const select = useCallback((row: T) => {
    if (!isSelectable(row)) return;

    setSelectedMap(prev => {
      const key = getKey(row);
      
      if (config.mode === 'single') {
        // Single mode: replace selection
        const newMap = new Map<string | number, T>();
        newMap.set(key, row);
        notifyChange(newMap);
        return newMap;
      } else {
        // Multiple mode: add to selection
        if (prev.has(key)) return prev;
        const newMap = new Map(prev);
        newMap.set(key, row);
        notifyChange(newMap);
        return newMap;
      }
    });
  }, [config.mode, getKey, isSelectable, notifyChange]);

  const deselect = useCallback((row: T) => {
    setSelectedMap(prev => {
      const key = getKey(row);
      if (!prev.has(key)) return prev;
      const newMap = new Map(prev);
      newMap.delete(key);
      notifyChange(newMap);
      return newMap;
    });
  }, [getKey, notifyChange]);

  const toggle = useCallback((row: T) => {
    if (!isSelectable(row)) return;

    const key = getKey(row);
    if (selectedMap.has(key)) {
      deselect(row);
    } else {
      select(row);
    }
  }, [getKey, selectedMap, isSelectable, select, deselect]);

  const selectAll = useCallback((rows: T[]) => {
    if (config.mode !== 'multiple') return;

    setSelectedMap(prev => {
      const newMap = new Map(prev);
      rows.forEach(row => {
        if (isSelectable(row)) {
          const key = getKey(row);
          newMap.set(key, row);
        }
      });
      notifyChange(newMap);
      return newMap;
    });
  }, [config.mode, getKey, isSelectable, notifyChange]);

  const deselectAll = useCallback(() => {
    setSelectedMap(prev => {
      if (prev.size === 0) return prev;
      const newMap = new Map<string | number, T>();
      notifyChange(newMap);
      return newMap;
    });
  }, [notifyChange]);

  const toggleAll = useCallback((rows: T[]) => {
    if (config.mode !== 'multiple') return;

    const selectableRows = rows.filter(isSelectable);
    const allSelected = selectableRows.every(row => selectedMap.has(getKey(row)));

    if (allSelected) {
      deselectAll();
    } else {
      selectAll(selectableRows);
    }
  }, [config.mode, isSelectable, selectedMap, getKey, selectAll, deselectAll]);

  const isSelected = useCallback((row: T): boolean => {
    return selectedMap.has(getKey(row));
  }, [selectedMap, getKey]);

  const setSelection = useCallback((rows: T[]) => {
    const newMap = new Map<string | number, T>();
    rows.forEach(row => {
      if (isSelectable(row)) {
        const key = getKey(row);
        newMap.set(key, row);
      }
    });
    setSelectedMap(newMap);
    notifyChange(newMap);
  }, [getKey, isSelectable, notifyChange]);

  const clear = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  // ==========================================================================
  // STATE COMPUTATION
  // ==========================================================================

  const createState = useCallback((visibleRows: T[] = []): TableSelectionState<T> => {
    const selectableRows = visibleRows.filter(isSelectable);
    const allSelected = selectableRows.length > 0 && 
      selectableRows.every(row => selectedMap.has(getKey(row)));
    const someSelected = !allSelected && 
      selectableRows.some(row => selectedMap.has(getKey(row)));

    return {
      selectedKeys,
      selectedRows,
      allSelected,
      someSelected,
      selectedCount: selectedMap.size,
    };
  }, [selectedKeys, selectedRows, selectedMap, getKey, isSelectable]);

  // ==========================================================================
  // RETURN
  // ==========================================================================

  const state = createState();

  const actions: TableSelectionActions<T> = {
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
    isSelected,
    isSelectable,
    setSelection,
    clear,
  };

  return { state, actions };
}

export default useTableSelection;
