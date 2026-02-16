'use strict';

var chunkBHNUSCJS_js = require('./chunk-BHNUSCJS.js');
var chunkGUG6HX7G_js = require('./chunk-GUG6HX7G.js');
var React3 = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React3__default = /*#__PURE__*/_interopDefault(React3);

var Icons = {
  search: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5Z" }) }),
  refresh: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992M2.763 9.348c.547-4.055 4.29-7.298 8.888-7.298 4.694 0 8.502 3.362 8.996 7.748h4.992v-.001M2.723 13.467c.12.95.904 1.676 1.9 1.676h15.692c.996 0 1.78-.726 1.9-1.676m-17.492 0a2.25 2.25 0 0 0-1.853-2.965 2.25 2.25 0 0 0-2.236 2.965m19.5 0a2.25 2.25 0 0 0 1.853-2.965 2.25 2.25 0 0 0 2.236 2.965" }) }),
  plus: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }),
  trash: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L19.18 2.318c.169-.897-.134-1.638-1.034-1.638h-5.096c-.9 0-1.203.74-1.034 1.638L9.26 9M4.25 9L4.596 18c.305 1.619 1.045 2.5 2.589 2.5h6.63c1.544 0 2.284-.881 2.589-2.5l.346-9m-4.215 0h3.02m-9.755 0c.342.052.682.107 1.022.166" }) }),
  advancedSearch: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM21 21l-5.197-5.197" }) })
};
function TableToolbar(props) {
  const t2 = chunkGUG6HX7G_js.t;
  const {
    showSearch = false,
    searchPlaceholder,
    searchValue = "",
    onSearch,
    showRefresh = false,
    onRefresh,
    refreshLoading = false,
    showCreate = false,
    createLabel,
    onCreate,
    showAdvancedSearch = false,
    onAdvancedSearch,
    selectedCount = 0,
    onClearSelection,
    onDeleteSelected,
    deleteLabel,
    height = "56px",
    className,
    columns,
    renderCustomContent,
    disabled = false,
    bordered = true
  } = props;
  const [localSearch, setLocalSearch] = React3.useState(searchValue);
  const handleSearchChange = React3.useCallback((value) => {
    setLocalSearch(value);
    onSearch?.(value);
  }, [onSearch]);
  const hasTools = showSearch || showRefresh || showCreate || showAdvancedSearch;
  if (!hasTools && selectedCount === 0 && !renderCustomContent) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: chunkBHNUSCJS_js.cn(
        "dui-table-toolbar",
        bordered && "dui-table-toolbar-bordered",
        disabled && "dui-table-toolbar-disabled",
        className
      ),
      children: selectedCount > 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-toolbar-selection-badge", children: t2("table.selected", { count: selectedCount }) }),
        onDeleteSelected && /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: onDeleteSelected,
            disabled,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-danger",
            children: [
              Icons.trash,
              deleteLabel || t2("table.delete")
            ]
          }
        ),
        onExport && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: onExport,
            disabled,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
            children: t2("export")
          }
        ),
        onClearSelection && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: onClearSelection,
            disabled,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
            children: t2("table.clearSelection")
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        showSearch && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-toolbar-search", children: [
          Icons.search,
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: localSearch,
              onChange: (e) => handleSearchChange(e.target.value),
              placeholder: searchPlaceholder || t2("table.search", { default: "Buscar..." }),
              disabled,
              className: "dui-table-toolbar-input"
            }
          )
        ] }),
        showAdvancedSearch && onAdvancedSearch && /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: onAdvancedSearch,
            disabled,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
            title: t2("table.advancedSearch", { default: "B\xFAsqueda avanzada" }),
            children: [
              Icons.advancedSearch,
              t2("table.advancedSearch", { default: "Avanzada" })
            ]
          }
        ),
        (showRefresh || showCreate || showAdvancedSearch || showSearch) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-toolbar-spacer" }),
        showRefresh && onRefresh && /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: onRefresh,
            disabled: disabled || refreshLoading,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
            title: t2("table.refresh", { default: "Refrescar" }),
            children: [
              Icons.refresh,
              t2("table.refresh", { default: "Refrescar" })
            ]
          }
        ),
        showCreate && onCreate && /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: onCreate,
            disabled,
            className: "dui-table-toolbar-btn dui-table-toolbar-btn-primary",
            children: [
              Icons.plus,
              createLabel || t2("table.create", { default: "Crear" })
            ]
          }
        ),
        renderCustomContent && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-toolbar-custom", children: renderCustomContent() })
      ] })
    }
  );
}
function DefaultEmptyState() {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-empty", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "svg",
      {
        className: "dui-table-empty-icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        width: "48",
        height: "48",
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-empty-text", children: t2("table.empty") })
  ] });
}
function DefaultLoadingState() {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-loading", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-loading-spinner" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-loading-text", children: t2("table.loading") })
  ] });
}
function DefaultErrorState({ error }) {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-error", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "svg",
      {
        className: "dui-table-error-icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        width: "48",
        height: "48",
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-error-text", children: t2("table.error") }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-error-detail", children: error })
  ] });
}
function SortIndicator({ direction }) {
  if (!direction) {
    return /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "dui-table-sort-icon dui-table-sort-inactive", viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M7 10l5-5 5 5H7z M7 14l5 5 5-5H7z" }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className: chunkBHNUSCJS_js.cn("dui-table-sort-icon", direction === "desc" && "dui-table-sort-desc"),
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      fill: "currentColor",
      children: direction === "asc" ? /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M7 14l5-5 5 5H7z" }) : /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M7 10l5 5 5-5H7z" })
    }
  );
}
function Checkbox({
  checked,
  indeterminate,
  onChange,
  disabled
}) {
  const ref = React3__default.default.useRef(null);
  React3.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      ref,
      type: "checkbox",
      className: "dui-table-checkbox",
      checked,
      disabled,
      onChange: (e) => onChange(e.target.checked)
    }
  );
}
function getCellValue(row, column) {
  const accessor = column.accessor || column.key;
  if (typeof accessor === "string" && accessor.includes(".")) {
    return accessor.split(".").reduce((obj, key) => {
      if (obj && typeof obj === "object") {
        return obj[key];
      }
      return void 0;
    }, row);
  }
  return row[accessor];
}
function formatCellValue(value, column, row, emptyValuePlaceholder) {
  if (value === null || value === void 0) {
    return emptyValuePlaceholder;
  }
  if (column.render) {
    return column.render(value, row, 0);
  }
  if (column.format) {
    return column.format(value, row);
  }
  switch (column.type) {
    case "number":
    case "currency":
    case "percent": {
      const num = typeof value === "number" ? value : parseFloat(String(value));
      if (isNaN(num)) return String(value);
      const localeToUse = column.locale || "es-AR";
      if (column.type === "currency") {
        const currencyCode = column.currency || "USD";
        return new Intl.NumberFormat(localeToUse, {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: 2
        }).format(num);
      }
      if (column.type === "percent") {
        return new Intl.NumberFormat(localeToUse, {
          style: "percent",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(num / 100);
      }
      return new Intl.NumberFormat(localeToUse).format(num);
    }
    case "date":
    case "datetime": {
      const date = value instanceof Date ? value : new Date(String(value));
      if (isNaN(date.getTime())) return String(value);
      const localeToUse = column.locale || "es-AR";
      return new Intl.DateTimeFormat(localeToUse, {
        dateStyle: "medium",
        timeStyle: column.type === "datetime" ? "short" : void 0
      }).format(date);
    }
    case "boolean":
      return value ? "\u2713" : "\u2717";
    case "badge":
    case "status":
      return /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkBHNUSCJS_js.cn("dui-table-badge", `dui-table-badge-${String(value).toLowerCase()}`), children: String(value) });
    case "link":
      return /* @__PURE__ */ jsxRuntime.jsx(
        "a",
        {
          href: String(value),
          className: "dui-table-link",
          target: "_blank",
          rel: "noopener noreferrer",
          children: String(value)
        }
      );
    default:
      return String(value);
  }
}
function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange
}) {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  const pageNumbers = React3.useMemo(() => {
    const pages = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-pagination-info", children: t2(
      "table.pagination.showing",
      { start: startRecord, end: endRecord, total: totalCount },
      `Showing ${startRecord} to ${endRecord} of ${totalCount} entries`
    ) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination-controls", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination-pagesize", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("label", { children: [
          t2("table.pagination.pageSize", {}, "Page size"),
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "select",
          {
            value: pageSize,
            onChange: (e) => onPageSizeChange(Number(e.target.value)),
            className: "dui-table-pagination-select",
            children: pageSizeOptions.map((size) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: size, children: size }, size))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: "dui-table-pagination-nav", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(1),
            disabled: currentPage === 1,
            "aria-label": t2("table.pagination.first"),
            children: "\xAB"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(currentPage - 1),
            disabled: currentPage === 1,
            "aria-label": t2("table.pagination.previous"),
            children: "\u2039"
          }
        ),
        pageNumbers.map((page, index) => page === "ellipsis" ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-pagination-ellipsis", children: "\u2026" }, `ellipsis-${index}`) : /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: chunkBHNUSCJS_js.cn(
              "dui-table-pagination-btn",
              page === currentPage && "dui-table-pagination-btn-active"
            ),
            onClick: () => onPageChange(page),
            children: page
          },
          page
        )),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            "aria-label": t2("table.pagination.next"),
            children: "\u203A"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(totalPages),
            disabled: currentPage === totalPages,
            "aria-label": t2("table.pagination.last"),
            children: "\xBB"
          }
        )
      ] })
    ] })
  ] });
}
function useSimpleSelection(data, rowKeyProp, mode, initialSelection) {
  const [selected, setSelected] = React3.useState(
    () => new Set(initialSelection || [])
  );
  const getKey = React3.useCallback((row) => {
    if (typeof rowKeyProp === "function") {
      return rowKeyProp(row);
    }
    return row[rowKeyProp];
  }, [rowKeyProp]);
  const isSelected = React3.useCallback((key) => {
    return selected.has(key);
  }, [selected]);
  const toggle = React3.useCallback((key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (mode === "single") {
        if (prev.has(key)) {
          next.clear();
        } else {
          next.clear();
          next.add(key);
        }
      } else {
        if (prev.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
      }
      return next;
    });
  }, [mode]);
  const toggleAll = React3.useCallback(() => {
    setSelected((prev) => {
      if (prev.size === data.length) {
        return /* @__PURE__ */ new Set();
      }
      return new Set(data.map(getKey));
    });
  }, [data, getKey]);
  const clear = React3.useCallback(() => {
    setSelected(/* @__PURE__ */ new Set());
  }, []);
  const selectedIds = React3.useMemo(() => Array.from(selected), [selected]);
  const isAllSelected = data.length > 0 && selected.size === data.length;
  const isSomeSelected = selected.size > 0 && selected.size < data.length;
  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggle,
    toggleAll,
    clear
  };
}
function TableRendererInner(props, ref) {
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
    rowKey = "id",
    className,
    style,
    renderEmpty = () => /* @__PURE__ */ jsxRuntime.jsx(DefaultEmptyState, {}),
    renderLoading = () => /* @__PURE__ */ jsxRuntime.jsx(DefaultLoadingState, {}),
    renderError = (err) => /* @__PURE__ */ jsxRuntime.jsx(DefaultErrorState, { error: err }),
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
    selectionMode = "multiple",
    showRowNumbers = false,
    emptyValue = "\u2014",
    theme = "system",
    preventLayoutShift = true,
    // Toolbar props
    showToolbar = false,
    showToolbarSearch = false,
    toolbarSearchPlaceholder,
    toolbarSearchValue = "",
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
    renderToolbarCustomContent,
    toolbarDisabled = false
  } = props;
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  const [internalPage, setInternalPage] = React3.useState(1);
  const [internalPageSize, setInternalPageSize] = React3.useState(
    config.pagination?.pageSize ?? 10
  );
  const [sortState, setSortState] = React3.useState(null);
  const [filters, setFilters] = React3.useState({});
  const isPageControlled = externalPage !== void 0;
  const currentPage = isPageControlled ? externalPage : internalPage;
  const currentPageSize = externalPageSize ?? internalPageSize;
  const totalCount = externalTotalCount ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / currentPageSize));
  const visibleColumns = React3.useMemo(() => {
    return config.columns.filter((col) => col.visible !== false);
  }, [config.columns]);
  const getKey = React3.useCallback((row) => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey];
  }, [rowKey]);
  const selection = useSimpleSelection(
    data,
    rowKey,
    selectionMode,
    externalSelectedIds
  );
  React3.useEffect(() => {
    if (onSelectionChange && selectable) {
      onSelectionChange(selection.selectedIds);
    }
  }, [selection.selectedIds, onSelectionChange, selectable]);
  const handlePageChange = React3.useCallback((newPage) => {
    if (isPageControlled && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  }, [isPageControlled, onPageChange]);
  const handlePageSizeChange = React3.useCallback((newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    setInternalPageSize(newPageSize);
    handlePageChange(1);
  }, [onPageSizeChange, handlePageChange]);
  const handleSortChange = React3.useCallback((column) => {
    if (!column.sortable) return;
    const newSort = sortState?.key === column.key ? sortState.direction === "asc" ? { key: column.key, direction: "desc" } : sortState.direction === "desc" ? null : { key: column.key, direction: "asc" } : { key: column.key, direction: "asc" };
    setSortState(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  }, [sortState, onSortChange]);
  const clearFilters = React3.useCallback(() => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);
  const resetPage = React3.useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);
  React3.useImperativeHandle(ref, () => ({
    clearFilters,
    clearSelection: selection.clear,
    resetPage,
    getFilters: () => filters,
    getSelectedIds: () => selection.selectedIds
  }), [clearFilters, selection.clear, resetPage, filters, selection.selectedIds]);
  const displayData = React3.useMemo(() => {
    if (isPageControlled) {
      return data;
    }
    const start = (currentPage - 1) * currentPageSize;
    return data.slice(start, start + currentPageSize);
  }, [data, isPageControlled, currentPage, currentPageSize]);
  const effectiveTheme = (() => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const bs = document.documentElement.getAttribute("data-bs-theme");
      if (bs === "dark" || bs === "light") return bs;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  })();
  if (loading && data.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkBHNUSCJS_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style, children: renderLoading() });
  }
  if (error && data.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkBHNUSCJS_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style, children: renderError(error) });
  }
  const tableClasses = chunkBHNUSCJS_js.cn(
    "dui-table",
    striped && "dui-table-striped",
    hoverable && "dui-table-hoverable",
    bordered && "dui-table-bordered",
    compact && "dui-table-compact",
    stickyHeader && "dui-table-sticky-header"
  );
  const containerStyle = {
    ...style,
    ...maxHeight ? { maxHeight, overflowY: "auto" } : {}
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style: containerStyle, children: [
    showToolbar && /* @__PURE__ */ jsxRuntime.jsx(
      TableToolbar,
      {
        showSearch: showToolbarSearch,
        searchPlaceholder: toolbarSearchPlaceholder,
        searchValue: toolbarSearchValue,
        onSearch: onToolbarSearch,
        showRefresh: showToolbarRefresh,
        onRefresh: onToolbarRefresh,
        showCreate: showToolbarCreate,
        createLabel: typeof toolbarCreateLabel !== "undefined" ? toolbarCreateLabel : config && config.toolbarCreateLabel,
        onCreate: onToolbarCreate,
        showAdvancedSearch: showToolbarAdvancedSearch,
        onAdvancedSearch: onToolbarAdvancedSearch,
        selectedCount: selection.selectedIds.length,
        onClearSelection: selection.clear,
        onDeleteSelected: onToolbarDeleteSelected,
        deleteLabel: toolbarDeleteLabel,
        renderCustomContent: renderToolbarCustomContent,
        disabled: toolbarDisabled,
        columns: config.columns
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-wrapper", style: preventLayoutShift ? { scrollbarGutter: "stable" } : {}, children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: tableClasses, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { className: "dui-table-head", children: renderHeader ? renderHeader(visibleColumns) : /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "dui-table-row dui-table-header-row", children: [
        selectable && selectionMode === "multiple" && /* @__PURE__ */ jsxRuntime.jsx("th", { className: "dui-table-th dui-table-th-checkbox", children: /* @__PURE__ */ jsxRuntime.jsx(
          Checkbox,
          {
            checked: selection.isAllSelected,
            indeterminate: selection.isSomeSelected && !selection.isAllSelected,
            onChange: () => selection.toggleAll()
          }
        ) }),
        selectable && selectionMode === "single" && /* @__PURE__ */ jsxRuntime.jsx("th", { className: "dui-table-th dui-table-th-radio" }),
        showRowNumbers && /* @__PURE__ */ jsxRuntime.jsx("th", { className: "dui-table-th dui-table-th-rownum", children: "#" }),
        visibleColumns.map((column) => /* @__PURE__ */ jsxRuntime.jsx(
          "th",
          {
            className: chunkBHNUSCJS_js.cn(
              "dui-table-th",
              column.sortable && "dui-table-th-sortable",
              column.align && `dui-table-th-${column.align}`
            ),
            style: {
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth
            },
            onClick: () => column.sortable && handleSortChange(column),
            children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-th-content", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-th-text", children: typeof column.header === "string" ? chunkGUG6HX7G_js.resolveLabel(column.header) : column.header }),
              column.sortable && /* @__PURE__ */ jsxRuntime.jsx(
                SortIndicator,
                {
                  direction: sortState?.key === column.key ? sortState.direction : null
                }
              )
            ] })
          },
          column.key
        )),
        renderActions && /* @__PURE__ */ jsxRuntime.jsx("th", { className: "dui-table-th dui-table-th-actions", children: t2("table.actions") })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { className: "dui-table-body", children: displayData.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx(
        "td",
        {
          colSpan: visibleColumns.length + (selectable ? 1 : 0) + (showRowNumbers ? 1 : 0) + (renderActions ? 1 : 0),
          className: "dui-table-td-empty",
          children: renderEmpty()
        }
      ) }) : displayData.map((row, index) => {
        const key = getKey(row);
        const rowIndex = (currentPage - 1) * currentPageSize + index;
        const isRowSelected = selectable && selection.isSelected(key);
        if (renderRow) {
          return renderRow(row, rowIndex, visibleColumns);
        }
        return /* @__PURE__ */ jsxRuntime.jsxs(
          "tr",
          {
            className: chunkBHNUSCJS_js.cn(
              "dui-table-row",
              isRowSelected && "dui-table-row-selected",
              onRowClick && "dui-table-row-clickable"
            ),
            onClick: () => onRowClick?.(row, rowIndex),
            onDoubleClick: () => onRowDoubleClick?.(row, rowIndex),
            children: [
              selectable && selectionMode === "multiple" && /* @__PURE__ */ jsxRuntime.jsx(
                "td",
                {
                  className: "dui-table-td dui-table-td-checkbox",
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsxRuntime.jsx(
                    Checkbox,
                    {
                      checked: isRowSelected,
                      onChange: () => selection.toggle(key)
                    }
                  )
                }
              ),
              selectable && selectionMode === "single" && /* @__PURE__ */ jsxRuntime.jsx(
                "td",
                {
                  className: "dui-table-td dui-table-td-radio",
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsxRuntime.jsx(
                    "input",
                    {
                      type: "radio",
                      className: "dui-table-radio",
                      checked: isRowSelected,
                      onChange: () => selection.toggle(key)
                    }
                  )
                }
              ),
              showRowNumbers && /* @__PURE__ */ jsxRuntime.jsx("td", { className: "dui-table-td dui-table-td-rownum", children: rowIndex + 1 }),
              visibleColumns.map((column) => {
                const value = getCellValue(row, column);
                const formattedValue = formatCellValue(
                  value,
                  column,
                  row,
                  emptyValue
                );
                return /* @__PURE__ */ jsxRuntime.jsx(
                  "td",
                  {
                    className: chunkBHNUSCJS_js.cn(
                      "dui-table-td",
                      column.align && `dui-table-td-${column.align}`
                    ),
                    style: {
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth
                    },
                    children: formattedValue
                  },
                  column.key
                );
              }),
              renderActions && /* @__PURE__ */ jsxRuntime.jsx(
                "td",
                {
                  className: "dui-table-td dui-table-td-actions",
                  onClick: (e) => e.stopPropagation(),
                  children: renderActions(row, rowIndex)
                }
              )
            ]
          },
          key
        );
      }) })
    ] }) }),
    loading && data.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-loading-overlay", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-loading-spinner" }) }),
    config.pagination?.enabled !== false && totalPages > 0 && /* @__PURE__ */ jsxRuntime.jsx(
      Pagination,
      {
        currentPage,
        totalPages,
        pageSize: currentPageSize,
        totalCount,
        pageSizeOptions,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange
      }
    )
  ] });
}
var TableRenderer = React3.forwardRef(TableRendererInner);
TableRenderer.displayName = "TableRenderer";
function DefaultFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  readOnly,
  onChange,
  onBlur
}) {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  const inputId = `field-${field.name}`;
  const hasError = touched && !!error;
  const getInputType = () => {
    switch (field.type) {
      case "email":
        return "email";
      case "password":
        return "password";
      case "number":
      case "currency":
      case "percent":
        return "number";
      case "date":
        return "date";
      case "datetime":
        return "datetime-local";
      case "time":
        return "time";
      case "url":
        return "url";
      case "phone":
        return "tel";
      case "color":
        return "color";
      case "range":
        return "range";
      case "hidden":
        return "hidden";
      default:
        return "text";
    }
  };
  if (field.type === "select" || field.type === "multiselect") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
        chunkGUG6HX7G_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "select",
        {
          id: inputId,
          name: field.name,
          value: value || "",
          onChange: (e) => onChange(e.target.value),
          onBlur,
          disabled: disabled || field.disabled,
          className: "dui-field__select",
          multiple: field.type === "multiselect",
          children: [
            !field.required && /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: chunkGUG6HX7G_js.resolveLabel("select_placeholder", "Select...") }),
            field.options?.map((option) => /* @__PURE__ */ jsxRuntime.jsx(
              "option",
              {
                value: String(option.value),
                disabled: option.disabled,
                children: chunkGUG6HX7G_js.resolveLabel(String(option.label))
              },
              String(option.value)
            ))
          ]
        }
      ),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: field.helpText }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  if (field.type === "checkbox" || field.type === "switch") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-field dui-field--checkbox", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "dui-field__checkbox-label", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "checkbox",
            id: inputId,
            name: field.name,
            checked: Boolean(value),
            onChange: (e) => onChange(e.target.checked),
            onBlur,
            disabled: disabled || field.disabled,
            className: field.type === "switch" ? "dui-field__switch" : "dui-field__checkbox"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunkGUG6HX7G_js.resolveLabel(String(field.label)) }),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunkGUG6HX7G_js.resolveLabel(String(field.helpText)) }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  if (field.type === "textarea") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
        chunkGUG6HX7G_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "textarea",
        {
          id: inputId,
          name: field.name,
          value: value || "",
          onChange: (e) => onChange(e.target.value),
          onBlur,
          disabled: disabled || field.disabled,
          readOnly: readOnly || field.readOnly,
          placeholder: field.placeholder ? chunkGUG6HX7G_js.resolveLabel(String(field.placeholder)) : void 0,
          maxLength: field.maxLength,
          className: "dui-field__textarea",
          rows: 4
        }
      ),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunkGUG6HX7G_js.resolveLabel(String(field.helpText)) }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  if (field.type === "radio") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "dui-field__label", children: [
        chunkGUG6HX7G_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-field__radio-group", children: field.options?.map((option) => /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "dui-field__radio-label", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "radio",
            name: field.name,
            value: String(option.value),
            checked: value === option.value,
            onChange: (e) => onChange(e.target.value),
            onBlur,
            disabled: disabled || field.disabled || option.disabled,
            className: "dui-field__radio"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunkGUG6HX7G_js.resolveLabel(String(option.label)) })
      ] }, String(option.value))) }),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunkGUG6HX7G_js.resolveLabel(String(field.helpText)) }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  let displayValue = value;
  if ((field.type === "date" || field.type === "datetime" || field.type === "time") && value) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        switch (field.type) {
          case "date":
            displayValue = date.toISOString().split("T")[0];
            break;
          case "datetime":
            displayValue = date.toISOString().slice(0, 16);
            break;
          case "time":
            displayValue = date.toTimeString().slice(0, 5);
            break;
        }
      }
    } catch {
    }
  }
  const shouldFormat = typeof value === "number" && (readOnly || field.readOnly || !!field.computed) && field.format && typeof field.format.toFixed === "number";
  if (shouldFormat) {
    try {
      displayValue = value.toFixed(field.format.toFixed);
    } catch {
      displayValue = value;
    }
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkBHNUSCJS_js.cn("dui-field", hasError && "dui-field--error"), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
      chunkGUG6HX7G_js.resolveLabel(String(field.label)),
      field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        type: getInputType(),
        id: inputId,
        name: field.name,
        value: displayValue || "",
        onChange: (e) => {
          let newValue = e.target.value;
          if ((field.type === "date" || field.type === "datetime" || field.type === "time") && newValue) {
            try {
              if (field.type === "date") {
                newValue = (/* @__PURE__ */ new Date(newValue + "T00:00:00")).toISOString();
              } else if (field.type === "datetime") {
                newValue = new Date(newValue).toISOString();
              } else if (field.type === "time") {
                newValue = newValue;
              }
            } catch {
            }
          } else if (field.type === "number" || field.type === "currency" || field.type === "percent") {
            newValue = newValue === "" ? void 0 : parseFloat(newValue);
          }
          onChange(newValue);
        },
        onBlur,
        disabled: disabled || field.disabled,
        readOnly: readOnly || field.readOnly,
        placeholder: field.placeholder ? chunkGUG6HX7G_js.resolveLabel(String(field.placeholder)) : void 0,
        min: field.min,
        max: field.max,
        maxLength: field.maxLength,
        className: "dui-field__input"
      }
    ),
    field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunkGUG6HX7G_js.resolveLabel(String(field.helpText)) }),
    hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
  ] });
}
function DefaultSectionRenderer({
  section,
  isCollapsed,
  toggleCollapse,
  children
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-form-section", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: chunkBHNUSCJS_js.cn(
          "dui-form-section__header",
          section.collapsible && "dui-form-section__header--collapsible"
        ),
        onClick: section.collapsible ? toggleCollapse : void 0,
        children: [
          section.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-form-section__icon", children: section.icon }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-form-section__title-group", children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "dui-form-section__title", children: typeof section.title === "string" ? chunkGUG6HX7G_js.resolveLabel(section.title) : section.title }),
            section.description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-form-section__description", children: typeof section.description === "string" ? chunkGUG6HX7G_js.resolveLabel(section.description) : section.description })
          ] }),
          section.collapsible && /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkBHNUSCJS_js.cn(
            "dui-form-section__collapse-icon",
            isCollapsed && "dui-form-section__collapse-icon--collapsed"
          ), children: "\u25BC" })
        ]
      }
    ),
    !isCollapsed && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "dui-form-section__content",
        style: {
          display: "grid",
          gridTemplateColumns: `repeat(${section.columns || 1}, minmax(0, 1fr))`,
          gap: "1rem"
        },
        children
      }
    )
  ] });
}
function FormRendererInner(props, ref) {
  const {
    config,
    values: controlledValues,
    initialValues = {},
    errors: controlledErrors,
    onSubmit,
    onCancel,
    onChange,
    onBlur,
    onValidationError,
    loading = false,
    disabled = false,
    readOnly = false,
    renderField: customRenderField,
    renderSection: customRenderSection,
    className,
    hideButtons = false,
    footer,
    header
  } = props;
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  const [internalValues, setInternalValues] = React3.useState(initialValues);
  const [internalErrors, setInternalErrors] = React3.useState({});
  const [touched, setTouched] = React3.useState({});
  const [isSubmitting, setIsSubmitting] = React3.useState(false);
  const [collapsedSections, setCollapsedSections] = React3.useState(() => {
    const initial = /* @__PURE__ */ new Set();
    config.sections.forEach((section) => {
      if (section.defaultCollapsed) {
        initial.add(section.id);
      }
    });
    return initial;
  });
  const isControlled = controlledValues !== void 0;
  const values = isControlled ? controlledValues : internalValues;
  const errors = controlledErrors || internalErrors;
  const initialValuesRef = React3__default.default.useRef(initialValues);
  const isFieldVisible = React3.useCallback((field) => {
    if (field.type === "hidden") return false;
    if (!field.showWhen) return true;
    return chunkBHNUSCJS_js.evaluateConditions(field.showWhen, values);
  }, [values]);
  const isSectionVisible = React3.useCallback((section) => {
    if (!section.showWhen) return true;
    return chunkBHNUSCJS_js.evaluateConditions(section.showWhen, values);
  }, [values]);
  const getComputedValue = React3.useCallback((field) => {
    if (!field.computed || !field.computed.formula) {
      return chunkBHNUSCJS_js.getNestedValue(values, field.name);
    }
    const { formula, deps } = field.computed;
    const hasAllDeps = deps.every((dep) => {
      const depValue = chunkBHNUSCJS_js.getNestedValue(values, dep);
      return depValue !== void 0 && depValue !== null && depValue !== "";
    });
    if (!hasAllDeps) {
      return chunkBHNUSCJS_js.getNestedValue(values, field.name);
    }
    try {
      const context = {};
      for (const dep of deps) {
        const depValue = chunkBHNUSCJS_js.getNestedValue(values, dep);
        context[dep] = typeof depValue === "number" ? depValue : parseFloat(String(depValue)) || 0;
      }
      let expression = formula;
      for (const [key, value] of Object.entries(context)) {
        expression = expression.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
        expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), String(value));
      }
      const safeExpression = expression.replace(/[^0-9+\-*/().Math\s]/g, "");
      const fn = new Function(`return ${safeExpression}`);
      const result = fn();
      return typeof result === "number" && !isNaN(result) ? result : void 0;
    } catch {
      return chunkBHNUSCJS_js.getNestedValue(values, field.name);
    }
  }, [values]);
  const getVisibleFields = React3.useCallback(() => {
    return config.sections.filter(isSectionVisible).flatMap((section) => section.fields.filter(isFieldVisible));
  }, [config.sections, isSectionVisible, isFieldVisible]);
  const validateField2 = React3.useCallback((field) => {
    const value = field.computed ? getComputedValue(field) : chunkBHNUSCJS_js.getNestedValue(values, field.name);
    const result = chunkBHNUSCJS_js.validateField(value, field, values);
    return result.valid ? void 0 : result.message;
  }, [values, getComputedValue]);
  const validateAll = React3.useCallback(() => {
    const visibleFields = getVisibleFields();
    const newErrors = {};
    let isValid = true;
    for (const field of visibleFields) {
      const error = validateField2(field);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    }
    if (!isControlled) {
      setInternalErrors(newErrors);
    }
    if (!isValid && onValidationError) {
      onValidationError(newErrors);
    }
    return isValid;
  }, [getVisibleFields, validateField2, isControlled, onValidationError]);
  const setValue = React3.useCallback((name, value) => {
    const newValues = { ...values, [name]: value };
    if (!isControlled) {
      setInternalValues(newValues);
    }
    if (onChange) {
      onChange(name, value, newValues);
    }
  }, [values, isControlled, onChange]);
  const setValues = React3.useCallback((newValues) => {
    const merged = { ...values, ...newValues };
    if (!isControlled) {
      setInternalValues(merged);
    }
    if (onChange) {
      for (const [name, value] of Object.entries(newValues)) {
        onChange(name, value, merged);
      }
    }
  }, [values, isControlled, onChange]);
  const reset = React3.useCallback(() => {
    if (!isControlled) {
      setInternalValues(initialValuesRef.current);
      setInternalErrors({});
    }
    setTouched({});
  }, [isControlled]);
  const isDirty = React3.useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);
  const handleSubmit = React3.useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (loading || isSubmitting) return;
    const allTouched = {};
    getVisibleFields().forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
    const isValid = validateAll();
    if (!isValid) return;
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [loading, isSubmitting, getVisibleFields, validateAll, onSubmit, values]);
  const handleFieldChange = React3.useCallback((name, value) => {
    setValue(name, value);
    if (config.validationMode === "onChange") {
      const field = getVisibleFields().find((f) => f.name === name);
      if (field) {
        const error = validateField2(field);
        if (!isControlled) {
          setInternalErrors((prev) => ({
            ...prev,
            [name]: error
          }));
        }
      }
    }
  }, [setValue, config.validationMode, getVisibleFields, validateField2, isControlled]);
  const handleFieldBlur = React3.useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (onBlur) {
      onBlur(name);
    }
    if (config.validationMode === "onBlur" || !config.validationMode) {
      const field = getVisibleFields().find((f) => f.name === name);
      if (field) {
        const error = validateField2(field);
        if (!isControlled) {
          setInternalErrors((prev) => ({
            ...prev,
            [name]: error
          }));
        }
      }
    }
  }, [onBlur, config.validationMode, getVisibleFields, validateField2, isControlled]);
  const toggleSectionCollapse = React3.useCallback((sectionId) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);
  React3.useImperativeHandle(ref, () => ({
    getValues: () => values,
    setValues,
    setValue,
    validate: validateAll,
    reset,
    getErrors: () => errors,
    isDirty,
    submit: handleSubmit
  }), [values, setValues, setValue, validateAll, reset, errors, isDirty, handleSubmit]);
  const renderFieldElement = React3.useCallback((field) => {
    if (!isFieldVisible(field)) return null;
    const fieldValue = field.computed ? getComputedValue(field) : chunkBHNUSCJS_js.getNestedValue(values, field.name);
    const renderProps = {
      field,
      value: fieldValue,
      formData: values,
      error: errors[field.name],
      touched: !!touched[field.name],
      disabled: disabled || loading,
      readOnly: readOnly || !!field.computed,
      onChange: (value) => handleFieldChange(field.name, value),
      onBlur: () => handleFieldBlur(field.name)
    };
    if (customRenderField) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          style: { gridColumn: field.colSpan ? `span ${field.colSpan}` : void 0 },
          children: customRenderField(renderProps)
        },
        field.name
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        style: { gridColumn: field.colSpan ? `span ${field.colSpan}` : void 0 },
        children: /* @__PURE__ */ jsxRuntime.jsx(DefaultFieldRenderer, { ...renderProps })
      },
      field.name
    );
  }, [
    isFieldVisible,
    getComputedValue,
    values,
    errors,
    touched,
    disabled,
    loading,
    readOnly,
    handleFieldChange,
    handleFieldBlur,
    customRenderField
  ]);
  const renderSectionElement = React3.useCallback((section) => {
    if (!isSectionVisible(section)) return null;
    const isCollapsed = collapsedSections.has(section.id);
    const visibleFields = section.fields.filter(isFieldVisible);
    if (visibleFields.length === 0) return null;
    const children = visibleFields.map(renderFieldElement);
    const sectionProps = {
      section,
      isCollapsed,
      toggleCollapse: () => toggleSectionCollapse(section.id),
      children
    };
    if (customRenderSection) {
      return /* @__PURE__ */ jsxRuntime.jsx(React3__default.default.Fragment, { children: customRenderSection(sectionProps) }, section.id);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(DefaultSectionRenderer, { ...sectionProps }, section.id);
  }, [
    isSectionVisible,
    collapsedSections,
    isFieldVisible,
    renderFieldElement,
    toggleSectionCollapse,
    customRenderSection
  ]);
  const renderedSections = React3.useMemo(() => {
    return config.sections.map(renderSectionElement);
  }, [config.sections, renderSectionElement]);
  const submitLabel = config.submitLabel || t2("form.submit");
  const cancelLabel = config.cancelLabel || t2("form.cancel");
  const isFormDisabled = disabled || loading || isSubmitting;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: chunkBHNUSCJS_js.cn("dui-form", className),
      children: [
        (config.title || header) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-form__header", children: header || /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "dui-form__title", children: config.title }),
          config.description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-form__description", children: config.description })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-form__body", children: renderedSections }),
        (footer || !hideButtons && (onSubmit || onCancel || config.showCancel)) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-form__footer", children: footer || /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          (onCancel || config.showCancel) && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              disabled: isFormDisabled,
              className: "dui-form__button dui-form__button--cancel",
              children: cancelLabel
            }
          ),
          onSubmit && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "submit",
              disabled: isFormDisabled,
              className: "dui-form__button dui-form__button--submit",
              children: loading || isSubmitting ? t2("form.submitting") : submitLabel
            }
          )
        ] }) })
      ]
    }
  );
}
var FormRenderer = React3.forwardRef(FormRendererInner);
FormRenderer.displayName = "FormRenderer";
var SIZE_MAP = {
  sm: "dui-modal--sm",
  md: "dui-modal--md",
  lg: "dui-modal--lg",
  xl: "dui-modal--xl",
  full: "dui-modal--full"
};
function ConfirmDialog({ open, onConfirm, onCancel, config, loading }) {
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__confirm-overlay", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__confirm-dialog", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "dui-modal__confirm-title", children: typeof config.title === "string" ? t2(config.title) : config.title }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-modal__confirm-message", children: typeof config.message === "string" ? t2(config.message) : config.message }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__confirm-actions", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: loading,
          className: "dui-modal__button dui-modal__button--secondary",
          children: config.cancelLabel || t2("modal.cancel")
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onConfirm,
          disabled: loading,
          className: chunkBHNUSCJS_js.cn(
            "dui-modal__button",
            config.confirmVariant === "danger" ? "dui-modal__button--danger" : "dui-modal__button--primary"
          ),
          children: loading ? t2("modal.loading") : config.confirmLabel || t2("modal.confirm")
        }
      )
    ] })
  ] }) });
}
function DynamicModalInner(props, ref) {
  const {
    open,
    onClose,
    title,
    subtitle,
    size = "md",
    config,
    tabs,
    initialValues = {},
    onSubmit,
    onDelete,
    actions = [],
    loading = false,
    error,
    errors,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    header,
    footer,
    className,
    deleteConfirmation,
    showCloseButton = true,
    renderField,
    renderSection,
    theme = "system"
  } = props;
  const { t: t2 } = chunkGUG6HX7G_js.useI18n();
  const formRef = React3.useRef(null);
  const modalRef = React3.useRef(null);
  const [activeTab, setActiveTab] = React3.useState(tabs?.[0]?.id || "");
  const [internalValues, setInternalValues] = React3.useState(initialValues);
  const [isSubmitting, setIsSubmitting] = React3.useState(false);
  const [isDeleting, setIsDeleting] = React3.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React3.useState(false);
  React3.useEffect(() => {
    if (open) {
      setInternalValues(initialValues);
      setActiveTab(tabs?.[0]?.id || "");
      setShowDeleteConfirm(false);
    }
  }, [open, initialValues, tabs]);
  React3.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !showDeleteConfirm) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose, showDeleteConfirm]);
  React3.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  React3.useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleTab);
    firstElement?.focus();
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);
  const handleBackdropClick = React3.useCallback((e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && !showDeleteConfirm) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose, showDeleteConfirm]);
  const handleFormChange = React3.useCallback((name, value, values) => {
    setInternalValues(values);
  }, []);
  const handleSubmit = React3.useCallback(async () => {
    if (loading || isSubmitting) return;
    const isValid = formRef.current?.validate();
    if (!isValid) return;
    const values = formRef.current?.getValues() || internalValues;
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [loading, isSubmitting, internalValues, onSubmit]);
  const handleDelete = React3.useCallback(async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete]);
  const handleDeleteClick = React3.useCallback(() => {
    if (deleteConfirmation) {
      setShowDeleteConfirm(true);
    } else if (onDelete) {
      handleDelete();
    }
  }, [deleteConfirmation, onDelete, handleDelete]);
  React3.useImperativeHandle(ref, () => ({
    getValues: () => formRef.current?.getValues() || internalValues,
    setValues: (values) => {
      formRef.current?.setValues(values);
      setInternalValues((prev) => ({ ...prev, ...values }));
    },
    validate: () => formRef.current?.validate() || true,
    reset: () => {
      formRef.current?.reset();
      setInternalValues(initialValues);
    },
    close: onClose,
    submit: handleSubmit
  }), [internalValues, initialValues, onClose, handleSubmit]);
  const currentTab = React3.useMemo(() => {
    return tabs?.find((tab) => tab.id === activeTab);
  }, [tabs, activeTab]);
  const currentFormConfig = React3.useMemo(() => {
    if (config) return config;
    return currentTab?.content;
  }, [config, currentTab]);
  const renderTabs = React3.useCallback(() => {
    if (!tabs || tabs.length === 0) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(tab.id),
        disabled: tab.disabled,
        className: chunkBHNUSCJS_js.cn(
          "dui-modal__tab",
          activeTab === tab.id && "dui-modal__tab--active",
          tab.disabled && "dui-modal__tab--disabled"
        ),
        children: [
          tab.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__tab-icon", children: tab.icon }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__tab-label", children: tab.label }),
          tab.badge !== void 0 && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__tab-badge", children: tab.badge })
        ]
      },
      tab.id
    )) });
  }, [tabs, activeTab]);
  const renderContent = React3.useCallback(() => {
    if (currentTab?.render) {
      return currentTab.render(internalValues);
    }
    if (currentFormConfig) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        FormRenderer,
        {
          ref: formRef,
          config: currentFormConfig,
          values: internalValues,
          errors,
          onChange: handleFormChange,
          loading: loading || isSubmitting,
          renderField,
          renderSection,
          hideButtons: true
        }
      );
    }
    return null;
  }, [
    currentTab,
    currentFormConfig,
    internalValues,
    errors,
    handleFormChange,
    loading,
    isSubmitting,
    renderField,
    renderSection
  ]);
  const renderActions = React3.useCallback(() => {
    if (footer) return footer;
    const leftActions = actions.filter((a) => a.position === "left");
    const rightActions = actions.filter((a) => a.position !== "left");
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__footer", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__footer-left", children: [
        onDelete && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: handleDeleteClick,
            disabled: loading || isSubmitting || isDeleting,
            className: "dui-modal__button dui-modal__button--danger",
            children: isDeleting ? t2("modal.deleting") : t2("modal.delete")
          }
        ),
        leftActions.map((action) => /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: action.onClick,
            disabled: action.disabled || action.loading,
            className: chunkBHNUSCJS_js.cn(
              "dui-modal__button",
              `dui-modal__button--${action.variant || "secondary"}`
            ),
            children: [
              action.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__button-icon", children: action.icon }),
              action.loading ? t2("modal.loading") : action.label
            ]
          },
          action.id
        ))
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__footer-right", children: [
        rightActions.map((action) => /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: action.onClick,
            disabled: action.disabled || action.loading,
            className: chunkBHNUSCJS_js.cn(
              "dui-modal__button",
              `dui-modal__button--${action.variant || "secondary"}`
            ),
            children: [
              action.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__button-icon", children: action.icon }),
              action.loading ? t2("modal.loading") : action.label
            ]
          },
          action.id
        )),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            disabled: loading || isSubmitting,
            className: "dui-modal__button dui-modal__button--secondary",
            children: t2("modal.cancel")
          }
        ),
        onSubmit && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: handleSubmit,
            disabled: loading || isSubmitting,
            className: "dui-modal__button dui-modal__button--primary",
            children: loading || isSubmitting ? t2("modal.saving") : t2("modal.save")
          }
        )
      ] })
    ] });
  }, [
    footer,
    actions,
    onDelete,
    onSubmit,
    onClose,
    handleDeleteClick,
    handleSubmit,
    loading,
    isSubmitting,
    isDeleting,
    t2
  ]);
  if (!open) return null;
  const overlayClass = chunkBHNUSCJS_js.cn(
    "dui-modal__overlay",
    theme === "dark" ? "dui-theme--dark" : theme === "light" ? "dui-theme--light" : ""
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: overlayClass,
      onClick: handleBackdropClick,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: modalRef,
          className: chunkBHNUSCJS_js.cn(
            "dui-modal",
            SIZE_MAP[size],
            className
          ),
          onClick: (e) => e.stopPropagation(),
          children: [
            header || /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__header", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__header-content", children: [
                /* @__PURE__ */ jsxRuntime.jsx("h2", { id: "modal-title", className: "dui-modal__title", children: title }),
                subtitle && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-modal__subtitle", children: subtitle })
              ] }),
              showCloseButton && /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "dui-modal__close",
                  "aria-label": t2("modal.close"),
                  children: "\xD7"
                }
              )
            ] }),
            renderTabs(),
            error && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__error", children: error }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__body", children: renderContent() }),
            renderActions(),
            deleteConfirmation && /* @__PURE__ */ jsxRuntime.jsx(
              ConfirmDialog,
              {
                open: showDeleteConfirm,
                onConfirm: handleDelete,
                onCancel: () => setShowDeleteConfirm(false),
                config: deleteConfirmation,
                loading: isDeleting
              }
            )
          ]
        }
      )
    }
  );
}
var DynamicModal = React3.forwardRef(DynamicModalInner);
DynamicModal.displayName = "DynamicModal";

exports.DynamicModal = DynamicModal;
exports.FormRenderer = FormRenderer;
exports.TableRenderer = TableRenderer;
exports.TableToolbar = TableToolbar;
//# sourceMappingURL=chunk-MXJF2CTP.js.map
//# sourceMappingURL=chunk-MXJF2CTP.js.map