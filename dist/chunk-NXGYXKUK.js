'use strict';

var chunkG4EIC5OB_js = require('./chunk-G4EIC5OB.js');
var chunk4GBTIAHZ_js = require('./chunk-4GBTIAHZ.js');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var FieldRegistry = class _FieldRegistry {
  constructor(options = {}) {
    this.fields = /* @__PURE__ */ new Map();
    this.options = {
      throwOnDuplicate: false,
      allowOverwrite: true,
      ...options
    };
  }
  /**
   * Register a field type
   */
  register(registration) {
    const { type } = registration;
    if (this.fields.has(type)) {
      if (this.options.throwOnDuplicate && !this.options.allowOverwrite) {
        throw new Error(`Field type "${type}" is already registered`);
      }
      if (!this.options.allowOverwrite) {
        console.warn(`Field type "${type}" already registered, skipping`);
        return this;
      }
    }
    this.fields.set(type, registration);
    return this;
  }
  /**
   * Register multiple field types
   */
  registerMany(registrations) {
    for (const registration of registrations) {
      this.register(registration);
    }
    return this;
  }
  /**
   * Get a field component by type
   */
  get(type) {
    return this.fields.get(type)?.component;
  }
  /**
   * Get full registration info
   */
  getRegistration(type) {
    return this.fields.get(type);
  }
  /**
   * Check if a field type is registered
   */
  has(type) {
    return this.fields.has(type);
  }
  /**
   * Remove a field registration
   */
  unregister(type) {
    return this.fields.delete(type);
  }
  /**
   * Get all registered field types
   */
  getTypes() {
    return Array.from(this.fields.keys());
  }
  /**
   * Get all registrations
   */
  getAll() {
    return Array.from(this.fields.values());
  }
  /**
   * Clear all registrations
   */
  clear() {
    this.fields.clear();
  }
  /**
   * Clone the registry
   */
  clone() {
    const newRegistry = new _FieldRegistry(this.options);
    this.fields.forEach((registration, type) => {
      newRegistry.fields.set(type, { ...registration });
    });
    return newRegistry;
  }
  /**
   * Merge another registry into this one
   */
  merge(other) {
    other.fields.forEach((registration) => {
      this.register(registration);
    });
    return this;
  }
};
var defaultRegistry = null;
function getDefaultRegistry() {
  if (!defaultRegistry) {
    defaultRegistry = new FieldRegistry();
  }
  return defaultRegistry;
}
function setDefaultRegistry(registry) {
  defaultRegistry = registry;
}
function registerField(registration) {
  getDefaultRegistry().register(registration);
}
function registerFields(registrations) {
  getDefaultRegistry().registerMany(registrations);
}
function getField(type) {
  return getDefaultRegistry().get(type);
}
var FieldRegistryContext = React.createContext(null);
function useFieldRegistry() {
  const context = React.useContext(FieldRegistryContext);
  if (!context) {
    return getDefaultRegistry();
  }
  return context;
}
function useFieldFactory(options = {}) {
  const registry = useFieldRegistry();
  const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
  const {
    defaultProps = {},
    wrapper: Wrapper,
    errorComponent: ErrorComponent,
    labelComponent: LabelComponent,
    overrides = {},
    fallback: FallbackComponent
  } = options;
  const isFieldVisible = React.useCallback((field, formData) => {
    if (field.type === "hidden") return false;
    if (field.showWhen) {
      return chunkG4EIC5OB_js.evaluateConditions(field.showWhen, formData);
    }
    return true;
  }, []);
  const getComputedValue = React.useCallback((field, formData) => {
    if (!field.computed || !field.computed.formula) {
      return chunkG4EIC5OB_js.getNestedValue(formData, field.name);
    }
    const { formula, deps } = field.computed;
    const hasAllDeps = deps.every((dep) => {
      const value = chunkG4EIC5OB_js.getNestedValue(formData, dep);
      return value !== void 0 && value !== null && value !== "";
    });
    if (!hasAllDeps) {
      return chunkG4EIC5OB_js.getNestedValue(formData, field.name);
    }
    try {
      const context = {};
      for (const dep of deps) {
        const value = chunkG4EIC5OB_js.getNestedValue(formData, dep);
        context[dep] = typeof value === "number" ? value : parseFloat(String(value)) || 0;
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
      return chunkG4EIC5OB_js.getNestedValue(formData, field.name);
    }
  }, []);
  const renderField = React.useCallback((props) => {
    const {
      field,
      value: propValue,
      formData,
      onChange,
      onBlur,
      errors = {},
      touched = {},
      disabled: formDisabled = false,
      readOnly: formReadOnly = false
    } = props;
    if (!isFieldVisible(field, formData)) {
      return null;
    }
    let Component = overrides[field.name] || overrides[field.type];
    if (!Component) {
      Component = registry.get(field.type);
    }
    if (!Component) {
      if (FallbackComponent) {
        Component = FallbackComponent;
      } else {
        console.warn(`No component registered for field type: ${field.type}`);
        return null;
      }
    }
    const value = field.computed ? getComputedValue(field, formData) : propValue;
    const fieldProps = {
      ...defaultProps,
      field,
      value,
      onChange: (newValue) => onChange(field.name, newValue),
      onBlur: onBlur ? () => onBlur(field.name) : void 0,
      error: errors[field.name],
      touched: touched[field.name],
      formData,
      disabled: formDisabled || field.disabled,
      readOnly: formReadOnly || field.readOnly || !!field.computed
    };
    const fieldElement = React__default.default.createElement(Component, {
      ...fieldProps,
      key: field.name
    });
    const withError = ErrorComponent && errors[field.name] && touched[field.name] ? React__default.default.createElement(
      React__default.default.Fragment,
      null,
      fieldElement,
      React__default.default.createElement(ErrorComponent, { error: errors[field.name] })
    ) : fieldElement;
    const withLabel = LabelComponent ? React__default.default.createElement(
      React__default.default.Fragment,
      null,
      React__default.default.createElement(LabelComponent, { field }),
      withError
    ) : withError;
    if (Wrapper) {
      return React__default.default.createElement(Wrapper, { field, children: withLabel, key: field.name });
    }
    return withLabel;
  }, [
    registry,
    isFieldVisible,
    getComputedValue,
    defaultProps,
    overrides,
    FallbackComponent,
    ErrorComponent,
    LabelComponent,
    Wrapper
  ]);
  const renderSection = React.useCallback((section, formData, handlers) => {
    if (section.showWhen && !chunkG4EIC5OB_js.evaluateConditions(section.showWhen, formData)) {
      return null;
    }
    const fields = section.fields.map(
      (field) => renderField({
        field,
        value: chunkG4EIC5OB_js.getNestedValue(formData, field.name),
        formData,
        ...handlers
      })
    ).filter(Boolean);
    if (fields.length === 0) {
      return null;
    }
    return React__default.default.createElement(
      "div",
      {
        key: section.id || section.title,
        className: "form-section",
        "data-section": section.id || section.title
      },
      section.title && React__default.default.createElement("h3", { className: "section-title" }, typeof section.title === "string" ? t2(section.title) : section.title),
      section.description && React__default.default.createElement("p", { className: "section-description" }, typeof section.description === "string" ? t2(section.description) : section.description),
      React__default.default.createElement("div", { className: "section-fields" }, fields)
    );
  }, [renderField]);
  const renderSections = React.useCallback((sections, formData, handlers) => {
    return sections.map((section) => renderSection(section, formData, handlers)).filter((el) => el !== null);
  }, [renderSection]);
  const getVisibleFields = React.useCallback((sections, formData) => {
    return sections.filter((section) => !section.showWhen || chunkG4EIC5OB_js.evaluateConditions(section.showWhen, formData)).flatMap((section) => section.fields).filter((field) => isFieldVisible(field, formData));
  }, [isFieldVisible]);
  const validateVisibleFields = React.useCallback((sections, formData) => {
    const errors = {};
    const visibleFields = getVisibleFields(sections, formData);
    for (const field of visibleFields) {
      const value = chunkG4EIC5OB_js.getNestedValue(formData, field.name);
      const result = chunkG4EIC5OB_js.validateField(value, field, formData);
      if (!result.valid && result.message) {
        errors[field.name] = result.message;
      }
    }
    return errors;
  }, [getVisibleFields]);
  return {
    renderField,
    renderSection,
    renderSections,
    isFieldVisible,
    getVisibleFields,
    getComputedValue,
    validateVisibleFields
  };
}
function createFieldFactory(options = {}) {
  const { overrides = {}, fallback } = options;
  return {
    /**
     * Get a field component by type
     */
    getComponent(type) {
      return overrides[type] || fallback;
    },
    /**
     * Check if a field type is supported
     */
    isSupported(type) {
      return type in overrides || !!fallback;
    },
    /**
     * Add an override
     */
    addOverride(type, component) {
      overrides[type] = component;
    }
  };
}
var baseInputClass = `
  w-full px-3 py-2 rounded-md border border-gray-300
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  disabled:bg-gray-100 disabled:cursor-not-allowed
  read-only:bg-gray-50
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800 dark:read-only:bg-gray-800
`.trim().replace(/\s+/g, " ");
var errorInputClass = "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:focus:ring-red-700";
var labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
var errorTextClass = "text-sm text-red-500 dark:text-red-400 mt-1";
var helperTextClass = "text-sm text-gray-500 dark:text-gray-400 mt-1";
var TextField = React.forwardRef(
  function TextField2(props, ref) {
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    const {
      field,
      value = "",
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      inputType = "text",
      placeholder,
      maxLength,
      autoFocus,
      prefix,
      suffix
    } = props;
    const hasError = touched && error;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: field.name, className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative flex items-center", children: [
        prefix && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute left-3 text-gray-500", children: prefix }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref,
            type: inputType,
            id: field.name,
            name: field.name,
            value: value ?? "",
            onChange: (e) => onChange(e.target.value),
            onBlur,
            disabled,
            readOnly,
            placeholder: placeholder ? chunk4GBTIAHZ_js.resolveLabel(String(placeholder)) : field.placeholder ? chunk4GBTIAHZ_js.resolveLabel(String(field.placeholder)) : void 0,
            maxLength: maxLength || field.maxLength,
            autoFocus,
            className: chunkG4EIC5OB_js.cn(
              baseInputClass,
              hasError && errorInputClass,
              prefix && "pl-10",
              suffix && "pr-10"
            )
          }
        ),
        suffix && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute right-3 text-gray-500", children: suffix })
      ] }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: chunk4GBTIAHZ_js.resolveLabel(String(field.helpText)) })
    ] });
  }
);
var NumberField = React.forwardRef(
  function NumberField2(props, ref) {
    const {
      field,
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      min,
      max,
      step = 1,
      decimals,
      showSpinner = true
    } = props;
    const hasError = touched && error;
    const handleChange = React.useCallback((e) => {
      const val = e.target.value;
      if (val === "") {
        onChange(void 0);
        return;
      }
      let num = parseFloat(val);
      if (isNaN(num)) return;
      if (decimals !== void 0) {
        num = parseFloat(num.toFixed(decimals));
      }
      onChange(num);
    }, [onChange, decimals]);
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: field.name, className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          ref,
          type: "number",
          id: field.name,
          name: field.name,
          value: value ?? "",
          onChange: handleChange,
          onBlur,
          disabled,
          readOnly,
          min: min ?? field.min,
          max: max ?? field.max,
          step,
          className: chunkG4EIC5OB_js.cn(
            baseInputClass,
            hasError && errorInputClass,
            !showSpinner && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )
        }
      ),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: t2(String(field.helpText)) })
    ] });
  }
);
var CurrencyField = React.forwardRef(
  function CurrencyField2(props, ref) {
    const {
      field,
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      currency = "USD",
      locale = "en-US",
      symbolPosition = "before"
    } = props;
    const [displayValue, setDisplayValue] = React.useState(() => {
      if (value === void 0 || value === null) return "";
      return value.toString();
    });
    const hasError = touched && error;
    const currencySymbol = React.useMemo(() => {
      const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
      const parts = formatter.formatToParts(0);
      return parts.find((p) => p.type === "currency")?.value || "$";
    }, [currency, locale]);
    const handleChange = React.useCallback((e) => {
      const val = e.target.value.replace(/[^0-9.,]/g, "");
      setDisplayValue(val);
      const num = parseFloat(val.replace(",", "."));
      if (!isNaN(num)) {
        onChange(num);
      } else if (val === "") {
        onChange(void 0);
      }
    }, [onChange]);
    const handleBlur = React.useCallback(() => {
      if (value !== void 0 && value !== null) {
        setDisplayValue(value.toFixed(2));
      }
      onBlur?.();
    }, [value, onBlur]);
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: field.name, className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative flex items-center", children: [
        symbolPosition === "before" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute left-3 text-gray-500", children: currencySymbol }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref,
            type: "text",
            inputMode: "decimal",
            id: field.name,
            name: field.name,
            value: displayValue,
            onChange: handleChange,
            onBlur: handleBlur,
            disabled,
            readOnly,
            placeholder: t2("currency.placeholder") || "0.00",
            className: chunkG4EIC5OB_js.cn(
              baseInputClass,
              hasError && errorInputClass,
              symbolPosition === "before" && "pl-8",
              symbolPosition === "after" && "pr-8"
            )
          }
        ),
        symbolPosition === "after" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute right-3 text-gray-500", children: currencySymbol })
      ] }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: t2(String(field.helpText)) })
    ] });
  }
);
var TextareaField = React.forwardRef(
  function TextareaField2(props, ref) {
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    const {
      field,
      value = "",
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      rows = 3,
      autoResize = false,
      maxHeight
    } = props;
    const hasError = touched && error;
    const handleChange = React.useCallback((e) => {
      onChange(e.target.value);
      if (autoResize) {
        e.target.style.height = "auto";
        const newHeight = Math.min(e.target.scrollHeight, maxHeight || Infinity);
        e.target.style.height = `${newHeight}px`;
      }
    }, [onChange, autoResize, maxHeight]);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: field.name, className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "textarea",
        {
          ref,
          id: field.name,
          name: field.name,
          value: value ?? "",
          onChange: handleChange,
          onBlur,
          disabled,
          readOnly,
          rows,
          placeholder: field.placeholder ? chunk4GBTIAHZ_js.resolveLabel(String(field.placeholder)) : void 0,
          className: chunkG4EIC5OB_js.cn(
            baseInputClass,
            hasError && errorInputClass,
            "resize-y"
          ),
          style: autoResize ? { overflow: "hidden" } : void 0
        }
      ),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: t2(String(field.helpText)) })
    ] });
  }
);
var SelectField = React.forwardRef(
  function SelectField2(props, ref) {
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    const {
      field,
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      options: propOptions,
      placeholderOption = "Select...",
      allowEmpty = true
    } = props;
    const hasError = touched && error;
    const options = React.useMemo(() => {
      if (propOptions) return propOptions;
      if (field.options) {
        return field.options.map(
          (opt) => typeof opt === "string" ? { value: opt, label: opt } : opt
        );
      }
      return [];
    }, [propOptions, field.options]);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: field.name, className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "select",
        {
          ref,
          id: field.name,
          name: field.name,
          value: value ?? "",
          onChange: (e) => onChange(e.target.value),
          onBlur,
          disabled: disabled || readOnly,
          className: chunkG4EIC5OB_js.cn(
            baseInputClass,
            hasError && errorInputClass,
            "cursor-pointer"
          ),
          children: [
            allowEmpty && /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: chunk4GBTIAHZ_js.resolveLabel(String(placeholderOption)) }),
            options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(
              "option",
              {
                value: option.value,
                disabled: option.disabled,
                children: chunk4GBTIAHZ_js.resolveLabel(String(option.label))
              },
              option.value
            ))
          ]
        }
      ),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: t2(String(field.helpText)) })
    ] });
  }
);
var CheckboxField = React.forwardRef(
  function CheckboxField2(props, ref) {
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    const {
      field,
      value = false,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      checkboxLabel
    } = props;
    const hasError = touched && error;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref,
            type: "checkbox",
            id: field.name,
            name: field.name,
            checked: !!value,
            onChange: (e) => onChange(e.target.checked),
            onBlur,
            disabled: disabled || readOnly,
            className: chunkG4EIC5OB_js.cn(
              "h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:bg-gray-700",
              "focus:ring-2 focus:ring-blue-500",
              disabled && "cursor-not-allowed opacity-50"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
          t2(String(checkboxLabel || field.label)),
          field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
        ] })
      ] }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: field.helpText })
    ] });
  }
);
var SwitchField = React.forwardRef(
  function SwitchField2(props, ref) {
    const { t: t2 } = chunk4GBTIAHZ_js.useI18n();
    const {
      field,
      value = false,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      onLabel,
      offLabel,
      size = "md"
    } = props;
    const hasError = touched && error;
    const sizes = {
      sm: { track: "w-8 h-4", thumb: "h-3 w-3", translate: "translate-x-4" },
      md: { track: "w-11 h-6", thumb: "h-5 w-5", translate: "translate-x-5" },
      lg: { track: "w-14 h-7", thumb: "h-6 w-6", translate: "translate-x-7" }
    };
    const sizeClasses = sizes[size];
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: chunkG4EIC5OB_js.cn("field-wrapper", className), children: [
      field.label && /* @__PURE__ */ jsxRuntime.jsxs("label", { className: labelClass, children: [
        chunk4GBTIAHZ_js.resolveLabel(String(field.label)),
        field.required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
        offLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: chunk4GBTIAHZ_js.resolveLabel(String(offLabel)) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            ref,
            type: "button",
            role: "switch",
            "aria-checked": value,
            onClick: () => !disabled && !readOnly && onChange(!value),
            onBlur,
            disabled: disabled || readOnly,
            className: chunkG4EIC5OB_js.cn(
              "relative inline-flex shrink-0 cursor-pointer rounded-full",
              "border-2 border-transparent transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              sizeClasses.track,
              value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
              (disabled || readOnly) && "cursor-not-allowed opacity-50"
            ),
            children: /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: chunkG4EIC5OB_js.cn(
                  "pointer-events-none inline-block rounded-full bg-white dark:bg-gray-200 shadow",
                  "transform ring-0 transition duration-200 ease-in-out",
                  sizeClasses.thumb,
                  value ? sizeClasses.translate : "translate-x-0"
                )
              }
            )
          }
        ),
        onLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: t2(String(onLabel)) })
      ] }),
      hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: errorTextClass, children: error }),
      field.helpText && !hasError && /* @__PURE__ */ jsxRuntime.jsx("p", { className: helperTextClass, children: field.helpText })
    ] });
  }
);
var HiddenField = ({ field, value }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      type: "hidden",
      name: field.name,
      value: value ?? ""
    }
  );
};
var baseFields = {
  text: TextField,
  email: TextField,
  password: TextField,
  tel: TextField,
  url: TextField,
  number: NumberField,
  currency: CurrencyField,
  percent: NumberField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  switch: SwitchField,
  hidden: HiddenField
};

exports.CheckboxField = CheckboxField;
exports.CurrencyField = CurrencyField;
exports.FieldRegistry = FieldRegistry;
exports.FieldRegistryContext = FieldRegistryContext;
exports.HiddenField = HiddenField;
exports.NumberField = NumberField;
exports.SelectField = SelectField;
exports.SwitchField = SwitchField;
exports.TextField = TextField;
exports.TextareaField = TextareaField;
exports.baseFields = baseFields;
exports.createFieldFactory = createFieldFactory;
exports.getDefaultRegistry = getDefaultRegistry;
exports.getField = getField;
exports.registerField = registerField;
exports.registerFields = registerFields;
exports.setDefaultRegistry = setDefaultRegistry;
exports.useFieldFactory = useFieldFactory;
exports.useFieldRegistry = useFieldRegistry;
//# sourceMappingURL=chunk-NXGYXKUK.js.map
//# sourceMappingURL=chunk-NXGYXKUK.js.map