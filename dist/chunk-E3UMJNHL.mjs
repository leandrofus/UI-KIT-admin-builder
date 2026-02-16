// src/config-system/ConfigValidator.ts
var DEFAULT_FIELD_TYPES = [
  "text",
  "number",
  "email",
  "password",
  "tel",
  "url",
  "textarea",
  "select",
  "multiselect",
  "checkbox",
  "radio",
  "switch",
  "date",
  "datetime",
  "time",
  "file",
  "image",
  "currency",
  "percent",
  "hidden",
  "entity",
  "generic"
];
var DEFAULT_COLUMN_TYPES = [
  "text",
  "number",
  "currency",
  "percent",
  "date",
  "datetime",
  "boolean",
  "badge",
  "link",
  "image",
  "actions",
  "custom"
];
function createError(path, message, severity = "error", suggestion) {
  return { path, message, severity, suggestion };
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function isValidArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function validateValidationRule(rule, path) {
  const errors = [];
  if (!isObject(rule)) {
    errors.push(createError(path, "Validation rule must be an object"));
    return errors;
  }
  const r = rule;
  const knownRules = [
    "required",
    "min",
    "max",
    "minLength",
    "maxLength",
    "pattern",
    "email",
    "url",
    "custom",
    "match"
  ];
  const hasKnownRule = knownRules.some((k) => k in r);
  if (!hasKnownRule) {
    errors.push(createError(
      path,
      "Validation rule has no known validation type",
      "warning",
      `Add one of: ${knownRules.join(", ")}`
    ));
  }
  if ("min" in r && typeof r.min !== "number") {
    errors.push(createError(`${path}.min`, "min must be a number"));
  }
  if ("max" in r && typeof r.max !== "number") {
    errors.push(createError(`${path}.max`, "max must be a number"));
  }
  if ("minLength" in r && typeof r.minLength !== "number") {
    errors.push(createError(`${path}.minLength`, "minLength must be a number"));
  }
  if ("maxLength" in r && typeof r.maxLength !== "number") {
    errors.push(createError(`${path}.maxLength`, "maxLength must be a number"));
  }
  if ("pattern" in r && typeof r.pattern !== "string") {
    errors.push(createError(`${path}.pattern`, "pattern must be a string (regex)"));
  }
  if ("custom" in r && typeof r.custom !== "function") {
    errors.push(createError(
      `${path}.custom`,
      "custom must be a function",
      "warning",
      "Custom validators in JSON configs will be ignored"
    ));
  }
  return errors;
}
function validateConditionGroup(condition, path) {
  const errors = [];
  if (!isObject(condition)) {
    errors.push(createError(path, "Condition must be an object"));
    return errors;
  }
  const c = condition;
  if (!c.field && !c.conditions) {
    errors.push(createError(
      path,
      'Condition must have either "field" or "conditions"',
      "error",
      'For single condition: { field: "status", operator: "eq", value: "active" }'
    ));
  }
  if (c.field) {
    if (!isNonEmptyString(c.field)) {
      errors.push(createError(`${path}.field`, "field must be a non-empty string"));
    }
    if (!c.operator) {
      errors.push(createError(`${path}.operator`, "operator is required"));
    } else {
      const validOperators = ["eq", "neq", "gt", "gte", "lt", "lte", "in", "notIn", "contains", "startsWith", "endsWith", "empty", "notEmpty"];
      if (!validOperators.includes(c.operator)) {
        errors.push(createError(
          `${path}.operator`,
          `Invalid operator: ${c.operator}`,
          "error",
          `Valid operators: ${validOperators.join(", ")}`
        ));
      }
    }
  }
  if (c.conditions) {
    if (!isValidArray(c.conditions)) {
      errors.push(createError(`${path}.conditions`, "conditions must be an array"));
    } else {
      c.conditions.forEach((sub, i) => {
        errors.push(...validateConditionGroup(sub, `${path}.conditions[${i}]`));
      });
    }
    if (c.logic && !["and", "or"].includes(c.logic)) {
      errors.push(createError(
        `${path}.logic`,
        'logic must be "and" or "or"',
        "error"
      ));
    }
  }
  return errors;
}
function validateFieldConfig(field, path, options) {
  const errors = [];
  const knownTypes = options.knownFieldTypes || DEFAULT_FIELD_TYPES;
  if (!isObject(field)) {
    errors.push(createError(path, "Field configuration must be an object"));
    return errors;
  }
  const f = field;
  if (!isNonEmptyString(f.name)) {
    errors.push(createError(`${path}.name`, "name is required and must be a non-empty string"));
  }
  if (!isNonEmptyString(f.type)) {
    errors.push(createError(`${path}.type`, "type is required"));
  } else if (!knownTypes.includes(f.type) && f.type !== "generic") {
    errors.push(createError(
      `${path}.type`,
      `Unknown field type: ${f.type}`,
      "warning",
      `Known types: ${knownTypes.join(", ")}. Use "generic" for custom types.`
    ));
  }
  if (!f.label) {
    errors.push(createError(
      `${path}.label`,
      "label is recommended for accessibility",
      "warning"
    ));
  }
  if (["select", "multiselect", "radio"].includes(f.type)) {
    if (!f.options && !f.entityType) {
      errors.push(createError(
        `${path}.options`,
        `${f.type} field requires options or entityType`,
        "error"
      ));
    }
  }
  if (f.validation) {
    if (isValidArray(f.validation)) {
      f.validation.forEach((rule, i) => {
        errors.push(...validateValidationRule(rule, `${path}.validation[${i}]`));
      });
    } else if (isObject(f.validation)) {
      errors.push(...validateValidationRule(f.validation, `${path}.validation`));
    }
  }
  if (f.showWhen) {
    errors.push(...validateConditionGroup(f.showWhen, `${path}.showWhen`));
  }
  if (f.computed) {
    if (!isObject(f.computed)) {
      errors.push(createError(`${path}.computed`, "computed must be an object"));
    } else {
      const c = f.computed;
      if (!isNonEmptyString(c.formula)) {
        errors.push(createError(`${path}.computed.formula`, "computed.formula is required"));
      }
      if (!isValidArray(c.deps)) {
        errors.push(createError(`${path}.computed.deps`, "computed.deps must be an array of field names"));
      }
    }
  }
  if (f.format) {
    if (!isObject(f.format)) {
      errors.push(createError(`${path}.format`, "format must be an object"));
    } else {
      const fmt = f.format;
      if (fmt.toFixed !== void 0) {
        if (!Number.isInteger(fmt.toFixed) || fmt.toFixed < 0) {
          errors.push(createError(`${path}.format.toFixed`, "format.toFixed must be an integer >= 0"));
        }
      }
    }
  }
  return errors;
}
function validateFormSection(section, path, options) {
  const errors = [];
  if (!isObject(section)) {
    errors.push(createError(path, "Section must be an object"));
    return errors;
  }
  const s = section;
  if (!isValidArray(s.fields)) {
    errors.push(createError(`${path}.fields`, "fields is required and must be an array"));
  } else if (s.fields.length === 0) {
    errors.push(createError(`${path}.fields`, "fields array is empty", "warning"));
  } else {
    s.fields.forEach((field, i) => {
      errors.push(...validateFieldConfig(field, `${path}.fields[${i}]`, options));
    });
  }
  if (s.showWhen) {
    errors.push(...validateConditionGroup(s.showWhen, `${path}.showWhen`));
  }
  return errors;
}
function validateColumnConfig(column, path, options) {
  const errors = [];
  const knownTypes = options.knownColumnTypes || DEFAULT_COLUMN_TYPES;
  if (!isObject(column)) {
    errors.push(createError(path, "Column configuration must be an object"));
    return errors;
  }
  const c = column;
  if (!isNonEmptyString(c.key)) {
    errors.push(createError(`${path}.key`, "key is required and must be a non-empty string"));
  }
  if (!isNonEmptyString(c.header)) {
    errors.push(createError(
      `${path}.header`,
      "header is recommended",
      "warning",
      "Will display column key if header is not provided"
    ));
  }
  if (c.type && !knownTypes.includes(c.type) && c.type !== "custom") {
    errors.push(createError(
      `${path}.type`,
      `Unknown column type: ${c.type}`,
      "warning",
      `Known types: ${knownTypes.join(", ")}`
    ));
  }
  if (c.width !== void 0 && typeof c.width !== "number" && typeof c.width !== "string") {
    errors.push(createError(`${path}.width`, "width must be a number or string"));
  }
  return errors;
}
function validateTableConfig(config, options = {}) {
  const errors = [];
  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError("", "Table config must be an object")],
      warnings: []
    };
  }
  const c = config;
  if (!isValidArray(c.columns)) {
    errors.push(createError("columns", "columns is required and must be an array"));
  } else if (c.columns.length === 0) {
    errors.push(createError("columns", "columns array is empty"));
  } else {
    c.columns.forEach((col, i) => {
      errors.push(...validateColumnConfig(col, `columns[${i}]`, options));
    });
    const keys = c.columns.map((col) => col.key);
    const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
    if (duplicates.length > 0) {
      errors.push(createError(
        "columns",
        `Duplicate column keys: ${[...new Set(duplicates)].join(", ")}`,
        "error"
      ));
    }
  }
  if (c.pagination !== void 0 && typeof c.pagination !== "boolean") {
    if (isObject(c.pagination)) {
      const p = c.pagination;
      if (p.pageSize && typeof p.pageSize !== "number") {
        errors.push(createError("pagination.pageSize", "pageSize must be a number"));
      }
    } else {
      errors.push(createError("pagination", "pagination must be boolean or object"));
    }
  }
  if (options.customValidators) {
    for (const [key, validator] of Object.entries(options.customValidators)) {
      const configObj = c;
      if (key in configObj) {
        errors.push(...validator(configObj[key], key));
      }
    }
  }
  const actualErrors = errors.filter((e) => e.severity === "error");
  const warnings = errors.filter((e) => e.severity === "warning");
  return {
    valid: options.strict ? errors.length === 0 : actualErrors.length === 0,
    errors: actualErrors,
    warnings
  };
}
function validateFormConfig(config, options = {}) {
  const errors = [];
  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError("", "Form config must be an object")],
      warnings: []
    };
  }
  const c = config;
  if (!isValidArray(c.sections)) {
    errors.push(createError("sections", "sections is required and must be an array"));
  } else if (c.sections.length === 0) {
    errors.push(createError("sections", "sections array is empty"));
  } else {
    c.sections.forEach((section, i) => {
      errors.push(...validateFormSection(section, `sections[${i}]`, options));
    });
  }
  const allFields = c.sections?.flatMap((s) => s.fields) || [];
  const names = allFields.map((f) => f.name);
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
  if (duplicates.length > 0) {
    errors.push(createError(
      "sections",
      `Duplicate field names: ${[...new Set(duplicates)].join(", ")}`,
      "error"
    ));
  }
  if (!isNonEmptyString(c.id)) {
    errors.push(createError("id", "id is recommended", "warning"));
  }
  if (options.customValidators) {
    for (const [key, validator] of Object.entries(options.customValidators)) {
      const configObj = c;
      if (key in configObj) {
        errors.push(...validator(configObj[key], key));
      }
    }
  }
  const actualErrors = errors.filter((e) => e.severity === "error");
  const warnings = errors.filter((e) => e.severity === "warning");
  return {
    valid: options.strict ? errors.length === 0 : actualErrors.length === 0,
    errors: actualErrors,
    warnings
  };
}
function validateConfig(config, options = {}) {
  if (!isObject(config)) {
    return {
      valid: false,
      errors: [createError("", "Config must be an object")],
      warnings: []
    };
  }
  const c = config;
  if ("columns" in c) {
    return validateTableConfig(config, options);
  }
  if ("sections" in c) {
    return validateFormConfig(config, options);
  }
  return {
    valid: false,
    errors: [createError("", 'Unknown config type. Must have "columns" (table) or "sections" (form)')],
    warnings: []
  };
}
function formatValidationErrors(result) {
  const lines = [];
  if (result.errors.length > 0) {
    lines.push("Errors:");
    result.errors.forEach((e) => {
      lines.push(`  \u2717 ${e.path || "root"}: ${e.message}`);
      if (e.suggestion) {
        lines.push(`    \u2192 ${e.suggestion}`);
      }
    });
  }
  if (result.warnings.length > 0) {
    lines.push("Warnings:");
    result.warnings.forEach((w) => {
      lines.push(`  \u26A0 ${w.path || "root"}: ${w.message}`);
      if (w.suggestion) {
        lines.push(`    \u2192 ${w.suggestion}`);
      }
    });
  }
  return lines.join("\n");
}
function assertValidConfig(config, options = {}) {
  const result = validateConfig(config, options);
  if (!result.valid) {
    throw new Error(`Invalid configuration:
${formatValidationErrors(result)}`);
  }
}

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

export { ConfigLoader, assertValidConfig, createConfigLoader, formatValidationErrors, parseConfig, parseFormConfig, parseTableConfig, validateConfig, validateFormConfig, validateTableConfig };
//# sourceMappingURL=chunk-E3UMJNHL.mjs.map
//# sourceMappingURL=chunk-E3UMJNHL.mjs.map