'use strict';

var chunkUSZU7PLJ_js = require('./chunk-USZU7PLJ.js');
var chunkG4EIC5OB_js = require('./chunk-G4EIC5OB.js');
var chunk4GBTIAHZ_js = require('./chunk-4GBTIAHZ.js');
var React2 = require('react');
var jsxRuntime = require('react/jsx-runtime');
var reactDom = require('react-dom');
var core = require('@dnd-kit/core');
var sortable = require('@dnd-kit/sortable');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React2__default = /*#__PURE__*/_interopDefault(React2);

var Icons = {
  search: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5Z" }) }),
  refresh: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992M2.763 9.348c.547-4.055 4.29-7.298 8.888-7.298 4.694 0 8.502 3.362 8.996 7.748h4.992v-.001M2.723 13.467c.12.95.904 1.676 1.9 1.676h15.692c.996 0 1.78-.726 1.9-1.676m-17.492 0a2.25 2.25 0 0 0-1.853-2.965 2.25 2.25 0 0 0-2.236 2.965m19.5 0a2.25 2.25 0 0 0 1.853-2.965 2.25 2.25 0 0 0 2.236 2.965" }) }),
  plus: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }),
  trash: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L19.18 2.318c.169-.897-.134-1.638-1.034-1.638h-5.096c-.9 0-1.203.74-1.034 1.638L9.26 9M4.25 9L4.596 18c.305 1.619 1.045 2.5 2.589 2.5h6.63c1.544 0 2.284-.881 2.589-2.5l.346-9m-4.215 0h3.02m-9.755 0c.342.052.682.107 1.022.166" }) }),
  advancedSearch: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM21 21l-5.197-5.197" }) }),
  toggle: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" }) }),
  table: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5a1.125 1.125 0 0 0 1.125 1.125m17.25 0a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125a1.125 1.125 0 0 1-1.125-1.125M3.375 11.25h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 11.25a1.125 1.125 0 0 0 1.125 1.125m17.25 0a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125a1.125 1.125 0 0 1-1.125-1.125M3.375 3h17.25m-17.25 0a1.125 1.125 0 0 1-1.125 1.125M3.375 3a1.125 1.125 0 0 0 1.125-1.125m17.25 0a1.125 1.125 0 0 0 1.125 1.125m-1.125-1.125a1.125 1.125 0 0 1-1.125 1.125" }) }),
  kanban: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 6.75v10.5m1.125-10.5h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125H7.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Zm5.625 0h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125h-1.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Zm5.625 0h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125h-1.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Z" }) })
};
function TableToolbar(props) {
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
    onToggleEnabled,
    deleteLabel,
    onExport,
    height = "56px",
    className,
    columns,
    renderCustomContent,
    onOpenColumns,
    showColumnsButton = false,
    columnsNeedsSync = false,
    showViewSwitcher = false,
    activeView = "table",
    onViewChange,
    disabled = false,
    bordered = true
  } = props;
  const [localSearch, setLocalSearch] = React2.useState(searchValue);
  const handleSearchChange = React2.useCallback((value) => {
    setLocalSearch(value);
    onSearch?.(value);
  }, [onSearch]);
  const hasTools = showSearch || showRefresh || showCreate || showAdvancedSearch || props.showColumnsButton || props.showExport && onExport;
  if (!hasTools && selectedCount === 0 && !renderCustomContent) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: chunkG4EIC5OB_js.cn(
        "dui-table-toolbar",
        bordered && "dui-table-toolbar-bordered",
        disabled && "dui-table-toolbar-disabled",
        className
      ),
      children: [
        showSearch && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-toolbar-search", children: [
          Icons.search,
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: localSearch,
              onChange: (e) => handleSearchChange(e.target.value),
              placeholder: searchPlaceholder || chunk4GBTIAHZ_js.t("table.search", { default: "Buscar..." }),
              disabled,
              className: "v2-input v2-input-with-icon"
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
            title: chunk4GBTIAHZ_js.t("table.advancedSearch", { default: "B\xFAsqueda avanzada" }),
            children: [
              Icons.advancedSearch,
              chunk4GBTIAHZ_js.t("table.advancedSearch", { default: "Avanzada" })
            ]
          }
        ),
        showViewSwitcher && onViewChange && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-view-switcher", style: { display: "flex", background: "var(--bg-tertiary)", padding: "2px", borderRadius: "8px", marginLeft: "0.5rem" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              onClick: () => onViewChange("table"),
              className: chunkG4EIC5OB_js.cn(
                "dui-table-toolbar-btn px-2 py-1 border-0",
                activeView === "table" ? "bg-white shadow-sm dark:bg-gray-700 dark:text-white" : "bg-transparent text-muted"
              ),
              style: { borderRadius: "6px", minWidth: "40px", display: "flex", alignItems: "center", justifyContent: "center" },
              title: chunk4GBTIAHZ_js.t("table.viewTable", { default: "Vista Tabla" }),
              children: Icons.table
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              onClick: () => onViewChange("kanban"),
              className: chunkG4EIC5OB_js.cn(
                "dui-table-toolbar-btn px-2 py-1 border-0",
                activeView === "kanban" ? "bg-white shadow-sm dark:bg-gray-700 dark:text-white" : "bg-transparent text-muted"
              ),
              style: { borderRadius: "6px", minWidth: "40px", display: "flex", alignItems: "center", justifyContent: "center" },
              title: chunk4GBTIAHZ_js.t("table.viewKanban", { default: "Vista Kanban" }),
              children: Icons.kanban
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-toolbar-spacer" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-toolbar-actions", style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
          selectedCount > 0 ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-toolbar-selection-badge", style: { marginRight: "0.5rem" }, children: chunk4GBTIAHZ_js.t("table.selected", { count: selectedCount }) }),
            onDeleteSelected && /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                type: "button",
                onClick: onDeleteSelected,
                disabled,
                className: "dui-table-toolbar-btn dui-table-toolbar-btn-danger",
                children: [
                  Icons.trash,
                  deleteLabel || chunk4GBTIAHZ_js.t("table.delete")
                ]
              }
            ),
            onToggleEnabled && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: onToggleEnabled,
                disabled,
                className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
                title: chunk4GBTIAHZ_js.t("table.toggleEnabled", { default: "Habilitar/Deshabilitar" }),
                children: Icons.toggle
              }
            ),
            onClearSelection && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                type: "button",
                onClick: onClearSelection,
                disabled,
                className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
                children: chunk4GBTIAHZ_js.t("table.clearSelection")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: 1, height: 24, background: "var(--border-color)", margin: "0 0.25rem" } })
          ] }) : (
            /* Normal Actions (Refresh, Create) */
            /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              showRefresh && onRefresh && /* @__PURE__ */ jsxRuntime.jsxs(
                "button",
                {
                  type: "button",
                  onClick: onRefresh,
                  disabled: disabled || refreshLoading,
                  className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
                  title: chunk4GBTIAHZ_js.t("table.refresh", { default: "Refrescar" }),
                  children: [
                    Icons.refresh,
                    chunk4GBTIAHZ_js.t("table.refresh", { default: "Refrescar" })
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
                    createLabel || chunk4GBTIAHZ_js.t("table.create", { default: "Crear" })
                  ]
                }
              )
            ] })
          ),
          props.showExport && onExport && /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              onClick: onExport,
              disabled,
              className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
              title: chunk4GBTIAHZ_js.t("export", { default: "Exportar" }),
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", style: { width: "1.2em", height: "1.2em" }, children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }) }),
                selectedCount > 0 ? "" : chunk4GBTIAHZ_js.t("export", { default: "Exportar" })
              ]
            }
          ),
          props.showColumnsButton && onOpenColumns && /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              onClick: onOpenColumns,
              disabled,
              className: "dui-table-toolbar-btn dui-table-toolbar-btn-secondary",
              title: chunk4GBTIAHZ_js.t("columns.title", { default: "Columnas" }),
              children: [
                chunk4GBTIAHZ_js.t("columns.title", { default: "Columnas" }),
                columnsNeedsSync && /* @__PURE__ */ jsxRuntime.jsx("span", { style: { display: "inline-block", width: 8, height: 8, background: "#ef4444", borderRadius: 8, marginLeft: 8 } })
              ]
            }
          ),
          renderCustomContent && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-toolbar-custom", children: renderCustomContent() })
        ] })
      ]
    }
  );
}
function DefaultEmptyState() {
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
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
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-empty-text", children: t6("table.empty") })
  ] });
}
function DefaultLoadingState() {
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-loading", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-loading-spinner" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-loading-text", children: t6("table.loading") })
  ] });
}
function DefaultErrorState({ error }) {
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
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
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-table-error-text", children: t6("table.error") }),
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
      className: chunkG4EIC5OB_js.cn("dui-table-sort-icon", direction === "desc" && "dui-table-sort-desc"),
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
  const ref = React2__default.default.useRef(null);
  React2.useEffect(() => {
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
var MIN_CHAR_DISPLAY = 6;
var CHAR_PX = 8;
var MIN_PX = MIN_CHAR_DISPLAY * CHAR_PX;
var parseWidthPx = (col) => {
  const w = col._computedWidth ?? col.width;
  if (w == null) return null;
  if (typeof w === "number") return w;
  const str = String(w).trim();
  const m = str.match(/^(\d+)/);
  if (m) return Number(m[1]);
  return null;
};
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
    case "status": {
      const namespace = column.translationNamespace || (column.type === "status" ? "status" : void 0);
      if (Array.isArray(value)) {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }, children: value.map((item, i) => {
          const display = item && typeof item === "object" ? item.label ?? item.name ?? String(item) : chunk4GBTIAHZ_js.resolveLabel(String(item), void 0, namespace);
          return /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkG4EIC5OB_js.cn("dui-table-badge"), children: display }, i);
        }) });
      }
      const variants = column.variants;
      if (variants && variants.length > 0) {
        const variant = variants.find(
          (v) => String(v.value).toLowerCase() === String(value).toLowerCase() || String(v.id).toLowerCase() === String(value).toLowerCase()
        );
        if (variant) {
          const display = chunk4GBTIAHZ_js.resolveLabel(variant.label || variant.name || String(variant.value), void 0, namespace);
          const colorValue = variant.color || "gray";
          const isHex = /^#|^rgb|^hsl/.test(colorValue);
          return /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: chunkG4EIC5OB_js.cn("dui-table-badge", !isHex && `dui-table-badge-${colorValue.toLowerCase()}`),
              style: isHex ? { backgroundColor: colorValue, color: "#fff", border: "none" } : void 0,
              children: display
            }
          );
        }
      }
      if (value && typeof value === "object") {
        const obj = value;
        const display = obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj);
        const color = obj.color;
        return /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: chunkG4EIC5OB_js.cn("dui-table-badge"),
            style: color ? { backgroundColor: color, color: "#fff" } : void 0,
            children: chunk4GBTIAHZ_js.resolveLabel(String(display), void 0, namespace)
          }
        );
      }
      return /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkG4EIC5OB_js.cn("dui-table-badge", `dui-table-badge-${String(value).toLowerCase()}`), children: chunk4GBTIAHZ_js.resolveLabel(String(value), void 0, namespace) });
    }
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
    case "html":
      return /* @__PURE__ */ jsxRuntime.jsx("div", { dangerouslySetInnerHTML: { __html: String(value) } });
    default:
      if (Array.isArray(value)) {
        return value.map((v, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { children: v && typeof v === "object" ? v.label ?? v.name ?? String(v) : String(v) }, i));
      }
      if (value && typeof value === "object") {
        const obj = value;
        const display = obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj);
        const widthPx = parseWidthPx(column);
        if (widthPx !== null && widthPx <= MIN_PX && typeof display === "string") {
          return String(display).length > MIN_CHAR_DISPLAY ? `${String(display).slice(0, MIN_CHAR_DISPLAY)}\u2026` : String(display);
        }
        return String(display);
      }
      {
        const s = String(value);
        const widthPx = parseWidthPx(column);
        if (widthPx !== null && widthPx <= MIN_PX) {
          return s.length > MIN_CHAR_DISPLAY ? `${s.slice(0, MIN_CHAR_DISPLAY)}\u2026` : s;
        }
        return s;
      }
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
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  const pageNumbers = React2.useMemo(() => {
    const pages = [];
    const maxVisiblePages = 9;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 4) {
        pages.push("ellipsis");
      }
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-pagination-info", children: t6(
      "table.pagination.showing",
      { start: startRecord, end: endRecord, total: totalCount },
      `Showing ${startRecord} to ${endRecord} of ${totalCount} entries`
    ) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination-controls", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-pagination-pagesize", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("label", { children: [
          t6("table.pagination.pageSize", {}, "Page size"),
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
            "aria-label": t6("table.pagination.first"),
            children: "\xAB"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(currentPage - 1),
            disabled: currentPage === 1,
            "aria-label": t6("table.pagination.previous"),
            children: "\u2039"
          }
        ),
        pageNumbers.map((page, index) => page === "ellipsis" ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-pagination-ellipsis", children: "\u2026" }, `ellipsis-${index}`) : /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: chunkG4EIC5OB_js.cn(
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
            "aria-label": t6("table.pagination.next"),
            children: "\u203A"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: "dui-table-pagination-btn",
            onClick: () => onPageChange(totalPages),
            disabled: currentPage === totalPages,
            "aria-label": t6("table.pagination.last"),
            children: "\xBB"
          }
        )
      ] })
    ] })
  ] });
}
function useSimpleSelection(data, rowKeyProp, mode, initialSelection, onSelectionChange) {
  const [internalSelected, setInternalSelected] = React2.useState(/* @__PURE__ */ new Set());
  const selected = React2.useMemo(() => {
    if (initialSelection !== void 0) {
      return new Set(initialSelection);
    }
    return internalSelected;
  }, [initialSelection, internalSelected]);
  const getKey = React2.useCallback((row) => {
    if (typeof rowKeyProp === "function") {
      return rowKeyProp(row);
    }
    return row[rowKeyProp];
  }, [rowKeyProp]);
  const isSelected = React2.useCallback((key) => {
    return selected.has(key);
  }, [selected]);
  const updateSelection = React2.useCallback((newSet) => {
    if (initialSelection === void 0) {
      setInternalSelected(newSet);
    }
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSet));
    }
  }, [initialSelection, onSelectionChange]);
  const toggle = React2.useCallback((key) => {
    const next = new Set(selected);
    if (mode === "single") {
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
  const toggleAll = React2.useCallback(() => {
    let next;
    if (selected.size === data.length) {
      next = /* @__PURE__ */ new Set();
    } else {
      next = new Set(data.map(getKey));
    }
    updateSelection(next);
  }, [data, getKey, selected.size, updateSelection]);
  const clear = React2.useCallback(() => {
    updateSelection(/* @__PURE__ */ new Set());
  }, [updateSelection]);
  const selectedIds = React2.useMemo(() => Array.from(selected), [selected]);
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
    isTreeTable,
    expandedRowKeys: controlledExpandedKeys,
    onToggleExpand,
    renderSubRow,
    theme = "system",
    preventLayoutShift = true,
    featureFlags = {},
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
    onToolbarToggleEnabled,
    renderToolbarCustomContent,
    // Handler to open Columns selector modal provided by page hook
    onToolbarOpenColumns,
    // whether prefs need sync (optional)
    toolbarColumnsNeedsSync,
    toolbarDisabled = false,
    IconComponent
  } = props;
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  const [internalPage, setInternalPage] = React2.useState(1);
  const [internalPageSize, setInternalPageSize] = React2.useState(
    config.pagination?.pageSize ?? 10
  );
  const [sortState, setSortState] = React2.useState(null);
  const [filters, setFilters] = React2.useState({});
  const isPageControlled = externalPage !== void 0;
  const currentPage = isPageControlled ? externalPage : internalPage;
  const currentPageSize = externalPageSize ?? internalPageSize;
  const totalCount = externalTotalCount ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / currentPageSize));
  const visibleColumns = React2.useMemo(() => {
    return config.columns.filter((col) => {
      if (col.visible === false) return false;
      if (!col.showWhen) return true;
      return chunkG4EIC5OB_js.evaluateConditions(col.showWhen, {}, featureFlags);
    });
  }, [config.columns, featureFlags]);
  const getKey = React2.useCallback((row) => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey];
  }, [rowKey]);
  const selection = useSimpleSelection(
    data,
    rowKey,
    selectionMode,
    externalSelectedIds,
    onSelectionChange
  );
  const showStatusColumn = React2.useMemo(() => {
    return data.slice(0, 50).some(
      (row) => row.isEnabled !== void 0 || row.active !== void 0 || row.isActive !== void 0 || row.available !== void 0 || row.quantityAvailable !== void 0
    );
  }, [data]);
  const [internalExpandedKeys, setInternalExpandedKeys] = React2.useState(/* @__PURE__ */ new Set());
  const handlePageChange = React2.useCallback((newPage) => {
    if (isPageControlled && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  }, [isPageControlled, onPageChange]);
  const handlePageSizeChange = React2.useCallback((newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    setInternalPageSize(newPageSize);
    handlePageChange(1);
  }, [onPageSizeChange, handlePageChange]);
  const handleSortChange = React2.useCallback((column) => {
    if (!column.sortable) return;
    const newSort = sortState?.key === column.key ? sortState.direction === "asc" ? { key: column.key, direction: "desc" } : sortState.direction === "desc" ? null : { key: column.key, direction: "asc" } : { key: column.key, direction: "asc" };
    setSortState(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  }, [sortState, onSortChange]);
  const clearFilters = React2.useCallback(() => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);
  const resetPage = React2.useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);
  React2.useImperativeHandle(ref, () => ({
    clearFilters,
    clearSelection: selection.clear,
    resetPage,
    getFilters: () => filters,
    getSelectedIds: () => selection.selectedIds
  }), [clearFilters, selection.clear, resetPage, filters, selection.selectedIds]);
  const processedData = React2.useMemo(() => {
    let working = [...data];
    if (!onSortChange && sortState) {
      const col = config.columns.find((c) => c.key === sortState.key);
      if (col) {
        const getSortValue = (row) => {
          const v = getCellValue(row, col);
          if (typeof v === "number") return v;
          if (v == null) return "";
          if (Array.isArray(v)) {
            return v.map((it) => it && typeof it === "object" ? it.label ?? it.name ?? String(it) : String(it)).join(" ");
          }
          if (typeof v === "object") {
            const obj = v;
            return obj.label ?? obj.name ?? obj.businessName ?? obj.value ?? JSON.stringify(obj);
          }
          return String(v).toLowerCase();
        };
        working.sort((a, b) => {
          const av = getSortValue(a);
          const bv = getSortValue(b);
          if (typeof av === "number" && typeof bv === "number") {
            return sortState.direction === "asc" ? av - bv : bv - av;
          }
          return sortState.direction === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
      }
    }
    if (isPageControlled) return working;
    const start = (currentPage - 1) * currentPageSize;
    return working.slice(start, start + currentPageSize);
  }, [data, isPageControlled, currentPage, currentPageSize, sortState, onSortChange, config.columns]);
  const displayData = processedData;
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
  const [resizing, setResizing] = React2.useState(null);
  const stickyLeftOffsets = React2.useMemo(() => {
    const offsets = {};
    let currentOffset = 0;
    if (selectable) {
      offsets["selection"] = currentOffset;
      currentOffset += 48;
    }
    if (showRowNumbers) {
      offsets["rownum"] = currentOffset;
      currentOffset += 48;
    }
    if (showStatusColumn) {
      offsets["status"] = currentOffset;
      currentOffset += 40;
    }
    if (visibleColumns.length > 0) {
      const firstCol = visibleColumns[0];
      offsets[String(firstCol.key)] = currentOffset;
    }
    return offsets;
  }, [selectable, showRowNumbers, showStatusColumn, visibleColumns]);
  const startColumnResize = React2.useCallback((e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target.closest("th");
    if (!el) return;
    const startWidth = el.getBoundingClientRect().width;
    setResizing({ key: String(key), startX: e.clientX, startWidth });
  }, []);
  React2.useEffect(() => {
    try {
      config.columns.forEach((c) => {
        if (c.resizable === void 0) c.resizable = true;
      });
    } catch (e) {
    }
  }, [config.columns]);
  React2.useEffect(() => {
    if (!resizing) return;
    const onMove = (ev) => {
      const dx = ev.clientX - (resizing.startX || 0);
      let newWidth = Math.max(MIN_PX2, Math.max(40, (resizing.startWidth || 0) + dx));
      config.columns.forEach((c) => {
        if (String(c.key) === resizing.key) c._computedWidth = `${newWidth}px`;
      });
      try {
        const sum = config.columns.reduce((acc, c) => {
          const w = parseWidthPx2(c) ?? 120;
          return acc + w;
        }, 0);
        if (tableElRef.current) {
          tableElRef.current.style.minWidth = `${sum}px`;
        }
      } catch (e) {
      }
      setResizing((cur) => cur ? { ...cur } : cur);
    };
    const onUp = () => {
      try {
        const storageKey = `dn:col_widths:${config.id || "table"}`;
        const widths = {};
        config.columns.forEach((c) => {
          if (c._computedWidth) widths[String(c.key)] = String(c._computedWidth);
        });
        localStorage.setItem(storageKey, JSON.stringify({ widths }));
      } catch (e) {
      }
      setResizing(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing, config.columns]);
  React2.useEffect(() => {
    try {
      const storageKey = `dn:col_widths:${config.id || "table"}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.widths) {
          config.columns.forEach((c) => {
            if (parsed.widths[c.key]) c._computedWidth = parsed.widths[c.key];
          });
          setResizing((cur) => cur ? { ...cur } : cur);
        }
      }
    } catch (e) {
    }
  }, [config.id, config.columns]);
  const parseWidthPx2 = (col) => {
    const w = col._computedWidth ?? col.width;
    if (w == null) return null;
    if (typeof w === "number") return w;
    const str = String(w).trim();
    const m = str.match(/^(\d+)/);
    if (m) return Number(m[1]);
    return null;
  };
  const MIN_CHAR_DISPLAY2 = 6;
  const CHAR_PX2 = 8;
  const MIN_PX2 = MIN_CHAR_DISPLAY2 * CHAR_PX2;
  const tableElRef = React2__default.default.useRef(null);
  if (loading && data.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkG4EIC5OB_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style, children: renderLoading() });
  }
  if (error && data.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkG4EIC5OB_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style, children: renderError(error) });
  }
  const tableClasses = chunkG4EIC5OB_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-table-container", effectiveTheme === "dark" ? "dui-theme--dark" : "dui-theme--light", className), style: containerStyle, children: [
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
        onToggleEnabled: onToolbarToggleEnabled,
        deleteLabel: toolbarDeleteLabel,
        renderCustomContent: renderToolbarCustomContent,
        onOpenColumns: onToolbarOpenColumns,
        showColumnsButton: Boolean(onToolbarOpenColumns),
        columnsNeedsSync: toolbarColumnsNeedsSync,
        disabled: toolbarDisabled,
        columns: config.columns
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-wrapper", style: preventLayoutShift ? { scrollbarGutter: "stable" } : {}, children: /* @__PURE__ */ jsxRuntime.jsxs("table", { className: tableClasses, children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { className: "dui-table-head", children: renderHeader ? renderHeader(visibleColumns) : /* @__PURE__ */ jsxRuntime.jsxs("tr", { className: "dui-table-row dui-table-header-row", children: [
        selectable && selectionMode === "multiple" && /* @__PURE__ */ jsxRuntime.jsx(
          "th",
          {
            className: chunkG4EIC5OB_js.cn("dui-table-th dui-table-th-checkbox dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last"),
            style: { left: stickyLeftOffsets["selection"], backgroundColor: "var(--dui-table-header-bg)" },
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Checkbox,
              {
                checked: selection.isAllSelected,
                indeterminate: selection.isSomeSelected && !selection.isAllSelected,
                onChange: () => selection.toggleAll()
              }
            )
          }
        ),
        selectable && selectionMode === "single" && /* @__PURE__ */ jsxRuntime.jsx(
          "th",
          {
            className: chunkG4EIC5OB_js.cn("dui-table-th dui-table-th-radio dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last"),
            style: { left: stickyLeftOffsets["selection"], backgroundColor: "var(--dui-table-header-bg)" }
          }
        ),
        showRowNumbers && /* @__PURE__ */ jsxRuntime.jsx(
          "th",
          {
            className: chunkG4EIC5OB_js.cn("dui-table-th dui-table-th-rownum dui-table-sticky-left", visibleColumns.length === 0 && !showStatusColumn && "dui-table-sticky-left-last"),
            style: { left: stickyLeftOffsets["rownum"], backgroundColor: "var(--dui-table-header-bg)" },
            children: "#"
          }
        ),
        showStatusColumn && /* @__PURE__ */ jsxRuntime.jsx(
          "th",
          {
            className: chunkG4EIC5OB_js.cn("dui-table-th dui-table-th-status dui-table-sticky-left", visibleColumns.length === 0 && "dui-table-sticky-left-last"),
            style: { width: "2.5rem", textAlign: "center", left: stickyLeftOffsets["status"], backgroundColor: "var(--dui-table-header-bg)" }
          }
        ),
        visibleColumns.map((column, index) => {
          const isActionsCol = column.key === "actions" || column.type === "actions" || column.dataType === "actions";
          const isFirstDataCol = index === 0;
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "th",
            {
              className: chunkG4EIC5OB_js.cn(
                "dui-table-th",
                column.sortable && "dui-table-th-sortable",
                column.align && `dui-table-th-${column.align}`,
                isActionsCol && "dui-table-th-actions",
                isFirstDataCol && "dui-table-sticky-left dui-table-sticky-left-last"
              ),
              style: {
                width: column._computedWidth ?? column.width,
                minWidth: column.minWidth ?? `${MIN_PX2}px`,
                maxWidth: column.maxWidth,
                backgroundColor: isActionsCol || isFirstDataCol ? "var(--dui-table-header-bg)" : void 0,
                left: isFirstDataCol ? stickyLeftOffsets[String(column.key)] : void 0,
                zIndex: isFirstDataCol || isActionsCol ? 15 : void 0
              },
              onClick: () => column.sortable && handleSortChange(column),
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-table-th-content", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-table-th-text", children: (function getColumnLabel() {
                    const headerStr = typeof column.header === "string" ? column.header : "";
                    const namespace = column.translationNamespace;
                    const tByKey = t6(`columns.labels.${String(column.key)}`);
                    if (tByKey && tByKey !== `columns.labels.${String(column.key)}`) return tByKey;
                    return chunk4GBTIAHZ_js.resolveLabel(headerStr || String(column.key), void 0, namespace);
                  })() }),
                  column.sortable && /* @__PURE__ */ jsxRuntime.jsx(
                    SortIndicator,
                    {
                      direction: sortState?.key === column.key ? sortState.direction : null
                    }
                  )
                ] }),
                column.resizable && /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    className: "dui-table-th-resize-handle",
                    onMouseDown: (e) => startColumnResize(e, column.key),
                    style: { position: "absolute", top: 0, right: 0, bottom: 0, width: 8, cursor: "col-resize" },
                    role: "separator",
                    "aria-orientation": "horizontal"
                  }
                )
              ]
            },
            column.key
          );
        }),
        renderActions && /* @__PURE__ */ jsxRuntime.jsx("th", { className: "dui-table-th dui-table-th-actions", style: { backgroundColor: "var(--dui-table-header-bg)" }, children: t6("table.actions") })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { className: "dui-table-body", children: displayData.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx(
        "td",
        {
          colSpan: visibleColumns.length + (selectable ? 1 : 0) + (showRowNumbers ? 1 : 0) + (showStatusColumn ? 1 : 0) + (renderActions ? 1 : 0) + (isTreeTable ? 1 : 0),
          className: "dui-table-td-empty",
          children: renderEmpty()
        }
      ) }) : displayData.map((row, index) => {
        const key = getKey(row);
        const rowIndex = (currentPage - 1) * currentPageSize + index;
        const isRowSelected = selectable && selection.isSelected(key);
        const isExpanded = controlledExpandedKeys ? controlledExpandedKeys.includes(key) : internalExpandedKeys.has(key);
        const isChild = !!row.parentId;
        if (renderRow) {
          return renderRow(row, rowIndex, visibleColumns);
        }
        const toggleExpand = (e) => {
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
        return /* @__PURE__ */ jsxRuntime.jsxs(React2__default.default.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            "tr",
            {
              className: chunkG4EIC5OB_js.cn(
                "dui-table-row",
                isRowSelected && "dui-table-row-selected",
                onRowClick && "dui-table-row-clickable",
                isChild && "dui-table-row-child"
              ),
              onClick: (e) => {
                if (e.button !== 0) return;
                onRowClick?.(row, rowIndex);
              },
              onDoubleClick: (e) => {
                if (e.button !== 0) return;
                onRowDoubleClick?.(row, rowIndex);
              },
              onContextMenu: (e) => {
                e.stopPropagation();
              },
              children: [
                isTreeTable && /* @__PURE__ */ jsxRuntime.jsx("td", { className: "dui-table-td dui-table-td-tree-toggle", onClick: (e) => e.stopPropagation(), children: (row.hasChildren || row.isVariable || row.children?.length > 0) && /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", onClick: toggleExpand, className: "dui-table-tree-btn", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkG4EIC5OB_js.cn("dui-table-tree-icon", isExpanded && "dui-table-tree-icon--expanded"), children: IconComponent ? /* @__PURE__ */ jsxRuntime.jsx(IconComponent, { name: "chevron-right" }) : isExpanded ? "\u25BC" : "\u25B6" }) }) }),
                selectable && selectionMode === "multiple" && /* @__PURE__ */ jsxRuntime.jsx(
                  "td",
                  {
                    className: chunkG4EIC5OB_js.cn("dui-table-td dui-table-td-checkbox dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last"),
                    style: { left: stickyLeftOffsets["selection"], backgroundColor: "inherit" },
                    onClick: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                      Checkbox,
                      {
                        checked: isRowSelected,
                        onChange: () => selection.toggle(key)
                      }
                    ) })
                  }
                ),
                selectable && selectionMode === "single" && /* @__PURE__ */ jsxRuntime.jsx(
                  "td",
                  {
                    className: chunkG4EIC5OB_js.cn("dui-table-td dui-table-td-radio dui-table-sticky-left", visibleColumns.length === 0 && !showRowNumbers && !showStatusColumn && "dui-table-sticky-left-last"),
                    style: { left: stickyLeftOffsets["selection"], backgroundColor: "inherit" },
                    onClick: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                      "input",
                      {
                        type: "radio",
                        className: "dui-table-radio",
                        checked: isRowSelected,
                        onChange: () => selection.toggle(key)
                      }
                    ) })
                  }
                ),
                showRowNumbers && /* @__PURE__ */ jsxRuntime.jsx(
                  "td",
                  {
                    className: chunkG4EIC5OB_js.cn("dui-table-td dui-table-td-rownum dui-table-sticky-left", visibleColumns.length === 0 && !showStatusColumn && "dui-table-sticky-left-last"),
                    style: { left: stickyLeftOffsets["rownum"], backgroundColor: "inherit" },
                    children: rowIndex + 1
                  }
                ),
                showStatusColumn && /* @__PURE__ */ jsxRuntime.jsx(
                  "td",
                  {
                    className: chunkG4EIC5OB_js.cn("dui-table-td dui-table-td-status dui-table-sticky-left", visibleColumns.length === 0 && "dui-table-sticky-left-last"),
                    style: { textAlign: "center", width: "2.5rem", left: stickyLeftOffsets["status"], backgroundColor: "inherit" },
                    onClick: (e) => e.stopPropagation(),
                    children: (function renderStatusDot() {
                      const active = row.isEnabled ?? row.active ?? row.isActive ?? row.available ?? (row.quantityAvailable !== void 0 ? row.quantityAvailable > 0 : void 0);
                      if (active === void 0) return null;
                      return /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          className: chunkG4EIC5OB_js.cn(
                            "dui-table-status-dot",
                            active ? "dui-table-status-dot--active" : "dui-table-status-dot--inactive"
                          ),
                          title: active ? t6("common.active", { default: "Activo" }) : t6("common.inactive", { default: "Inactivo" }),
                          style: { marginLeft: 0 }
                        }
                      );
                    })()
                  }
                ),
                visibleColumns.map((column, colIndex) => {
                  const isFirstDataCol = colIndex === 0;
                  if (column.type === "actions" || column.dataType === "actions") {
                    const actions = column.actions || [];
                    return /* @__PURE__ */ jsxRuntime.jsx(
                      "td",
                      {
                        className: chunkG4EIC5OB_js.cn(
                          "dui-table-td",
                          column.align && `dui-table-td-${column.align}`,
                          "dui-table-td-actions"
                        ),
                        style: {
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          backgroundColor: "var(--dui-table-bg)",
                          position: "sticky",
                          right: 0,
                          zIndex: 5
                        },
                        onClick: (e) => e.stopPropagation(),
                        children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
                          display: "flex",
                          gap: 8,
                          justifyContent: column.align === "center" ? "center" : column.align === "right" ? "flex-end" : void 0
                        }, children: actions.map((action) => {
                          let renderedIcon = action.icon;
                          if (typeof action.icon === "string") {
                            if (IconComponent) {
                              renderedIcon = /* @__PURE__ */ jsxRuntime.jsx(IconComponent, { name: action.icon, className: "w-4 h-4" });
                            }
                          }
                          const getVariantClass = (v) => {
                            if (!v) return "btn-ghost";
                            if (v.includes("ghost")) return `btn-${v}`;
                            if (v.includes("outline")) return `btn-${v}`;
                            if (v === "info" || v === "primary") return "btn-ghost text-primary";
                            if (v === "warning") return "btn-ghost text-warning";
                            if (v === "danger") return "btn-ghost text-danger";
                            return `btn-ghost text-${v}`;
                          };
                          return /* @__PURE__ */ jsxRuntime.jsx(
                            "button",
                            {
                              type: "button",
                              title: typeof action.label === "string" ? chunk4GBTIAHZ_js.resolveLabel(action.label) : void 0,
                              className: `btn btn-sm ${getVariantClass(action.variant)}`,
                              onClick: (e) => {
                                e.stopPropagation();
                                action.onClick?.(row, rowIndex);
                              },
                              children: renderedIcon ? renderedIcon : typeof action.label === "string" ? chunk4GBTIAHZ_js.resolveLabel(action.label) : action.label
                            },
                            action.id
                          );
                        }) })
                      },
                      column.key
                    );
                  }
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
                      className: chunkG4EIC5OB_js.cn(
                        "dui-table-td",
                        column.align && `dui-table-td-${column.align}`,
                        isFirstDataCol && "dui-table-sticky-left dui-table-sticky-left-last"
                      ),
                      style: {
                        width: column.width,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        left: isFirstDataCol ? stickyLeftOffsets[String(column.key)] : void 0,
                        backgroundColor: isFirstDataCol ? "inherit" : void 0,
                        paddingLeft: isFirstDataCol && isChild ? "2rem" : void 0
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
                    style: { backgroundColor: "var(--dui-table-bg)" },
                    onClick: (e) => e.stopPropagation(),
                    children: renderActions(row, rowIndex)
                  }
                )
              ]
            }
          ),
          isExpanded && renderSubRow && /* @__PURE__ */ jsxRuntime.jsx("tr", { className: "dui-table-row-sub", children: /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: visibleColumns.length + (selectable ? 1 : 0) + (showRowNumbers ? 1 : 0) + (showStatusColumn ? 1 : 0) + (renderActions ? 1 : 0) + (isTreeTable ? 1 : 0), children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-table-subrow-content", children: renderSubRow(row) }) }) }),
          isExpanded && row.children && row.children.map((child, childIdx) => {
            return null;
          })
        ] }, key);
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
var TableRenderer = React2.forwardRef(TableRendererInner);
TableRenderer.displayName = "TableRenderer";
var TabRenderer = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = "underline"
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkG4EIC5OB_js.cn("dui-tabs-container", className), children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkG4EIC5OB_js.cn(
    "flex items-center gap-1 border-b dark:border-gray-700",
    variant === "pills" && "border-none gap-2"
  ), children: tabs.map((tab) => {
    const isActive = tab.id === activeTab;
    if (variant === "pills") {
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          type: "button",
          onClick: () => !tab.disabled && onChange(tab.id),
          disabled: tab.disabled,
          className: chunkG4EIC5OB_js.cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400",
            tab.disabled && "opacity-50 cursor-not-allowed"
          ),
          children: [
            tab.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg", children: tab.icon }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunk4GBTIAHZ_js.resolveLabel(tab.label) })
          ]
        },
        tab.id
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => !tab.disabled && onChange(tab.id),
        disabled: tab.disabled,
        className: chunkG4EIC5OB_js.cn(
          "relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 focus:outline-none",
          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
          tab.disabled && "opacity-50 cursor-not-allowed"
        ),
        children: [
          tab.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg", children: tab.icon }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunk4GBTIAHZ_js.resolveLabel(tab.label) }),
          isActive && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.5)]" })
        ]
      },
      tab.id
    );
  }) }) });
};
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
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
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
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
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
            !field.required && /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: chunk4GBTIAHZ_js.resolveLabel("select_placeholder", "Select...") }),
            field.options?.map((option) => /* @__PURE__ */ jsxRuntime.jsx(
              "option",
              {
                value: String(option.value),
                disabled: option.disabled,
                children: chunk4GBTIAHZ_js.resolveLabel(String(option.label))
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
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-field dui-field--checkbox", hasError && "dui-field--error"), children: [
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
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunk4GBTIAHZ_js.resolveLabel(String(field.label)) }),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunk4GBTIAHZ_js.resolveLabel(String(field.helpText)) }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  if (field.type === "textarea") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
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
          placeholder: field.placeholder ? chunk4GBTIAHZ_js.resolveLabel(String(field.placeholder)) : void 0,
          maxLength: field.maxLength,
          className: "dui-field__textarea",
          rows: 4
        }
      ),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunk4GBTIAHZ_js.resolveLabel(String(field.helpText)) }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__error", children: error })
    ] });
  }
  if (field.type === "radio") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-field", hasError && "dui-field--error"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "dui-field__label", children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: chunkG4EIC5OB_js.cn(
        "dui-field__radio-group",
        field.layout === "horizontal" && "dui-field__radio-group--horizontal",
        field.layout === "vertical" && "dui-field__radio-group--vertical"
      ), children: field.options?.map((option) => /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "dui-field__radio-label", children: [
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
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: chunk4GBTIAHZ_js.resolveLabel(String(option.label)) })
      ] }, String(option.value))) }),
      field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunk4GBTIAHZ_js.resolveLabel(String(field.helpText)) }),
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
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("dui-field", hasError && "dui-field--error"), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: inputId, className: "dui-field__label", children: [
      chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
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
        placeholder: field.placeholder ? chunk4GBTIAHZ_js.resolveLabel(String(field.placeholder)) : void 0,
        min: field.min,
        max: field.max,
        maxLength: field.maxLength,
        className: "dui-field__input"
      }
    ),
    field.helpText && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-field__help", children: chunk4GBTIAHZ_js.resolveLabel(String(field.helpText)) }),
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
        className: chunkG4EIC5OB_js.cn(
          "dui-form-section__header",
          section.collapsible && "dui-form-section__header--collapsible"
        ),
        onClick: section.collapsible ? toggleCollapse : void 0,
        children: [
          section.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-form-section__icon", children: section.icon }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-form-section__title-group", children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "dui-form-section__title", children: typeof section.title === "string" ? chunk4GBTIAHZ_js.resolveLabel(section.title) : section.title }),
            section.description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-form-section__description", children: typeof section.description === "string" ? chunk4GBTIAHZ_js.resolveLabel(section.description) : section.description })
          ] }),
          section.collapsible && /* @__PURE__ */ jsxRuntime.jsx("span", { className: chunkG4EIC5OB_js.cn(
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
    featureFlags = {},
    className,
    hideButtons = false,
    footer,
    header
  } = props;
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  const [internalValues, setInternalValues] = React2.useState(initialValues);
  const [internalErrors, setInternalErrors] = React2.useState({});
  const [touched, setTouched] = React2.useState({});
  const [isSubmitting, setIsSubmitting] = React2.useState(false);
  const [activeTab, setActiveTab] = React2.useState(() => {
    if (config.tabs && config.tabs.length > 0) {
      return config.tabs[0].id;
    }
    return "";
  });
  const [collapsedSections, setCollapsedSections] = React2.useState(() => {
    const initial = /* @__PURE__ */ new Set();
    (config.sections || []).forEach((section) => {
      if (section.defaultCollapsed) {
        initial.add(section.id);
      }
    });
    return initial;
  });
  const isControlled = controlledValues !== void 0;
  const values = isControlled ? controlledValues : internalValues;
  const errors = controlledErrors || internalErrors;
  const initialValuesRef = React2__default.default.useRef(initialValues);
  const isFieldVisible = React2.useCallback((field) => {
    if (field.type === "hidden") return false;
    if (!field.showWhen) return true;
    return chunkG4EIC5OB_js.evaluateConditions(field.showWhen, values, featureFlags);
  }, [values, featureFlags]);
  const isSectionVisible = React2.useCallback((section) => {
    if (!section.showWhen) return true;
    return chunkG4EIC5OB_js.evaluateConditions(section.showWhen, values, featureFlags);
  }, [values, featureFlags]);
  const isTabVisible = React2.useCallback((tab) => {
    if (!tab.showWhen) return true;
    return chunkG4EIC5OB_js.evaluateConditions(tab.showWhen, values, featureFlags);
  }, [values, featureFlags]);
  const getComputedValue = React2.useCallback((field) => {
    if (!field.computed || !field.computed.formula) {
      return chunkG4EIC5OB_js.getNestedValue(values, field.name);
    }
    const { formula, deps } = field.computed;
    const hasAllDeps = deps.every((dep) => {
      const depValue = chunkG4EIC5OB_js.getNestedValue(values, dep);
      return depValue !== void 0 && depValue !== null && depValue !== "";
    });
    if (!hasAllDeps) {
      return chunkG4EIC5OB_js.getNestedValue(values, field.name);
    }
    try {
      const context = {};
      for (const dep of deps) {
        const depValue = chunkG4EIC5OB_js.getNestedValue(values, dep);
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
      return chunkG4EIC5OB_js.getNestedValue(values, field.name);
    }
  }, [values]);
  const getVisibleFields = React2.useCallback(() => {
    const sections = config.tabs ? config.tabs.filter(isTabVisible).flatMap((t7) => t7.sections) : config.sections || [];
    return sections.filter(isSectionVisible).flatMap((section) => section.fields.filter(isFieldVisible));
  }, [config.tabs, config.sections, isTabVisible, isSectionVisible, isFieldVisible]);
  const validateField2 = React2.useCallback((field) => {
    const value = field.computed ? getComputedValue(field) : chunkG4EIC5OB_js.getNestedValue(values, field.name);
    const result = chunkG4EIC5OB_js.validateField(value, field, values);
    return result.valid ? void 0 : result.message;
  }, [values, getComputedValue]);
  const validateAll = React2.useCallback(() => {
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
  const setValue = React2.useCallback((name, value) => {
    const newValues = { ...values, [name]: value };
    if (!isControlled) {
      setInternalValues(newValues);
    }
    if (onChange) {
      onChange(name, value, newValues);
    }
  }, [values, isControlled, onChange]);
  const setValues = React2.useCallback((newValues) => {
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
  const reset = React2.useCallback(() => {
    if (!isControlled) {
      setInternalValues(initialValuesRef.current);
      setInternalErrors({});
    }
    setTouched({});
  }, [isControlled]);
  const isDirty = React2.useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);
  const handleSubmit = React2.useCallback(async (e) => {
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
  const handleFieldChange = React2.useCallback((name, value) => {
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
  const handleFieldBlur = React2.useCallback((name) => {
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
  const toggleSectionCollapse = React2.useCallback((sectionId) => {
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
  React2.useImperativeHandle(ref, () => ({
    getValues: () => values,
    setValues,
    setValue,
    validate: validateAll,
    reset,
    getErrors: () => errors,
    isDirty,
    submit: handleSubmit
  }), [values, setValues, setValue, validateAll, reset, errors, isDirty, handleSubmit]);
  const renderFieldElement = React2.useCallback((field) => {
    if (!isFieldVisible(field)) return null;
    const fieldValue = field.computed ? getComputedValue(field) : chunkG4EIC5OB_js.getNestedValue(values, field.name);
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
  const renderSectionElement = React2.useCallback((section) => {
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
      return /* @__PURE__ */ jsxRuntime.jsx(React2__default.default.Fragment, { children: customRenderSection(sectionProps) }, section.id);
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
  const renderedSections = React2.useMemo(() => {
    let sectionsToRender = [];
    if (config.tabs && config.tabs.length > 0) {
      const currentTab = config.tabs.find((t7) => t7.id === activeTab);
      if (currentTab) {
        sectionsToRender = currentTab.sections;
      }
    } else {
      sectionsToRender = config.sections || [];
    }
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-6 gap-6", children: sectionsToRender.map((section) => {
      const content = renderSectionElement(section);
      if (!content) return null;
      const width = section.width || "full";
      let colSpan = "col-span-6";
      if (width === "1/2") colSpan = "col-span-3";
      if (width === "1/3") colSpan = "col-span-2";
      if (width === "2/3") colSpan = "col-span-4";
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: colSpan, children: content }, section.id);
    }) });
  }, [config.tabs, config.sections, activeTab, renderSectionElement]);
  const submitLabel = config.submitLabel || t6("form.submit");
  const cancelLabel = config.cancelLabel || t6("form.cancel");
  const isFormDisabled = disabled || loading || isSubmitting;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: chunkG4EIC5OB_js.cn("dui-form", className),
      children: [
        (config.title || header) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-form__header", children: header || /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "dui-form__title", children: config.title }),
          config.description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-form__description", children: config.description })
        ] }) }),
        config.tabs && config.tabs.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
          TabRenderer,
          {
            tabs: config.tabs.filter(isTabVisible).map((t7) => ({
              id: t7.id,
              label: t7.label,
              icon: t7.icon
            })),
            activeTab,
            onChange: setActiveTab,
            className: "mb-6"
          }
        ),
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
              children: loading || isSubmitting ? t6("form.submitting") : submitLabel
            }
          )
        ] }) })
      ]
    }
  );
}
var FormRenderer = React2.forwardRef(FormRendererInner);
FormRenderer.displayName = "FormRenderer";
var SIZE_MAP = {
  sm: "dui-modal--sm",
  md: "dui-modal--md",
  lg: "dui-modal--lg",
  xl: "dui-modal--xl",
  full: "dui-modal--full"
};
function ConfirmDialog({ open, onConfirm, onCancel, config, loading, entityName }) {
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  if (!open) return null;
  const resolvedEntity = entityName || t6("entities.unknown", void 0, "Item");
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__confirm-overlay", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__confirm-dialog", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "dui-modal__confirm-title", children: typeof config.title === "string" ? t6(config.title, { entity: resolvedEntity }) : config.title }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dui-modal__confirm-message", children: typeof config.message === "string" ? t6(config.message, { entity: resolvedEntity }) : config.message }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__confirm-actions", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: loading,
          className: "dui-modal__button dui-modal__button--secondary",
          children: config.cancelLabel || t6("modal.cancel")
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          onClick: onConfirm,
          disabled: loading,
          className: chunkG4EIC5OB_js.cn(
            "dui-modal__button",
            config.confirmVariant === "danger" ? "dui-modal__button--danger" : "dui-modal__button--primary"
          ),
          children: loading ? t6("modal.loading") : config.confirmLabel || t6("modal.confirm")
        }
      )
    ] })
  ] }) });
}
function DynamicModalInner(props, ref) {
  const {
    open,
    onClose,
    mode,
    title: titleProp,
    submitLabel: submitLabelProp,
    subtitle,
    size = "xl",
    config,
    tabs,
    initialValues = {},
    onSubmit,
    onDelete,
    actions = [],
    loading = false,
    error,
    errors,
    closeOnBackdropClick = false,
    closeOnEscape = true,
    header,
    footer,
    className,
    deleteConfirmation,
    showCloseButton = true,
    renderField,
    renderSection,
    featureFlags = {},
    theme = "system",
    entityName
  } = props;
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  const effectiveMode = mode ?? "edit";
  const resolvedEntity = entityName || t6("entities.unknown", void 0, "Item");
  const title = typeof titleProp === "string" ? titleProp : chunkUSZU7PLJ_js.getModalTitle(titleProp, effectiveMode);
  const submitLabel = submitLabelProp == null ? effectiveMode === "create" ? t6("modal.create", { entity: resolvedEntity }) : t6("modal.save") : typeof submitLabelProp === "string" ? submitLabelProp : chunkUSZU7PLJ_js.getModalSubmitLabel(submitLabelProp, effectiveMode);
  const isViewMode = effectiveMode === "view";
  const formRef = React2.useRef(null);
  const modalRef = React2.useRef(null);
  const [activeTab, setActiveTab] = React2.useState(tabs?.[0]?.id || "");
  const [internalValues, setInternalValues] = React2.useState(initialValues);
  const [isSubmitting, setIsSubmitting] = React2.useState(false);
  const [isDeleting, setIsDeleting] = React2.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React2.useState(false);
  React2.useEffect(() => {
    if (open) {
      setInternalValues(initialValues);
      setActiveTab(tabs?.[0]?.id || "");
      setShowDeleteConfirm(false);
    }
  }, [open, initialValues, tabs]);
  React2.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !showDeleteConfirm) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose, showDeleteConfirm]);
  React2.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  React2.useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, selectextarea, [tabindex]:not([tabindex="-1"])'
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
  const handleBackdropClick = React2.useCallback((e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && !showDeleteConfirm) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose, showDeleteConfirm]);
  const handleFormChange = React2.useCallback((name, value, values) => {
    setInternalValues(values);
  }, []);
  const handleSubmit = React2.useCallback(async () => {
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
  const handleDelete = React2.useCallback(async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete]);
  const handleDeleteClick = React2.useCallback(() => {
    if (deleteConfirmation) {
      setShowDeleteConfirm(true);
    } else if (onDelete) {
      handleDelete();
    }
  }, [deleteConfirmation, onDelete, handleDelete]);
  React2.useImperativeHandle(ref, () => ({
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
  const currentTab = React2.useMemo(() => {
    return tabs?.find((tab) => tab.id === activeTab);
  }, [tabs, activeTab]);
  const currentFormConfig = React2.useMemo(() => {
    if (config) return config;
    return currentTab?.content;
  }, [config, currentTab]);
  const renderTabs = React2.useCallback(() => {
    if (!tabs || tabs.length === 0) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-modal__tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(tab.id),
        disabled: tab.disabled,
        className: chunkG4EIC5OB_js.cn(
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
  const renderContent = React2.useCallback(() => {
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
          readOnly: isViewMode,
          renderField,
          renderSection,
          featureFlags,
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
  const renderActions = React2.useCallback(() => {
    if (footer) return footer;
    const leftActions = actions.filter((a) => a.position === "left");
    const rightActions = actions.filter((a) => a.position !== "left");
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__footer", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dui-modal__footer-left", children: [
        !isViewMode && onDelete && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: handleDeleteClick,
            disabled: loading || isSubmitting || isDeleting,
            className: "dui-modal__button dui-modal__button--danger",
            children: isDeleting ? t6("modal.deleting", { entity: resolvedEntity }) : t6("modal.delete", { entity: resolvedEntity })
          }
        ),
        leftActions.map((action) => /* @__PURE__ */ jsxRuntime.jsxs(
          "button",
          {
            type: "button",
            onClick: action.onClick,
            disabled: action.disabled || action.loading,
            className: chunkG4EIC5OB_js.cn(
              "dui-modal__button",
              `dui-modal__button--${action.variant || "secondary"}`
            ),
            children: [
              action.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__button-icon", children: action.icon }),
              action.loading ? t6("modal.loading") : action.label
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
            className: chunkG4EIC5OB_js.cn(
              "dui-modal__button",
              `dui-modal__button--${action.variant || "secondary"}`
            ),
            children: [
              action.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dui-modal__button-icon", children: action.icon }),
              action.loading ? t6("modal.loading") : action.label
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
            children: t6("modal.cancel")
          }
        ),
        !isViewMode && onSubmit && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: handleSubmit,
            disabled: loading || isSubmitting,
            className: "dui-modal__button dui-modal__button--primary",
            children: loading || isSubmitting ? t6("modal.saving") : submitLabel
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
    isViewMode,
    submitLabel,
    t6
  ]);
  if (!open) return null;
  const overlayClass = chunkG4EIC5OB_js.cn(
    "dui-modal__overlay",
    theme === "dark" ? "dui-theme--dark" : theme === "light" ? "dui-theme--light" : ""
  );
  const modalContent = /* @__PURE__ */ jsxRuntime.jsx(
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
          className: chunkG4EIC5OB_js.cn(
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
                  "aria-label": t6("modal.close"),
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
                loading: isDeleting,
                entityName: resolvedEntity
              }
            )
          ]
        }
      )
    }
  );
  return reactDom.createPortal(modalContent, document.body);
}
var DynamicModal = React2.forwardRef(DynamicModalInner);
DynamicModal.displayName = "DynamicModal";
var DefaultLink = ({ to, children, className, onClick }) => /* @__PURE__ */ jsxRuntime.jsx("a", { href: to, className, onClick: (e) => {
  if (onClick) onClick(e);
}, children });
var SidebarRenderer = ({
  items,
  collapsed,
  onToggleCollapse,
  currentPath,
  onNavigate,
  LinkComponent = DefaultLink,
  userRole,
  t: passedT,
  // Passed translation function
  logoContent,
  footerContent,
  onLogout
}) => {
  const [openMenu, setOpenMenu] = React2.useState(null);
  const [anchorRect, setAnchorRect] = React2.useState(null);
  const buttonRefs = React2.useRef({});
  const translate = passedT || chunk4GBTIAHZ_js.t;
  const isActive = (path) => {
    if (!path) return false;
    if (path === "/" || path === "/dashboard") return currentPath === path;
    return currentPath.startsWith(path);
  };
  const isChildActive = (item) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isChildActive(child));
    }
    return false;
  };
  const toggleSidebar = () => onToggleCollapse && onToggleCollapse(!collapsed);
  const toggleMenu = (id, element) => {
    if (openMenu === id) {
      setOpenMenu(null);
      setAnchorRect(null);
      return;
    }
    setOpenMenu(id);
    if (element) {
      setAnchorRect(element.getBoundingClientRect());
    }
  };
  React2.useEffect(() => {
    if (!openMenu) return;
    function onDocClick(e) {
      const target = e.target;
      const buttonId = openMenu;
      if (buttonId && buttonRefs.current[buttonId]?.contains(target)) return;
      const menus = document.querySelectorAll('[data-portal="true"]');
      for (const m of Array.from(menus)) {
        if (m.contains(target)) return;
      }
      setOpenMenu(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);
  const filteredItems = items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });
  const renderItem = (item, index) => {
    if (item.roles && item.roles.length > 0 && userRole && !item.roles.includes(userRole)) {
      return null;
    }
    if (item.type === "separator") {
      if (collapsed) return null;
      return /* @__PURE__ */ jsxRuntime.jsx("li", { className: "none text-gray-100", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" }) }, `sep-${index}`);
    }
    if (item.type === "link") {
      const active = isActive(item.path);
      return /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs(
        LinkComponent,
        {
          to: item.path,
          onClick: (e) => {
            if (onNavigate && item.path) {
              onNavigate(item.path);
            }
          },
          className: `group relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 ${active ? "bg-gradient-to-r from-blue-400/20 to-blue-400/20 shadow-lg shadow-blue-500/30" : "hover:bg-white/5 hover:shadow-md hover:shadow-blue-500/10"}`,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: `flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${active ? "" : ""}`,
                children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: item.icon || "\u{1F4C4}" })
              }
            ),
            !collapsed && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold text-sm tracking-wide", children: translate(item.label) }),
            active && !collapsed && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ml-auto w-2 h-2 bg-white rounded-full animate-pulse" })
          ]
        }
      ) }, item.id || item.path || index);
    }
    if (item.type === "dropdown") {
      const anyChildActive = isChildActive(item);
      const isOpen = openMenu === item.id;
      return /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          ref: (el) => buttonRefs.current[item.id] = el,
          onClick: (e) => toggleMenu(item.id, e.currentTarget),
          className: `group w-full relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 text-left ${isOpen || anyChildActive ? "bg-gradient-to-r from-blue-400/20 to-blue-400/20 shadow-lg shadow-blue-500/30" : "hover:bg-white/5 hover:shadow-md hover:shadow-blue-500/10"}`,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: `flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200`,
                children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: item.icon || "\u{1F4C1}" })
              }
            ),
            !collapsed && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold text-sm tracking-wide flex-1", children: translate(item.label) }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: `transition-transform duration-300 text-xs ${isOpen ? "rotate-90" : ""}`,
                  children: "\u25B8"
                }
              )
            ] })
          ]
        }
      ) }, item.id || index);
    }
    return null;
  };
  const renderPortalMenus = () => {
    return items.map((item) => {
      if (item.type !== "dropdown" || !item.children || !item.id) return null;
      if (openMenu !== item.id || !anchorRect) return null;
      const visibleChildren = item.children.filter((child) => {
        if (!child.roles || child.roles.length === 0) return true;
        if (!userRole) return false;
        return child.roles.includes(userRole);
      });
      if (visibleChildren.length === 0) return null;
      return reactDom.createPortal(
        /* @__PURE__ */ jsxRuntime.jsx(
          "ul",
          {
            "data-portal": "true",
            className: "fixed bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl shadow-blue-500/20 z-50 min-w-max overflow-hidden transition-colors",
            style: {
              left: `${anchorRect.right + 12}px`,
              top: `${anchorRect.top}px`
            },
            children: visibleChildren.map((child, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === visibleChildren.length - 1;
              if (child.type === "separator") {
                return /* @__PURE__ */ jsxRuntime.jsx("li", { className: "border-t border-gray-200/50 dark:border-white/10" }, idx);
              }
              return /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs(
                LinkComponent,
                {
                  to: child.path,
                  onClick: () => {
                    setOpenMenu(null);
                    if (onNavigate && child.path) onNavigate(child.path);
                  },
                  className: `group flex items-center gap-3 px-5 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 transition-all duration-200 ${isFirst ? "first:rounded-t-2xl" : ""} ${isLast ? "last:rounded-b-2xl" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl group-hover:scale-110 transition-transform", children: child.icon || "\u2022" }),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold text-sm", children: translate(child.label) })
                  ]
                }
              ) }, child.id || child.path || idx);
            })
          },
          `menu-${item.id}`
        ),
        document.body
      );
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: `fixed top-0 left-0 h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white z-40 transition-all duration-300 overflow-y-auto overflow-x-hidden ${collapsed ? "w-20" : "w-72"}`,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: `relative flex items-center ${collapsed ? "justify-center" : "justify-between"} p-5 border-b border-white/10 backdrop-blur-sm`,
              children: [
                logoContent,
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    onClick: toggleSidebar,
                    className: "relative hover:bg-white/10 rounded-lg transition-all duration-200 group z-20 focus:outline-none focus:ring-2 focus:ring-white/30 p-1",
                    title: collapsed ? translate("nav.expand") : translate("nav.collapse"),
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" }),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        "svg",
                        {
                          className: "relative w-5 h-5 text-white",
                          viewBox: "0 0 20 20",
                          fill: "currentColor",
                          children: /* @__PURE__ */ jsxRuntime.jsx(
                            "path",
                            {
                              fillRule: "evenodd",
                              d: "M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z",
                              clipRule: "evenodd"
                            }
                          )
                        }
                      )
                    ]
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "relative space-y-1 mt-4", children: [
            filteredItems.map(renderItem),
            onLogout && /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: onLogout,
                className: "group w-full relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 mt-2",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xl", children: "\u{1F6AA}" }) }),
                  !collapsed && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold text-sm tracking-wide", children: translate("nav.logout") })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600" })
        ]
      }
    ),
    renderPortalMenus()
  ] });
};
var CSS = /* @__PURE__ */ Object.freeze({
  Translate: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        x,
        y
      } = transform;
      return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
    }
  },
  Scale: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        scaleX,
        scaleY
      } = transform;
      return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }
  },
  Transform: {
    toString(transform) {
      if (!transform) {
        return;
      }
      return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(" ");
    }
  },
  Transition: {
    toString(_ref) {
      let {
        property,
        duration,
        easing
      } = _ref;
      return property + " " + duration + "ms " + easing;
    }
  }
});
function KanbanCard({ item, onClick, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = sortable.useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab"
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: setNodeRef,
      ...attributes,
      ...listeners,
      className: chunkG4EIC5OB_js.cn(
        "dui-kanban-card card mb-2 shadow-sm border-0",
        isOverlay && "dui-kanban-card-overlay",
        isDragging && "dui-kanban-card-dragging"
      ),
      onClick: () => onClick && onClick(item),
      style: {
        ...style,
        borderRadius: "8px",
        borderLeft: item.color ? `4px solid ${item.color}` : "none",
        transition: "all 0.2s ease"
      },
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "card-body p-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "d-flex justify-content-between align-items-start mb-2", children: /* @__PURE__ */ jsxRuntime.jsx("h6", { className: "card-title fw-bold text-truncate mb-0", style: { maxWidth: "90%", fontSize: "0.9rem" }, title: item.title, children: item.title }) }),
        item.subtitle && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "card-subtitle text-muted mb-2", style: { fontSize: "0.75rem", lineHeight: "1.2" }, children: item.subtitle }),
        item.metadata && Object.keys(item.metadata).length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-kanban-card-metadata mb-2", children: Object.entries(item.metadata).map(([key, value]) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-secondary d-flex justify-content-between", style: { fontSize: "0.7rem" }, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-muted dark:text-gray-400", children: [
            key,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "fw-medium text-dark dark:text-gray-200", children: String(value) })
        ] }, key)) }),
        item.tags && item.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "d-flex flex-wrap gap-1 mt-auto", children: item.tags.map((tag, idx) => /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "badge rounded-pill",
            style: {
              backgroundColor: tag.color ? `${tag.color}15` : "var(--bg-tertiary)",
              color: tag.color || "var(--text-secondary)",
              fontSize: "0.65rem",
              fontWeight: 600,
              border: tag.color ? `1px solid ${tag.color}30` : "1px solid var(--border-color)"
            },
            children: tag.label
          },
          idx
        )) })
      ] })
    }
  );
}
function KanbanColumn({ definition, items, onCardClick }) {
  const { setNodeRef, isOver } = core.useDroppable({
    id: definition.id
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: chunkG4EIC5OB_js.cn(
        "dui-kanban-column d-flex flex-column h-100",
        isOver && "dui-kanban-column-over"
      ),
      style: {
        minWidth: "300px",
        maxWidth: "300px",
        backgroundColor: "var(--bg-tertiary)",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        transition: "background-color 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: "p-3 border-bottom d-flex justify-content-between align-items-center",
            style: {
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              borderTop: `4px solid ${definition.color || "#9ca3af"}`,
              backgroundColor: "var(--bg-primary)"
            },
            children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "fw-bold text-primary dark:text-gray-100", style: { fontSize: "0.85rem", letterSpacing: "0.025em" }, children: definition.title }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: "badge rounded-pill bg-light dark:bg-gray-700 text-muted dark:text-gray-300 border dark:border-gray-600",
                  style: { fontSize: "0.7rem", fontWeight: 600 },
                  children: items.length
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            ref: setNodeRef,
            className: "flex-grow-1 p-2 dui-kanban-column-body",
            style: {
              overflowY: "auto",
              minHeight: "200px",
              backgroundColor: isOver ? "var(--primary-50)" : "transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(sortable.SortableContext, { items: items.map((i) => i.id), strategy: sortable.verticalListSortingStrategy, children: items.map((item) => /* @__PURE__ */ jsxRuntime.jsx(KanbanCard, { item, onClick: onCardClick }, item.id)) }),
              items.length === 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center text-muted mt-5", style: { fontSize: "0.75rem", opacity: 0.5 }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 2v20M2 12h20" }) }) }),
                "Sin elementos"
              ] })
            ]
          }
        )
      ]
    }
  );
}
function KanbanBoard({ columns, items, onItemMove, onCardClick }) {
  const [activeId, setActiveId] = React2.useState(null);
  const sensors = core.useSensors(
    core.useSensor(core.PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  );
  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeItem2 = items.find((i) => i.id === active.id);
    if (!activeItem2) return;
    let newStatus = "";
    const overColumn = columns.find((c) => c.id === over.id);
    if (overColumn) {
      newStatus = overColumn.id;
    } else {
      const overItem = items.find((i) => i.id === over.id);
      if (overItem) {
        newStatus = overItem.status;
      }
    }
    if (newStatus && newStatus !== activeItem2.status) {
      onItemMove(active.id, newStatus);
    }
  };
  const getItemsForColumn = (columnId) => {
    return items.filter((i) => i.status.toLowerCase() === columnId.toLowerCase());
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-kanban-board d-flex flex-nowrap gap-4 h-100 p-3", style: { overflowX: "auto", alignItems: "flex-start" }, children: /* @__PURE__ */ jsxRuntime.jsxs(
    core.DndContext,
    {
      sensors,
      collisionDetection: core.closestCenter,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      children: [
        columns.map((col) => /* @__PURE__ */ jsxRuntime.jsx(
          KanbanColumn,
          {
            definition: col,
            items: getItemsForColumn(col.id),
            onCardClick
          },
          col.id
        )),
        /* @__PURE__ */ jsxRuntime.jsx(core.DragOverlay, { children: activeItem ? /* @__PURE__ */ jsxRuntime.jsx("div", { style: { opacity: 0.8, transform: "rotate(2deg)" }, children: /* @__PURE__ */ jsxRuntime.jsx(KanbanCard, { item: activeItem, isOverlay: true }) }) : null })
      ]
    }
  ) });
}
function KanbanRenderer({
  columns,
  data,
  mapRecord,
  mapping = {},
  onItemMove,
  onCardClick,
  loading
}) {
  const items = React2.useMemo(() => {
    return data.map((record) => {
      if (mapRecord) return mapRecord(record);
      const idKey = mapping.id || "id";
      const titleKey = mapping.title || "name";
      const subtitleKey = mapping.subtitle || "description";
      const statusKey = mapping.status || "status";
      const colorKey = mapping.color || "color";
      return {
        id: record[idKey],
        title: record[titleKey],
        subtitle: record[subtitleKey],
        status: String(record[statusKey]).toLowerCase(),
        color: record[colorKey],
        originalData: record
      };
    });
  }, [data, mapRecord, mapping]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "d-flex justify-content-center align-items-center h-100 py-5", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "spinner-border text-primary", role: "status", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dui-kanban-renderer h-100", style: { minHeight: "500px" }, children: /* @__PURE__ */ jsxRuntime.jsx(
    KanbanBoard,
    {
      columns,
      items,
      onItemMove: (id, status) => onItemMove?.(id, status),
      onCardClick
    }
  ) });
}
function AdvancedSearchModal({
  open,
  title = "",
  fields,
  currentFilters = [],
  onClose,
  onApply,
  onFilterChange,
  inline = false,
  excludeFields = [],
  renderField
}) {
  const { t: t6 } = chunk4GBTIAHZ_js.useI18n();
  const modalTitle = title || t6("advanced_search.title", { default: "B\xFAsqueda Avanzada" });
  const [state, setState] = React2.useState({});
  const [operators, setOperators] = React2.useState({});
  const visibleFields = fields.filter(
    (f) => !f.excludeFromAdvancedSearch && !excludeFields.includes(f.name)
  );
  const OPERATORS_BY_TYPE = {
    string: [
      { value: "contains", label: t6("operators.contains", { default: "Contiene" }) },
      { value: "equals", label: t6("operators.equals", { default: "Igual a" }) },
      { value: "startsWith", label: t6("operators.startsWith", { default: "Empieza con" }) },
      { value: "endsWith", label: t6("operators.endsWith", { default: "Termina con" }) },
      { value: "ne", label: t6("operators.ne", { default: "Distinto de" }) }
    ],
    number: [
      { value: "equals", label: t6("operators.equals", { default: "Igual a" }) },
      { value: "gt", label: t6("operators.gt", { default: "Mayor que" }) },
      { value: "gte", label: t6("operators.gte", { default: "Mayor o igual" }) },
      { value: "lt", label: t6("operators.lt", { default: "Menor que" }) },
      { value: "lte", label: t6("operators.lte", { default: "Menor o igual" }) },
      { value: "between", label: t6("operators.between", { default: "Entre" }) },
      { value: "ne", label: t6("operators.ne", { default: "Distinto de" }) }
    ],
    range: [
      { value: "between", label: t6("operators.between", { default: "Entre" }) },
      { value: "equals", label: t6("operators.equals", { default: "Igual a" }) },
      { value: "gt", label: t6("operators.gt", { default: "Mayor que" }) },
      { value: "gte", label: t6("operators.gte", { default: "Mayor o igual" }) },
      { value: "lt", label: t6("operators.lt", { default: "Menor que" }) },
      { value: "lte", label: t6("operators.lte", { default: "Menor o igual" }) },
      { value: "ne", label: t6("operators.ne", { default: "Distinto de" }) }
    ],
    date: [
      { value: "between", label: t6("operators.between", { default: "Entre" }) },
      { value: "equals", label: t6("operators.equals", { default: "Igual a" }) },
      { value: "gt", label: t6("operators.after", { default: "Posterior a" }) },
      { value: "gte", label: t6("operators.from", { default: "Desde" }) },
      { value: "lt", label: t6("operators.before", { default: "Anterior a" }) },
      { value: "lte", label: t6("operators.until", { default: "Hasta" }) }
    ],
    boolean: [
      { value: "equals", label: t6("operators.is", { default: "Es" }) }
    ],
    select: [
      { value: "in", label: t6("operators.in", { default: "En lista" }) },
      { value: "equals", label: t6("operators.equals", { default: "Igual a" }) },
      { value: "ne", label: t6("operators.ne", { default: "Distinto de" }) },
      { value: "not_in", label: t6("operators.not_in", { default: "No en lista" }) }
    ]
  };
  const currentFiltersRef = React2__default.default.useRef(currentFilters);
  React2.useEffect(() => {
    currentFiltersRef.current = currentFilters;
  }, [currentFilters]);
  React2.useEffect(() => {
    if (!open) return;
    const s = {};
    const ops = {};
    visibleFields.forEach((f) => {
      s[f.name] = f.type === "boolean" ? "any" : f.type === "range" || f.type === "date" ? ["", ""] : "";
      if (f.type === "range" || f.type === "date") ops[f.name] = "between";
      else if (f.type === "string") ops[f.name] = "contains";
      else if (f.type === "select") ops[f.name] = "in";
      else ops[f.name] = "equals";
    });
    if (Array.isArray(currentFilters) && currentFilters.length > 0) {
      currentFilters.forEach((f) => {
        if (!f.field) return;
        const fieldConfig = visibleFields.find((field) => field.name === f.field);
        if (!fieldConfig) return;
        let val = f.value;
        if (fieldConfig.type === "boolean") {
          val = String(val);
        }
        s[f.field] = val;
        if (f.operator) ops[f.field] = f.operator;
      });
    }
    setState(s);
    setOperators(ops);
  }, [open, currentFilters, fields]);
  const getFiltersFromState = () => {
    const filters = [];
    visibleFields.forEach((f) => {
      const val = state[f.name];
      const op = operators[f.name] || "equals";
      if (val === "" || val === void 0 || val === null) return;
      if (Array.isArray(val) && val.every((v) => v === "" || v === null || v === void 0)) return;
      if (f.type === "boolean" && val === "any") return;
      if (op === "between" && (f.type === "range" || f.type === "date" || f.type === "number")) {
        if (Array.isArray(val) && val.length === 2) {
          const hasMin = val[0] !== "" && val[0] !== null && val[0] !== void 0;
          const hasMax = val[1] !== "" && val[1] !== null && val[1] !== void 0;
          if (hasMin && hasMax) {
            filters.push({ field: f.name, operator: "between", value: f.type === "date" ? val : [Number(val[0]), Number(val[1])], label: f.label });
          } else if (hasMin) {
            filters.push({ field: f.name, operator: "gte", value: f.type === "date" ? val[0] : Number(val[0]), label: f.label });
          } else if (hasMax) {
            filters.push({ field: f.name, operator: "lte", value: f.type === "date" ? val[1] : Number(val[1]), label: f.label });
          }
        }
        return;
      }
      if ((op === "in" || op === "not_in") && f.type === "select") {
        if (Array.isArray(val) && val.length > 0) {
          filters.push({ field: f.name, operator: op, value: val, label: f.label });
        } else if (val && !Array.isArray(val)) {
          filters.push({ field: f.name, operator: op, value: [val], label: f.label });
        }
        return;
      }
      let finalVal = val;
      if (f.type === "number" || f.type === "range") {
        if (Array.isArray(val)) finalVal = Number(val[0]);
        else finalVal = Number(val);
      }
      if (f.type === "boolean") {
        finalVal = val === "true";
      }
      filters.push({ field: f.name, operator: op, value: finalVal, label: f.label });
    });
    return filters;
  };
  React2.useEffect(() => {
    if (!onFilterChange) return;
    const filters = getFiltersFromState();
    const areFiltersEqual = (f1, f2) => {
      if (!f1 || !f2) return false;
      if (f1.length !== f2.length) return false;
      const s1 = [...f1].sort((a, b) => a.field.localeCompare(b.field));
      const s2 = [...f2].sort((a, b) => a.field.localeCompare(b.field));
      for (let i = 0; i < s1.length; i++) {
        if (s1[i].field !== s2[i].field) return false;
        if (s1[i].operator !== s2[i].operator) return false;
        const v1 = s1[i].value;
        const v2 = s2[i].value;
        if (Array.isArray(v1) && Array.isArray(v2)) {
          if (v1.length !== v2.length) return false;
          if (v1.some((v, idx) => String(v) !== String(v2[idx]))) return false;
        } else if (String(v1) !== String(v2)) {
          return false;
        }
      }
      return true;
    };
    if (!areFiltersEqual(filters, currentFiltersRef.current || [])) {
      onFilterChange(filters);
    }
  }, [state, operators, visibleFields, onFilterChange]);
  if (!open && !inline) return null;
  const handleChange = (name, value) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };
  const handleOperatorChange = (name, op) => {
    setOperators((prev) => ({ ...prev, [name]: op }));
  };
  const handleApply = () => {
    onApply(getFiltersFromState());
    onClose();
  };
  const handleClear = () => {
    const s = {};
    const ops = {};
    visibleFields.forEach((f) => {
      s[f.name] = f.type === "boolean" ? "any" : f.type === "range" || f.type === "date" ? ["", ""] : "";
      if (f.type === "range" || f.type === "date") ops[f.name] = "between";
      else if (f.type === "string") ops[f.name] = "contains";
      else if (f.type === "select") ops[f.name] = "in";
      else ops[f.name] = "equals";
    });
    setState(s);
    setOperators(ops);
  };
  const inner = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: visibleFields.map((f) => {
      const op = operators[f.name];
      const isBetween = op === "between";
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn(f.colSpan === 2 ? "col-span-1 md:col-span-2" : ""), children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex justify-between items-center mb-1", children: /* @__PURE__ */ jsxRuntime.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: f.label }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "select",
            {
              className: "w-1/3 h-10 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-100",
              value: op,
              onChange: (e) => handleOperatorChange(f.name, e.target.value),
              children: OPERATORS_BY_TYPE[f.type === "range" ? "range" : f.type === "date" ? "date" : f.type === "select" ? "select" : f.type === "number" ? "number" : f.type === "boolean" ? "boolean" : "string"]?.map((o) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: o.value, children: o.label }, o.value))
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: (() => {
            const custom = renderField ? renderField(f, state[f.name], (val) => handleChange(f.name, val)) : null;
            if (custom) return custom;
            return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              (f.type === "string" || f.type === "number" && !isBetween) && /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: f.type === "number" ? "number" : "text",
                  className: "v2-input",
                  placeholder: f.placeholder || f.label,
                  value: Array.isArray(state[f.name]) ? state[f.name][0] : state[f.name] || "",
                  onChange: (e) => {
                    if (f.type === "range" || f.type === "number") {
                      const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : [state[f.name] || "", ""];
                      cur[0] = e.target.value;
                      handleChange(f.name, cur);
                    } else {
                      handleChange(f.name, e.target.value);
                    }
                  }
                }
              ),
              f.type === "date" && !isBetween && /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: "date",
                  className: "v2-input",
                  value: Array.isArray(state[f.name]) ? state[f.name][0] || "" : state[f.name] || "",
                  onChange: (e) => {
                    const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ["", ""];
                    cur[0] = e.target.value;
                    handleChange(f.name, cur);
                  }
                }
              ),
              (f.type === "date" || f.type === "range" || f.type === "number") && isBetween && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: f.type === "date" ? "date" : "number",
                    className: "v2-input",
                    value: Array.isArray(state[f.name]) ? state[f.name][0] || "" : "",
                    onChange: (e) => {
                      const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ["", ""];
                      cur[0] = e.target.value;
                      if (f.type === "date" && cur[0] && !cur[1]) cur[1] = cur[0];
                      handleChange(f.name, cur);
                    },
                    placeholder: t6("filters.min", { default: "Min" })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: f.type === "date" ? "date" : "number",
                    className: "v2-input",
                    value: Array.isArray(state[f.name]) ? state[f.name][1] || "" : "",
                    onChange: (e) => {
                      const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ["", ""];
                      cur[1] = e.target.value;
                      if (f.type === "date" && cur[1] && !cur[0]) cur[0] = cur[1];
                      handleChange(f.name, cur);
                    },
                    placeholder: t6("filters.max", { default: "Max" })
                  }
                )
              ] }),
              f.type === "select" && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsxs(
                  "select",
                  {
                    className: "v2-input",
                    value: !Array.isArray(state[f.name]) && state[f.name] ? state[f.name] : "",
                    onChange: (e) => {
                      const val = e.target.value;
                      if (val === "") return;
                      const isMulti = op === "in" || op === "not_in";
                      if (isMulti) {
                        const current = Array.isArray(state[f.name]) ? state[f.name] : state[f.name] ? [state[f.name]] : [];
                        if (!current.includes(val)) {
                          handleChange(f.name, [...current, val]);
                        }
                      } else {
                        handleChange(f.name, val);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: t6("filters.any", { default: "Cualquiera" }) }),
                      f.options?.map((o) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: o.value, children: o.label }, String(o.value)))
                    ]
                  }
                ),
                (op === "in" || op === "not_in") && Array.isArray(state[f.name]) && state[f.name].length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: state[f.name].map((v) => {
                  const opt = f.options?.find((o) => String(o.value) === String(v));
                  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800", children: [
                    opt?.label || v,
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const next = state[f.name].filter((x) => x !== v);
                          handleChange(f.name, next.length > 0 ? next : "");
                        },
                        className: "ml-1 text-blue-600 hover:text-blue-900 focus:outline-none",
                        children: "\u2715"
                      }
                    )
                  ] }, String(v));
                }) })
              ] }),
              f.type === "boolean" && /* @__PURE__ */ jsxRuntime.jsxs(
                "select",
                {
                  className: "v2-input",
                  value: state[f.name] ?? "any",
                  onChange: (e) => handleChange(f.name, e.target.value),
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx("option", { value: "any", children: t6("filters.any", { default: "Cualquiera" }) }),
                    /* @__PURE__ */ jsxRuntime.jsx("option", { value: "true", children: t6("common.yes", { default: "S\xED" }) }),
                    /* @__PURE__ */ jsxRuntime.jsx("option", { value: "false", children: t6("common.no", { default: "No" }) })
                  ]
                }
              )
            ] });
          })() })
        ] })
      ] }, f.name);
    }) }),
    !inline && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-center pt-6 border-t dark:border-gray-700 mt-6", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          type: "button",
          className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          onClick: handleClear,
          children: t6("common.clear", { default: "Limpiar" })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            onClick: onClose,
            children: t6("common.cancel", { default: "Cancelar" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            onClick: handleApply,
            children: t6("common.apply", { default: "Aplicar" })
          }
        )
      ] })
    ] })
  ] });
  if (inline) {
    return inner;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "fixed inset-0 z-[100] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity", onClick: onClose }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "relative min-h-screen flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: modalTitle }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "text-gray-400 hover:text-gray-500 transition-colors",
            children: /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      inner
    ] }) })
  ] });
}

exports.AdvancedSearchModal = AdvancedSearchModal;
exports.DynamicModal = DynamicModal;
exports.FormRenderer = FormRenderer;
exports.KanbanRenderer = KanbanRenderer;
exports.SidebarRenderer = SidebarRenderer;
exports.TabRenderer = TabRenderer;
exports.TableRenderer = TableRenderer;
exports.TableToolbar = TableToolbar;
//# sourceMappingURL=chunk-IVPWWQWL.js.map
//# sourceMappingURL=chunk-IVPWWQWL.js.map