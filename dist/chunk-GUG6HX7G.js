'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/i18n/I18n.tsx
var defaultEnTranslations = {
  // Common
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    yes: "Yes",
    no: "No",
    ok: "OK",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filter",
    reset: "Reset",
    clear: "Clear",
    apply: "Apply",
    select: "Select",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    noData: "No data available",
    noResults: "No results found",
    required: "Required",
    optional: "Optional"
  },
  // Table
  table: {
    showing: "Showing {from} to {to} of {total} entries",
    pageSize: "Show {size} entries",
    empty: ":(",
    firstPage: "First",
    lastPage: "Last",
    nextPage: "Next",
    previousPage: "Previous",
    goToPage: "Go to page",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
    noRecords: "No records to display",
    loading: "Loading data...",
    errorLoading: "Error loading data",
    selected: "{count} selected",
    actions: "Actions",
    columns: "Columns",
    showColumns: "Show columns",
    hideColumn: "Hide column",
    resetColumns: "Reset columns",
    exportData: "Export",
    exportCSV: "Export as CSV",
    exportExcel: "Export as Excel",
    exportPDF: "Export as PDF",
    refresh: "Refresh",
    search: "Search...",
    advancedSearch: "Advanced Search",
    create: "Create",
    delete: "Delete",
    clearSelection: "Clear selection",
    pagination: {
      showing: "Showing {start} to {end} of {total} entries",
      pageSize: "Page size",
      first: "First page",
      previous: "Previous page",
      next: "Next page",
      last: "Last page"
    }
  },
  // Form
  form: {
    submit: "Submit",
    submitting: "Submitting...",
    saved: "Changes saved successfully",
    saveFailed: "Failed to save changes",
    unsavedChanges: "You have unsaved changes",
    discardChanges: "Discard changes?",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidUrl: "Please enter a valid URL",
    invalidNumber: "Please enter a valid number",
    minValue: "Value must be at least {min}",
    maxValue: "Value must be at most {max}",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be at most {max} characters",
    patternMismatch: "Invalid format",
    passwordMismatch: "Passwords do not match",
    selectOption: "Select an option",
    selectPlaceholder: "Select...",
    select: {
      placeholder: "Select..."
    },
    searchPlaceholder: "Type to search...",
    noOptions: "No options available",
    addNew: "Add new",
    removeItem: "Remove item",
    uploadFile: "Upload file",
    dropFileHere: "Drop file here or click to upload",
    fileTooBig: "File is too large. Maximum size is {max}",
    invalidFileType: "Invalid file type. Allowed types: {types}"
  },
  // Legacy top-level helpers
  select: {
    placeholder: "Select..."
  },
  select_placeholder: "Select...",
  // Modal
  modal: {
    create: "Create New Item",
    edit: "Edit Item",
    view: "View Item",
    delete: "Delete Item",
    confirmDelete: "Are you sure you want to delete this item?",
    deleteWarning: "This action cannot be undone.",
    closeConfirm: "Close without saving?",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    loading: "Loading..."
  },
  // Filters
  filters: {
    title: "Filters",
    addFilter: "Add filter",
    removeFilter: "Remove filter",
    clearFilters: "Clear all filters",
    equals: "Equals",
    notEquals: "Not equals",
    contains: "Contains",
    notContains: "Does not contain",
    startsWith: "Starts with",
    endsWith: "Ends with",
    greaterThan: "Greater than",
    lessThan: "Less than",
    greaterOrEqual: "Greater or equal",
    lessOrEqual: "Less or equal",
    between: "Between",
    isEmpty: "Is empty",
    isNotEmpty: "Is not empty",
    isTrue: "Is true",
    isFalse: "Is false",
    inList: "In list",
    notInList: "Not in list",
    before: "Before",
    after: "After",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This week",
    lastWeek: "Last week",
    thisMonth: "This month",
    lastMonth: "Last month"
  },
  // Dates
  dates: {
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    lastWeek: "Last week",
    nextWeek: "Next week",
    thisMonth: "This month",
    lastMonth: "Last month",
    nextMonth: "Next month",
    thisYear: "This year",
    lastYear: "Last year",
    nextYear: "Next year",
    dateRange: "Date range",
    startDate: "Start date",
    endDate: "End date"
  },
  // Validation
  validation: {
    required: "This field is required",
    email: "Please enter a valid email address",
    url: "Please enter a valid URL",
    number: "Please enter a valid number",
    integer: "Please enter a whole number",
    positive: "Please enter a positive number",
    negative: "Please enter a negative number",
    min: "Value must be at least {min}",
    max: "Value must be at most {max}",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be at most {max} characters",
    pattern: "Invalid format",
    match: "Values do not match",
    unique: "This value already exists",
    date: "Please enter a valid date",
    time: "Please enter a valid time",
    phone: "Please enter a valid phone number"
  },
  // Errors
  errors: {
    generic: "An error occurred",
    network: "Network error. Please check your connection.",
    server: "Server error. Please try again later.",
    notFound: "Resource not found",
    unauthorized: "You are not authorized to perform this action",
    forbidden: "Access forbidden",
    timeout: "Request timed out",
    validation: "Please correct the errors below"
  },
  // Confirmation
  confirm: {
    delete: "Are you sure you want to delete this item?",
    deleteMultiple: "Are you sure you want to delete {count} items?",
    discard: "Are you sure you want to discard your changes?",
    leave: "Are you sure you want to leave this page?",
    action: "Are you sure you want to proceed?"
  }
};
var defaultEsTranslations = {
  common: {
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    update: "Actualizar",
    close: "Cerrar",
    confirm: "Confirmar",
    loading: "Cargando...",
    error: "Error",
    success: "\xC9xito",
    warning: "Advertencia",
    info: "Informaci\xF3n",
    yes: "S\xED",
    no: "No",
    ok: "Aceptar",
    back: "Atr\xE1s",
    next: "Siguiente",
    previous: "Anterior",
    search: "Buscar",
    filter: "Filtrar",
    reset: "Restablecer",
    clear: "Limpiar",
    apply: "Aplicar",
    select: "Seleccionar",
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    noData: "No hay datos disponibles",
    noResults: "No se encontraron resultados",
    required: "Requerido",
    optional: "Opcional"
  },
  table: {
    showing: "Mostrando {from} a {to} de {total} registros",
    empty: ":(",
    pageSize: "Mostrar {size} registros",
    firstPage: "Primera",
    lastPage: "\xDAltima",
    nextPage: "Siguiente",
    previousPage: "Anterior",
    goToPage: "Ir a p\xE1gina",
    sortAscending: "Ordenar ascendente",
    sortDescending: "Ordenar descendente",
    noRecords: "No hay registros para mostrar",
    loading: "Cargando datos...",
    errorLoading: "Error al cargar datos",
    selected: "{count} seleccionados",
    actions: "Acciones",
    columns: "Columnas",
    showColumns: "Mostrar columnas",
    hideColumn: "Ocultar columna",
    resetColumns: "Restablecer columnas",
    exportData: "Exportar",
    exportCSV: "Exportar como CSV",
    exportExcel: "Exportar como Excel",
    exportPDF: "Exportar como PDF",
    refresh: "Actualizar",
    search: "Buscar...",
    advancedSearch: "B\xFAsqueda avanzada",
    create: "Crear",
    delete: "Eliminar",
    clearSelection: "Limpiar selecci\xF3n",
    pagination: {
      showing: "Mostrando {start} a {end} de {total} registros",
      pageSize: "Tama\xF1o de p\xE1gina",
      first: "Primera p\xE1gina",
      previous: "P\xE1gina anterior",
      next: "P\xE1gina siguiente",
      last: "\xDAltima p\xE1gina"
    }
  },
  form: {
    submit: "Enviar",
    submitting: "Enviando...",
    saved: "Cambios guardados exitosamente",
    saveFailed: "Error al guardar los cambios",
    unsavedChanges: "Tienes cambios sin guardar",
    discardChanges: "\xBFDescartar cambios?",
    requiredField: "Este campo es requerido",
    invalidEmail: "Por favor ingresa un correo electr\xF3nico v\xE1lido",
    invalidUrl: "Por favor ingresa una URL v\xE1lida",
    invalidNumber: "Por favor ingresa un n\xFAmero v\xE1lido",
    minValue: "El valor debe ser al menos {min}",
    maxValue: "El valor debe ser como m\xE1ximo {max}",
    minLength: "Debe tener al menos {min} caracteres",
    maxLength: "Debe tener como m\xE1ximo {max} caracteres",
    patternMismatch: "Formato inv\xE1lido",
    passwordMismatch: "Las contrase\xF1as no coinciden",
    selectOption: "Selecciona una opci\xF3n",
    selectPlaceholder: "Seleccionar...",
    select: {
      placeholder: "Seleccionar..."
    },
    searchPlaceholder: "Escribe para buscar...",
    noOptions: "No hay opciones disponibles",
    addNew: "Agregar nuevo",
    removeItem: "Eliminar elemento",
    uploadFile: "Subir archivo",
    dropFileHere: "Arrastra un archivo aqu\xED o haz clic para subir",
    fileTooBig: "El archivo es muy grande. Tama\xF1o m\xE1ximo: {max}",
    invalidFileType: "Tipo de archivo inv\xE1lido. Tipos permitidos: {types}"
  },
  // Legacy top-level helpers
  select: {
    placeholder: "Seleccionar..."
  },
  select_placeholder: "Seleccionar...",
  modal: {
    create: "Crear Nuevo Elemento",
    edit: "Editar Elemento",
    view: "Ver Elemento",
    delete: "Eliminar Elemento",
    confirmDelete: "\xBFEst\xE1s seguro de que deseas eliminar este elemento?",
    deleteWarning: "Esta acci\xF3n no se puede deshacer.",
    closeConfirm: "\xBFCerrar sin guardar?",
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
    loading: "Cargando..."
  },
  filters: {
    title: "Filtros",
    addFilter: "Agregar filtro",
    removeFilter: "Eliminar filtro",
    clearFilters: "Limpiar todos los filtros",
    equals: "Igual a",
    notEquals: "Diferente de",
    contains: "Contiene",
    notContains: "No contiene",
    startsWith: "Comienza con",
    endsWith: "Termina con",
    greaterThan: "Mayor que",
    lessThan: "Menor que",
    greaterOrEqual: "Mayor o igual",
    lessOrEqual: "Menor o igual",
    between: "Entre",
    isEmpty: "Est\xE1 vac\xEDo",
    isNotEmpty: "No est\xE1 vac\xEDo",
    isTrue: "Es verdadero",
    isFalse: "Es falso",
    inList: "En lista",
    notInList: "No en lista",
    before: "Antes de",
    after: "Despu\xE9s de",
    today: "Hoy",
    yesterday: "Ayer",
    thisWeek: "Esta semana",
    lastWeek: "Semana pasada",
    thisMonth: "Este mes",
    lastMonth: "Mes pasado"
  },
  dates: {
    today: "Hoy",
    yesterday: "Ayer",
    tomorrow: "Ma\xF1ana",
    thisWeek: "Esta semana",
    lastWeek: "Semana pasada",
    nextWeek: "Pr\xF3xima semana",
    thisMonth: "Este mes",
    lastMonth: "Mes pasado",
    nextMonth: "Pr\xF3ximo mes",
    thisYear: "Este a\xF1o",
    lastYear: "A\xF1o pasado",
    nextYear: "Pr\xF3ximo a\xF1o",
    dateRange: "Rango de fechas",
    startDate: "Fecha inicio",
    endDate: "Fecha fin"
  },
  validation: {
    required: "Este campo es requerido",
    email: "Por favor ingresa un correo electr\xF3nico v\xE1lido",
    url: "Por favor ingresa una URL v\xE1lida",
    number: "Por favor ingresa un n\xFAmero v\xE1lido",
    integer: "Por favor ingresa un n\xFAmero entero",
    positive: "Por favor ingresa un n\xFAmero positivo",
    negative: "Por favor ingresa un n\xFAmero negativo",
    min: "El valor debe ser al menos {min}",
    max: "El valor debe ser como m\xE1ximo {max}",
    minLength: "Debe tener al menos {min} caracteres",
    maxLength: "Debe tener como m\xE1ximo {max} caracteres",
    pattern: "Formato inv\xE1lido",
    match: "Los valores no coinciden",
    unique: "Este valor ya existe",
    date: "Por favor ingresa una fecha v\xE1lida",
    time: "Por favor ingresa una hora v\xE1lida",
    phone: "Por favor ingresa un n\xFAmero de tel\xE9fono v\xE1lido"
  },
  errors: {
    generic: "Ocurri\xF3 un error",
    network: "Error de red. Por favor verifica tu conexi\xF3n.",
    server: "Error del servidor. Por favor intenta m\xE1s tarde.",
    notFound: "Recurso no encontrado",
    unauthorized: "No est\xE1s autorizado para realizar esta acci\xF3n",
    forbidden: "Acceso denegado",
    timeout: "La solicitud expir\xF3",
    validation: "Por favor corrige los errores a continuaci\xF3n"
  },
  confirm: {
    delete: "\xBFEst\xE1s seguro de que deseas eliminar este elemento?",
    deleteMultiple: "\xBFEst\xE1s seguro de que deseas eliminar {count} elementos?",
    discard: "\xBFEst\xE1s seguro de que deseas descartar los cambios?",
    leave: "\xBFEst\xE1s seguro de que deseas salir de esta p\xE1gina?",
    action: "\xBFEst\xE1s seguro de que deseas continuar?"
  }
};
function deepMerge(target, source) {
  if (!source) return target;
  const out = Array.isArray(target) ? [...target] : { ...target || {} };
  Object.keys(source).forEach((key) => {
    const sVal = source[key];
    const tVal = out[key];
    if (sVal && typeof sVal === "object" && !Array.isArray(sVal)) {
      out[key] = deepMerge(tVal || {}, sVal);
    } else {
      out[key] = sVal;
    }
  });
  return out;
}
var I18n = class {
  constructor(config = {}) {
    this.listeners = /* @__PURE__ */ new Set();
    const baseDefaults = {
      defaultLocale: "en",
      fallbackLocale: "en",
      locales: [
        { code: "en", name: "English", direction: "ltr" },
        { code: "es", name: "Espa\xF1ol", direction: "ltr" }
      ],
      translations: {
        en: defaultEnTranslations,
        es: defaultEsTranslations
      },
      debug: false
    };
    const providedTranslations = config && config.translations || {};
    const mergedTranslations = { ...baseDefaults.translations };
    Object.keys(providedTranslations).forEach((locale) => {
      mergedTranslations[locale] = deepMerge(mergedTranslations[locale] || {}, providedTranslations[locale]);
    });
    this.config = {
      ...baseDefaults,
      ...config,
      translations: mergedTranslations
    };
    this.currentLocale = config && config.defaultLocale || this.config.defaultLocale;
  }
  /**
   * Get current locale
   */
  get locale() {
    return this.currentLocale;
  }
  /**
   * Get current locale config
   */
  get localeConfig() {
    return this.config.locales.find((l) => l.code === this.currentLocale);
  }
  /**
   * Get all available locales
   */
  get availableLocales() {
    return this.config.locales;
  }
  /**
   * Set current locale
   */
  setLocale(locale) {
    if (this.config.translations[locale] || locale === this.config.fallbackLocale) {
      this.currentLocale = locale;
      this.notifyListeners();
    } else if (this.config.debug) {
      console.warn(`[i18n] Locale "${locale}" not found`);
    }
  }
  /**
   * Add translations for a locale
   */
  addTranslations(locale, translations) {
    this.config.translations[locale] = deepMerge(this.config.translations[locale] || {}, translations);
  }
  /**
   * Get a nested value from an object using dot notation
   */
  getNestedValue(obj, path) {
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return void 0;
      }
    }
    return typeof current === "string" ? current : void 0;
  }
  /**
   * Interpolate parameters into a string
   */
  interpolate(text, params) {
    if (!params) return text;
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      if (key in params) {
        return String(params[key]);
      }
      return match;
    });
  }
  /**
   * Translate a key
   */
  t(key, params, fallback) {
    let translation = this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
    if (!translation && this.config.fallbackLocale) {
      translation = this.getNestedValue(
        this.config.translations[this.config.fallbackLocale] || {},
        key
      );
    }
    if (!translation) {
      if (fallback) {
        return this.interpolate(fallback, params);
      }
      if (this.config.onMissingTranslation) {
        return this.config.onMissingTranslation(key, this.currentLocale);
      }
      if (this.config.debug) {
        console.warn(`[i18n] Missing translation: ${key} (${this.currentLocale})`);
      }
      return key;
    }
    return this.interpolate(translation, params);
  }
  /**
   * Resolve a human-friendly label for a key.
   *
   * - Returns the translated value if available
   * - If missing, returns the provided fallback string
   * - Otherwise, generates a humanized label from the last key segment
   */
  resolveLabel(key, fallback) {
    const translated = this.t(key);
    if (translated && translated !== key) return translated;
    if (fallback) return fallback;
    const last = key.split(".").pop() || key;
    let human = last.replace(/[_-]+/g, " ");
    human = human.replace(/([a-z])([A-Z])/g, "$1 $2");
    human = human.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return human;
  }
  /**
   * Translate with pluralization
   */
  tp(key, count, params) {
    const pluralKey = this.getPluralKey(count);
    const fullKey = `${key}.${pluralKey}`;
    let translation = this.t(fullKey, { ...params, count });
    if (translation === fullKey) {
      translation = this.t(`${key}.other`, { ...params, count });
    }
    if (translation === `${key}.other`) {
      translation = this.t(key, { ...params, count });
    }
    return translation;
  }
  /**
   * Get plural key based on count
   */
  getPluralKey(count) {
    if (count === 0) return "zero";
    if (count === 1) return "one";
    if (count === 2) return "two";
    if (count >= 3 && count <= 10) return "few";
    if (count >= 11 && count <= 99) return "many";
    return "other";
  }
  /**
   * Check if a translation exists
   */
  exists(key) {
    return !!this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
  }
  /**
   * Format a number according to locale
   */
  formatNumber(value, options) {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(
      this.currentLocale,
      options || localeConfig?.numberFormat
    ).format(value);
  }
  /**
   * Format currency
   */
  formatCurrency(value, currency) {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(this.currentLocale, {
      style: "currency",
      currency: currency || localeConfig?.currency || "USD"
    }).format(value);
  }
  /**
   * Format a date according to locale
   */
  formatDate(date, options) {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(this.currentLocale, options).format(d);
  }
  /**
   * Format relative time
   */
  formatRelativeTime(value, unit) {
    return new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: "auto"
    }).format(value, unit);
  }
  /**
   * Subscribe to locale changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * Notify all listeners of locale change
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentLocale));
  }
};
var i18nInstance = null;
function getI18n() {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}
function initI18n(config) {
  i18nInstance = new I18n(config);
  return i18nInstance;
}
function t(key, params, fallback) {
  return getI18n().t(key, params, fallback);
}
function tp(key, count, params) {
  return getI18n().tp(key, count, params);
}
function resolveLabel(key, fallback) {
  return getI18n().resolveLabel(key, fallback);
}
var I18nContext = react.createContext(null);
function I18nProvider({ children, config, i18n }) {
  const [instance] = react.useState(() => i18n || new I18n(config));
  return /* @__PURE__ */ jsxRuntime.jsx(I18nContext.Provider, { value: instance, children });
}
function useI18n() {
  const context = react.useContext(I18nContext);
  const i18n = context || getI18n();
  const [locale, setLocaleState] = react.useState(i18n.locale);
  react.useEffect(() => {
    return i18n.subscribe(setLocaleState);
  }, [i18n]);
  const setLocale = react.useCallback((newLocale) => {
    i18n.setLocale(newLocale);
  }, [i18n]);
  const translate = react.useCallback((key, params, fallback) => {
    return i18n.t(key, params, fallback);
  }, [i18n]);
  const translatePlural = react.useCallback((key, count, params) => {
    return i18n.tp(key, count, params);
  }, [i18n]);
  return {
    t: translate,
    tp: translatePlural,
    locale,
    setLocale,
    locales: i18n.availableLocales,
    localeConfig: i18n.localeConfig,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    i18n
  };
}
function useTranslatedValidation() {
  const { t: t2 } = useI18n();
  return {
    required: () => t2("validation.required"),
    email: () => t2("validation.email"),
    url: () => t2("validation.url"),
    min: (min) => t2("validation.min", { min }),
    max: (max) => t2("validation.max", { max }),
    minLength: (min) => t2("validation.minLength", { min }),
    maxLength: (max) => t2("validation.maxLength", { max }),
    pattern: () => t2("validation.pattern")
  };
}

exports.I18n = I18n;
exports.I18nContext = I18nContext;
exports.I18nProvider = I18nProvider;
exports.defaultEnTranslations = defaultEnTranslations;
exports.defaultEsTranslations = defaultEsTranslations;
exports.getI18n = getI18n;
exports.initI18n = initI18n;
exports.resolveLabel = resolveLabel;
exports.t = t;
exports.tp = tp;
exports.useI18n = useI18n;
exports.useTranslatedValidation = useTranslatedValidation;
//# sourceMappingURL=chunk-GUG6HX7G.js.map
//# sourceMappingURL=chunk-GUG6HX7G.js.map