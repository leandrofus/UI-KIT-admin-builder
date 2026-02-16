import { filterBySearchTerm, sortData, paginateData, calculatePagination, evaluateConditions, getNestedValue, validateField, validateForm, setNestedValue, getRowKey } from './chunk-MWNP5OJS.mjs';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';

function usePaginatedData(options = {}) {
  const {
    initialData = [],
    totalItems,
    pagination = {},
    defaultSortColumn = null,
    defaultSortDirection = null,
    searchableColumns = [],
    fetcher,
    onParamsChange,
    fetchOnMount = true
  } = options;
  const defaultPageSize = pagination.pageSize ?? 10;
  const [rawData, setRawData] = useState(initialData);
  const [serverTotal, setServerTotal] = useState(totalItems);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const isServerSide = !!fetcher || serverTotal !== void 0;
  const processedData = useMemo(() => {
    if (isServerSide) {
      return rawData;
    }
    let result = [...rawData];
    if (searchTerm && searchableColumns.length > 0) {
      result = filterBySearchTerm(result, searchTerm, searchableColumns);
    }
    if (sortColumn && sortDirection) {
      result = sortData(result, sortColumn, sortDirection);
    }
    return result;
  }, [rawData, searchTerm, searchableColumns, sortColumn, sortDirection, isServerSide]);
  const total = isServerSide ? serverTotal ?? 0 : processedData.length;
  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return rawData;
    }
    return paginateData(processedData, page, pageSize);
  }, [processedData, page, pageSize, isServerSide, rawData]);
  const paginationMeta = useMemo(
    () => calculatePagination(total, page, pageSize),
    [total, page, pageSize]
  );
  useEffect(() => {
    if (!fetcher || !fetchOnMount && refreshCounter === 0) {
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          pageSize,
          sortColumn: sortColumn ?? void 0,
          sortDirection
        };
        const response = await fetcher(params);
        setRawData(response.data);
        setServerTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetcher, page, pageSize, sortColumn, sortDirection, refreshCounter, fetchOnMount]);
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange({
        page,
        pageSize,
        sortColumn: sortColumn ?? void 0,
        sortDirection
      });
    }
  }, [page, pageSize, sortColumn, sortDirection, onParamsChange]);
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [searchTerm, advancedFilters]);
  const goToPage = useCallback((newPage) => {
    const maxPage = Math.ceil(total / pageSize) || 1;
    setPage(Math.max(1, Math.min(newPage, maxPage)));
  }, [total, pageSize]);
  const nextPage = useCallback(() => {
    if (paginationMeta.hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [paginationMeta.hasNextPage]);
  const previousPage = useCallback(() => {
    if (paginationMeta.hasPreviousPage) {
      setPage((p) => p - 1);
    }
  }, [paginationMeta.hasPreviousPage]);
  const handleSetPageSize = useCallback((size) => {
    setPageSize(size);
    setPage(1);
  }, []);
  const setSort = useCallback((column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);
  const toggleSort = useCallback((column) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortDirection("asc");
    }
  }, [sortColumn, sortDirection]);
  const handleSetSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  const handleSetAdvancedFilters = useCallback((filters) => {
    setAdvancedFilters(filters);
  }, []);
  const addFilter = useCallback((filter) => {
    setAdvancedFilters((prev) => [...prev, filter]);
  }, []);
  const removeFilter = useCallback((index) => {
    setAdvancedFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setAdvancedFilters([]);
  }, []);
  const refresh = useCallback(() => {
    setRefreshCounter((c) => c + 1);
  }, []);
  const handleSetData = useCallback((data, newTotal) => {
    setRawData(data);
    if (newTotal !== void 0) {
      setServerTotal(newTotal);
    }
  }, []);
  const handleSetLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);
  const handleSetError = useCallback((err) => {
    setError(err);
  }, []);
  const reset = useCallback(() => {
    setRawData(initialData);
    setServerTotal(totalItems);
    setPage(1);
    setPageSize(defaultPageSize);
    setSortColumn(defaultSortColumn);
    setSortDirection(defaultSortDirection);
    setSearchTerm("");
    setAdvancedFilters([]);
    setIsLoading(false);
    setError(null);
  }, [initialData, totalItems, defaultPageSize, defaultSortColumn, defaultSortDirection]);
  const state = {
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
    hasPreviousPage: paginationMeta.hasPreviousPage
  };
  const actions = {
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
    reset
  };
  return { state, actions };
}
function useFormState(options) {
  const {
    initialValues,
    fields: fieldsProp = [],
    sections = [],
    validationMode = "onBlur",
    onSubmit,
    onChange,
    onValidationError,
    validateOnMount = false
  } = options;
  const fields = useMemo(() => {
    if (fieldsProp.length > 0) return fieldsProp;
    return sections.flatMap((section) => section.fields);
  }, [fieldsProp, sections]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const initialValuesRef = useRef(initialValues);
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);
  const isFieldVisible = useCallback((field) => {
    if (!field.showWhen) return true;
    return evaluateConditions(field.showWhen, values);
  }, [values]);
  const getVisibleFields = useCallback((formSections) => {
    return formSections.filter((section) => {
      if (!section.showWhen) return true;
      return evaluateConditions(section.showWhen, values);
    }).flatMap((section) => section.fields.filter(isFieldVisible));
  }, [values, isFieldVisible]);
  const validateSingleField = useCallback((name) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;
    if (!isFieldVisible(field)) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
      return true;
    }
    const value = getNestedValue(values, name);
    const result = validateField(value, field, values);
    if (!result.valid && result.message) {
      setErrors((prev) => ({ ...prev, [name]: result.message }));
      return false;
    } else {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
      return true;
    }
  }, [fields, values, isFieldVisible]);
  const validateAllFields = useCallback(() => {
    const visibleFields = fields.filter(isFieldVisible);
    const result = validateForm(values, visibleFields);
    setErrors(result.errors);
    if (!result.valid && onValidationError) {
      onValidationError(result.errors);
    }
    return result.valid;
  }, [fields, values, isFieldVisible, onValidationError]);
  const setValue = useCallback((name, value) => {
    setValues((prev) => setNestedValue(prev, name, value));
    if (onChange) {
      const newValues = setNestedValue(values, name, value);
      onChange(name, value, newValues);
    }
    if (validationMode === "onChange" && touched[name]) {
      setTimeout(() => validateSingleField(name), 0);
    }
  }, [onChange, values, validationMode, touched, validateSingleField]);
  const setMultipleValues = useCallback((newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);
  const setAllFieldsTouched = useCallback(() => {
    const allTouched = {};
    fields.forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
  }, [fields]);
  const setFieldError = useCallback((name, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);
  const handleChange = useCallback((name, value) => {
    setValue(name, value);
  }, [setValue]);
  const handleBlur = useCallback((name) => {
    setFieldTouched(name, true);
    if (validationMode === "onBlur" || validationMode === "onChange") {
      validateSingleField(name);
    }
  }, [setFieldTouched, validationMode, validateSingleField]);
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    setSubmitCount((c) => c + 1);
    setAllFieldsTouched();
    const isFormValid = validateAllFields();
    if (!isFormValid) {
      return;
    }
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [setAllFieldsTouched, validateAllFields, onSubmit, values]);
  const reset = useCallback((newValues) => {
    const resetValues = newValues ? { ...initialValuesRef.current, ...newValues } : initialValuesRef.current;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    if (newValues) {
      initialValuesRef.current = resetValues;
    }
  }, []);
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: getNestedValue(values, name),
      error: touched[name] ? errors[name] : void 0,
      touched: touched[name] || false,
      onChange: (value) => handleChange(name, value),
      onBlur: () => handleBlur(name)
    };
  }, [values, errors, touched, handleChange, handleBlur]);
  const state = {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    submitCount
  };
  const actions = {
    setValue,
    setValues: setMultipleValues,
    setTouched: setFieldTouched,
    setAllTouched: setAllFieldsTouched,
    setError: setFieldError,
    clearErrors: clearAllErrors,
    validateField: validateSingleField,
    validateAll: validateAllFields,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    isFieldVisible,
    getVisibleFields
  };
  return { state, actions };
}
function useColumnConfig(options) {
  const {
    columns: initialColumns,
    storageKey,
    defaultSortColumn = null,
    defaultSortDirection = null,
    onConfigChange
  } = options;
  const getInitialState = useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Failed to load column config from storage:", e);
      }
    }
    const columnsState = {};
    initialColumns.forEach((col, index) => {
      columnsState[col.key] = {
        key: col.key,
        visible: col.visible !== false,
        width: col.width,
        order: index
      };
    });
    const visibleKeys = initialColumns.filter((col) => col.visible !== false).map((col) => col.key);
    return {
      columns: columnsState,
      visibleColumnKeys: visibleKeys,
      sortColumn: defaultSortColumn,
      sortDirection: defaultSortDirection
    };
  }, [initialColumns, storageKey, defaultSortColumn, defaultSortDirection]);
  const [state, setState] = useState(getInitialState);
  const columnMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    initialColumns.forEach((col) => map.set(col.key, col));
    return map;
  }, [initialColumns]);
  const updateState = useCallback((updater) => {
    setState((prev) => {
      const newState = updater(prev);
      if (onConfigChange) {
        onConfigChange(newState);
      }
      return newState;
    });
  }, [onConfigChange]);
  const toggleColumn = useCallback((key) => {
    updateState((prev) => {
      const column = prev.columns[key];
      if (!column) return prev;
      const newVisible = !column.visible;
      const newColumns = {
        ...prev.columns,
        [key]: { ...column, visible: newVisible }
      };
      const newVisibleKeys = newVisible ? [...prev.visibleColumnKeys, key].sort((a, b) => {
        return (prev.columns[a]?.order ?? 0) - (prev.columns[b]?.order ?? 0);
      }) : prev.visibleColumnKeys.filter((k) => k !== key);
      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: newVisibleKeys
      };
    });
  }, [updateState]);
  const setColumnVisible = useCallback((key, visible) => {
    updateState((prev) => {
      const column = prev.columns[key];
      if (!column || column.visible === visible) return prev;
      const newColumns = {
        ...prev.columns,
        [key]: { ...column, visible }
      };
      const newVisibleKeys = visible ? [...prev.visibleColumnKeys, key].sort((a, b) => {
        return (prev.columns[a]?.order ?? 0) - (prev.columns[b]?.order ?? 0);
      }) : prev.visibleColumnKeys.filter((k) => k !== key);
      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: newVisibleKeys
      };
    });
  }, [updateState]);
  const setColumnWidth = useCallback((key, width) => {
    updateState((prev) => {
      const column = prev.columns[key];
      if (!column) return prev;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [key]: { ...column, width }
        }
      };
    });
  }, [updateState]);
  const reorderColumns = useCallback((fromIndex, toIndex) => {
    updateState((prev) => {
      const keys = [...prev.visibleColumnKeys];
      const [removed] = keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, removed);
      const newColumns = { ...prev.columns };
      keys.forEach((key, index) => {
        if (newColumns[key]) {
          newColumns[key] = { ...newColumns[key], order: index };
        }
      });
      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: keys
      };
    });
  }, [updateState]);
  const moveColumn = useCallback((key, toIndex) => {
    updateState((prev) => {
      const fromIndex = prev.visibleColumnKeys.indexOf(key);
      if (fromIndex === -1) return prev;
      const keys = [...prev.visibleColumnKeys];
      keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, key);
      const newColumns = { ...prev.columns };
      keys.forEach((k, index) => {
        if (newColumns[k]) {
          newColumns[k] = { ...newColumns[k], order: index };
        }
      });
      return {
        ...prev,
        columns: newColumns,
        visibleColumnKeys: keys
      };
    });
  }, [updateState]);
  const setSort = useCallback((column, direction) => {
    updateState((prev) => ({
      ...prev,
      sortColumn: column,
      sortDirection: direction
    }));
  }, [updateState]);
  const toggleSort = useCallback((column) => {
    updateState((prev) => {
      if (prev.sortColumn !== column) {
        return { ...prev, sortColumn: column, sortDirection: "asc" };
      } else if (prev.sortDirection === "asc") {
        return { ...prev, sortDirection: "desc" };
      } else if (prev.sortDirection === "desc") {
        return { ...prev, sortColumn: null, sortDirection: null };
      } else {
        return { ...prev, sortDirection: "asc" };
      }
    });
  }, [updateState]);
  const reset = useCallback(() => {
    setState(getInitialState());
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [getInitialState, storageKey]);
  const getVisibleColumns = useCallback(() => {
    return state.visibleColumnKeys.map((key) => columnMap.get(key)).filter((col) => col !== void 0).map((col) => {
      const colState = state.columns[col.key];
      if (colState?.width) {
        return { ...col, width: colState.width };
      }
      return col;
    });
  }, [state.visibleColumnKeys, state.columns, columnMap]);
  const save = useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        console.warn("Failed to save column config to storage:", e);
      }
    }
  }, [storageKey, state]);
  const load = useCallback(() => {
    setState(getInitialState());
  }, [getInitialState]);
  const actions = {
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
    load
  };
  return { state, actions };
}
function useTableSelection(options = {}) {
  const {
    config = { mode: "none" },
    initialSelection = [],
    rowKey = "id",
    onSelectionChange
  } = options;
  const [selectedMap, setSelectedMap] = useState(() => {
    const map = /* @__PURE__ */ new Map();
    initialSelection.forEach((row) => {
      const key = getRowKey(row, rowKey);
      map.set(key, row);
    });
    return map;
  });
  const selectedKeys = useMemo(() => {
    return new Set(selectedMap.keys());
  }, [selectedMap]);
  const selectedRows = useMemo(() => {
    return Array.from(selectedMap.values());
  }, [selectedMap]);
  const getKey = useCallback((row) => {
    return getRowKey(row, rowKey);
  }, [rowKey]);
  const isSelectable = useCallback((row) => {
    if (config.mode === "none") return false;
    if (config.isSelectable) return config.isSelectable(row);
    return true;
  }, [config]);
  const notifyChange = useCallback((newMap) => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(newMap.values()));
    }
  }, [onSelectionChange]);
  const select = useCallback((row) => {
    if (!isSelectable(row)) return;
    setSelectedMap((prev) => {
      const key = getKey(row);
      if (config.mode === "single") {
        const newMap = /* @__PURE__ */ new Map();
        newMap.set(key, row);
        notifyChange(newMap);
        return newMap;
      } else {
        if (prev.has(key)) return prev;
        const newMap = new Map(prev);
        newMap.set(key, row);
        notifyChange(newMap);
        return newMap;
      }
    });
  }, [config.mode, getKey, isSelectable, notifyChange]);
  const deselect = useCallback((row) => {
    setSelectedMap((prev) => {
      const key = getKey(row);
      if (!prev.has(key)) return prev;
      const newMap = new Map(prev);
      newMap.delete(key);
      notifyChange(newMap);
      return newMap;
    });
  }, [getKey, notifyChange]);
  const toggle = useCallback((row) => {
    if (!isSelectable(row)) return;
    const key = getKey(row);
    if (selectedMap.has(key)) {
      deselect(row);
    } else {
      select(row);
    }
  }, [getKey, selectedMap, isSelectable, select, deselect]);
  const selectAll = useCallback((rows) => {
    if (config.mode !== "multiple") return;
    setSelectedMap((prev) => {
      const newMap = new Map(prev);
      rows.forEach((row) => {
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
    setSelectedMap((prev) => {
      if (prev.size === 0) return prev;
      const newMap = /* @__PURE__ */ new Map();
      notifyChange(newMap);
      return newMap;
    });
  }, [notifyChange]);
  const toggleAll = useCallback((rows) => {
    if (config.mode !== "multiple") return;
    const selectableRows = rows.filter(isSelectable);
    const allSelected = selectableRows.every((row) => selectedMap.has(getKey(row)));
    if (allSelected) {
      deselectAll();
    } else {
      selectAll(selectableRows);
    }
  }, [config.mode, isSelectable, selectedMap, getKey, selectAll, deselectAll]);
  const isSelected = useCallback((row) => {
    return selectedMap.has(getKey(row));
  }, [selectedMap, getKey]);
  const setSelection = useCallback((rows) => {
    const newMap = /* @__PURE__ */ new Map();
    rows.forEach((row) => {
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
  const createState = useCallback((visibleRows = []) => {
    const selectableRows = visibleRows.filter(isSelectable);
    const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selectedMap.has(getKey(row)));
    const someSelected = !allSelected && selectableRows.some((row) => selectedMap.has(getKey(row)));
    return {
      selectedKeys,
      selectedRows,
      allSelected,
      someSelected,
      selectedCount: selectedMap.size
    };
  }, [selectedKeys, selectedRows, selectedMap, getKey, isSelectable]);
  const state = createState();
  const actions = {
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
    isSelected,
    isSelectable,
    setSelection,
    clear
  };
  return { state, actions };
}

export { useColumnConfig, useFormState, usePaginatedData, useTableSelection };
//# sourceMappingURL=chunk-VDK6GOMH.mjs.map
//# sourceMappingURL=chunk-VDK6GOMH.mjs.map