'use strict';

// src/config-system/ConfigParser.ts
function toTitleCase(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().replace(/^\w/, (c) => c.toUpperCase()).replace(/\s\w/g, (c) => c.toUpperCase());
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
function normalizeValidationRule(rule) {
  if (!rule || typeof rule !== "object") return null;
  const r = rule;
  if ("type" in r && typeof r.type === "string") {
    return {
      type: r.type,
      value: r.value,
      message: typeof r.message === "string" ? r.message : void 0
    };
  }
  const rules = [];
  if ("required" in r && r.required) {
    rules.push({ type: "required", message: typeof r.message === "string" ? r.message : void 0 });
  }
  if ("min" in r && typeof r.min === "number") {
    rules.push({ type: "min", value: r.min });
  }
  if ("max" in r && typeof r.max === "number") {
    rules.push({ type: "max", value: r.max });
  }
  if ("minLength" in r && typeof r.minLength === "number") {
    rules.push({ type: "minLength", value: r.minLength });
  }
  if ("maxLength" in r && typeof r.maxLength === "number") {
    rules.push({ type: "maxLength", value: r.maxLength });
  }
  if ("pattern" in r && typeof r.pattern === "string") {
    rules.push({ type: "pattern", value: r.pattern });
  }
  if ("email" in r && r.email) {
    rules.push({ type: "email" });
  }
  if ("url" in r && r.url) {
    rules.push({ type: "url" });
  }
  return rules.length > 0 ? rules[0] : null;
}
function normalizeConditionGroup(condition) {
  if (!condition || typeof condition !== "object") return void 0;
  const c = condition;
  if (c.field && typeof c.field === "string") {
    return {
      field: c.field,
      operator: typeof c.operator === "string" ? c.operator : "equals",
      value: c.value
    };
  }
  if (Array.isArray(c.conditions)) {
    return {
      logic: c.logic || "and",
      conditions: c.conditions.map(normalizeConditionGroup).filter((cond) => cond !== void 0)
    };
  }
  return void 0;
}
function normalizeField(raw, options) {
  const {
    defaultRequired = false,
    transformFieldName,
    generateLabels = true,
    fieldNormalizers = {}
  } = options;
  const name = transformFieldName ? transformFieldName(raw.name) : raw.name;
  const normalized = {
    name,
    type: raw.type || "text",
    label: raw.label || (generateLabels ? toTitleCase(name) : name),
    required: raw.required ?? defaultRequired,
    disabled: raw.disabled ?? false,
    readOnly: raw.readOnly ?? false,
    placeholder: raw.placeholder,
    helpText: raw.helpText,
    defaultValue: raw.defaultValue
  };
  if (raw.options) {
    normalized.options = deepClone(raw.options);
  }
  if (raw.entityType) {
    normalized.entityType = raw.entityType;
  }
  if (raw.min !== void 0) normalized.min = raw.min;
  if (raw.max !== void 0) normalized.max = raw.max;
  if (raw.minLength !== void 0) normalized.minLength = raw.minLength;
  if (raw.maxLength !== void 0) normalized.maxLength = raw.maxLength;
  if (raw.validation) {
    if (Array.isArray(raw.validation)) {
      normalized.validation = raw.validation.map(normalizeValidationRule).filter((r) => r !== null);
    } else {
      const rule = normalizeValidationRule(raw.validation);
      if (rule) normalized.validation = [rule];
    }
  }
  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen);
  }
  if (raw.computed && typeof raw.computed === "object") {
    const c = raw.computed;
    if (typeof c.formula === "string" && Array.isArray(c.deps)) {
      normalized.computed = {
        formula: c.formula,
        deps: c.deps.filter((d) => typeof d === "string")
      };
    }
  }
  if (fieldNormalizers[raw.type]) {
    Object.assign(normalized, fieldNormalizers[raw.type](raw));
  }
  const knownKeys = /* @__PURE__ */ new Set([
    "name",
    "type",
    "label",
    "required",
    "disabled",
    "readOnly",
    "placeholder",
    "helperText",
    "defaultValue",
    "options",
    "entityType",
    "min",
    "max",
    "minLength",
    "maxLength",
    "validation",
    "showWhen",
    "computed"
  ]);
  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== void 0) {
      normalized[key] = deepClone(raw[key]);
    }
  }
  return normalized;
}
function normalizeSection(raw, options) {
  const normalized = {
    id: raw.id || (raw.title?.toLowerCase().replace(/\s+/g, "-") ?? "section"),
    title: raw.title ?? "Section",
    description: raw.description,
    collapsible: raw.collapsible ?? false,
    defaultCollapsed: raw.collapsed ?? false,
    fields: raw.fields.map((f) => normalizeField(f, options))
  };
  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen);
  }
  if (raw.columns) {
    normalized.columns = raw.columns;
  }
  return normalized;
}
function normalizeColumn(raw, options) {
  const {
    defaultColumnWidth,
    defaultSortable = true,
    transformColumnKey,
    generateLabels = true,
    columnNormalizers = {}
  } = options;
  const key = transformColumnKey ? transformColumnKey(raw.key) : raw.key;
  const normalized = {
    key,
    accessor: raw.accessor || key,
    header: raw.header || (generateLabels ? toTitleCase(key) : key),
    type: raw.type || "text",
    width: typeof raw.width === "string" || typeof raw.width === "number" ? raw.width : defaultColumnWidth,
    minWidth: raw.minWidth,
    maxWidth: raw.maxWidth,
    sortable: raw.sortable ?? defaultSortable,
    filterable: raw.filterable ?? false,
    visible: raw.hidden ? false : raw.visible ?? true,
    align: raw.align || "left"
  };
  if (raw.format) normalized.format = raw.format;
  if (raw.render) normalized.render = raw.render;
  const type = raw.type || raw.dataType || "text";
  if (columnNormalizers[type]) {
    Object.assign(normalized, columnNormalizers[type](raw));
  }
  normalized.type = type;
  if (raw.showWhen) {
    normalized.showWhen = normalizeConditionGroup(raw.showWhen);
  }
  const knownKeys = /* @__PURE__ */ new Set([
    "key",
    "header",
    "type",
    "width",
    "minWidth",
    "maxWidth",
    "sortable",
    "filterable",
    "hidden",
    "align",
    "format",
    "render",
    "accessor",
    "sortAccessor",
    "filterOptions"
  ]);
  for (const k in raw) {
    if (!knownKeys.has(k) && raw[k] !== void 0) {
      normalized[k] = deepClone(raw[k]);
    }
  }
  return normalized;
}
function parseTableConfig(raw, options = {}) {
  const columns = raw.columns.map((c) => normalizeColumn(c, options));
  const config = {
    columns,
    pagination: raw.pagination,
    selection: raw.selection,
    filters: raw.filters,
    striped: raw.striped,
    bordered: raw.bordered,
    compact: raw.compact,
    hoverable: raw.hoverable,
    emptyMessage: raw.emptyMessage,
    loadingMessage: raw.loadingMessage,
    rowKey: raw.rowKey,
    defaultSortColumn: raw.defaultSortColumn,
    defaultSortDirection: raw.defaultSortDirection
  };
  const knownKeys = /* @__PURE__ */ new Set([
    "columns",
    "pagination",
    "selection",
    "filters",
    "striped",
    "bordered",
    "compact",
    "hoverable",
    "emptyMessage",
    "loadingMessage",
    "rowKey",
    "defaultSortColumn",
    "defaultSortDirection"
  ]);
  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== void 0) {
      config[key] = deepClone(raw[key]);
    }
  }
  return config;
}
function parseFormConfig(raw, options = {}) {
  const sections = raw.sections.map((s) => normalizeSection(s, options));
  const config = {
    id: raw.id || "form",
    title: raw.title || "Form",
    sections,
    submitLabel: raw.submitLabel,
    cancelLabel: raw.cancelLabel,
    showCancel: raw.showCancel,
    size: raw.size,
    validationMode: raw.validationMode
  };
  const knownKeys = /* @__PURE__ */ new Set([
    "id",
    "title",
    "sections",
    "entity",
    "submitLabel",
    "cancelLabel",
    "showCancel",
    "size",
    "validationMode"
  ]);
  for (const key in raw) {
    if (!knownKeys.has(key) && raw[key] !== void 0) {
      config[key] = deepClone(raw[key]);
    }
  }
  return config;
}
function parseConfig(raw, options = {}) {
  if ("columns" in raw) {
    return parseTableConfig(raw, options);
  }
  if ("sections" in raw) {
    return parseFormConfig(raw, options);
  }
  throw new Error('Unknown config type. Must have "columns" (table) or "sections" (form)');
}
var ConfigLoader = class {
  constructor(options = {}) {
    this.cache = /* @__PURE__ */ new Map();
    this.options = {
      basePath: "/configs",
      cache: true,
      validate: true,
      ...options
    };
  }
  /**
   * Load a config from URL or path
   */
  async load(path) {
    if (this.options.cache && this.cache.has(path)) {
      return this.cache.get(path);
    }
    const url = path.startsWith("http") ? path : `${this.options.basePath}/${path}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      const raw = await response.json();
      const parsed = parseConfig(raw, this.options);
      if (this.options.cache) {
        this.cache.set(path, parsed);
      }
      return parsed;
    } catch (error) {
      throw new Error(`Failed to load config from ${path}: ${error}`);
    }
  }
  /**
   * Load multiple configs
   */
  async loadMany(paths) {
    return Promise.all(paths.map((path) => this.load(path)));
  }
  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Remove a specific config from cache
   */
  invalidate(path) {
    this.cache.delete(path);
  }
};
function createConfigLoader(options) {
  return new ConfigLoader(options);
}

// src/config-system/modalConfig.ts
function getModalTitle(title, mode) {
  if (title == null) return "";
  if (typeof title === "string") return title;
  return title[mode] ?? title.edit ?? title.create ?? title.view ?? "";
}
function getModalSubmitLabel(submitLabel, mode) {
  if (submitLabel == null) {
    return mode === "create" ? "Create" : mode === "edit" ? "Save" : "Close";
  }
  if (typeof submitLabel === "string") return submitLabel;
  return submitLabel[mode] ?? submitLabel.edit ?? submitLabel.create ?? "Save";
}
function parseModalConfig(raw, mode, options = {}) {
  const rawForm = {
    id: raw.id,
    title: getModalTitle(raw.title, mode),
    sections: raw.sections && raw.sections.length > 0 ? raw.sections : raw.fields && raw.fields.length > 0 ? [
      {
        id: "default",
        title: "",
        columns: raw.columns ?? 2,
        fields: raw.fields
      }
    ] : []
  };
  const formConfig = parseFormConfig(rawForm, options);
  return {
    formConfig,
    title: getModalTitle(raw.title, mode),
    submitLabel: getModalSubmitLabel(raw.footer?.submitLabel, mode),
    cancelLabel: raw.footer?.cancelLabel,
    size: raw.size,
    subtitle: raw.subtitle,
    icon: raw.icon,
    showCloseButton: raw.showCloseButton,
    closeOnEscape: raw.closeOnEscape,
    closeOnBackdrop: raw.closeOnBackdrop
  };
}

exports.ConfigLoader = ConfigLoader;
exports.createConfigLoader = createConfigLoader;
exports.getModalSubmitLabel = getModalSubmitLabel;
exports.getModalTitle = getModalTitle;
exports.parseConfig = parseConfig;
exports.parseFormConfig = parseFormConfig;
exports.parseModalConfig = parseModalConfig;
exports.parseTableConfig = parseTableConfig;
//# sourceMappingURL=chunk-USZU7PLJ.js.map
//# sourceMappingURL=chunk-USZU7PLJ.js.map