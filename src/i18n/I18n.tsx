/**
 * @fileoverview Internationalization (i18n) System
 * 
 * Provides a lightweight, framework-agnostic i18n solution for the UI kit.
 * Supports interpolation, pluralization, and nested keys.
 * 
 * @module i18n
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Translation value - can be a string or nested object
 */
export type TranslationValue = string | { [key: string]: TranslationValue };

/**
 * Translation dictionary
 */
export type TranslationDictionary = Record<string, TranslationValue>;

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** Locale code (e.g., 'en', 'es', 'pt-BR') */
  code: string;
  /** Display name */
  name: string;
  /** Text direction */
  direction?: 'ltr' | 'rtl';
  /** Date format */
  dateFormat?: string;
  /** Number format options */
  numberFormat?: Intl.NumberFormatOptions;
  /** Currency code */
  currency?: string;
}

/**
 * i18n configuration options
 */
export interface I18nConfig {
  /** Default locale */
  defaultLocale: string;
  /** Fallback locale when translation is missing */
  fallbackLocale?: string;
  /** Available locales */
  locales: LocaleConfig[];
  /** Translation dictionaries by locale */
  translations: Record<string, TranslationDictionary>;
  /** Missing translation handler */
  onMissingTranslation?: (key: string, locale: string) => string;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Interpolation parameters
 */
export type InterpolationParams = Record<string, string | number | boolean>;

/**
 * Plural forms
 */
export interface PluralForms {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

// =============================================================================
// DEFAULT TRANSLATIONS
// =============================================================================

/**
 * Default English translations for the UI kit
 */
export const defaultEnTranslations: TranslationDictionary = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    clear: 'Clear',
    apply: 'Apply',
    select: 'Select',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    noData: 'No data available',
    noResults: 'No results found',
    required: 'Required',
    optional: 'Optional',
  },

  // Table
  table: {
    showing: 'Showing {from} to {to} of {total} entries',
    pageSize: 'Show {size} entries',
    empty: ':(',
    firstPage: 'First',
    lastPage: 'Last',
    nextPage: 'Next',
    previousPage: 'Previous',
    goToPage: 'Go to page',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    noRecords: 'No records to display',
    loading: 'Loading data...',
    errorLoading: 'Error loading data',
    selected: '{count} selected',
    actions: 'Actions',
    columns: 'Columns',
    showColumns: 'Show columns',
    hideColumn: 'Hide column',
    resetColumns: 'Reset columns',
    exportData: 'Export',
    exportCSV: 'Export as CSV',
    exportExcel: 'Export as Excel',
    exportPDF: 'Export as PDF',
    refresh: 'Refresh',
    search: 'Search...',
    advancedSearch: 'Advanced Search',
    create: 'Create',
    delete: 'Delete',
    clearSelection: 'Clear selection',
    pagination: {
      showing: 'Showing {start} to {end} of {total} entries',
      pageSize: 'Page size',
      first: 'First page',
      previous: 'Previous page',
      next: 'Next page',
      last: 'Last page',
    },
  },

  // Form
  form: {
    submit: 'Submit',
    submitting: 'Submitting...',
    saved: 'Changes saved successfully',
    saveFailed: 'Failed to save changes',
    unsavedChanges: 'You have unsaved changes',
    discardChanges: 'Discard changes?',
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidUrl: 'Please enter a valid URL',
    invalidNumber: 'Please enter a valid number',
    minValue: 'Value must be at least {min}',
    maxValue: 'Value must be at most {max}',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    patternMismatch: 'Invalid format',
    passwordMismatch: 'Passwords do not match',
    selectOption: 'Select an option',
    selectPlaceholder: 'Select...',
    select: {
      placeholder: 'Select...'
    },
    searchPlaceholder: 'Type to search...',
    noOptions: 'No options available',
    addNew: 'Add new',
    removeItem: 'Remove item',
    uploadFile: 'Upload file',
    dropFileHere: 'Drop file here or click to upload',
    fileTooBig: 'File is too large. Maximum size is {max}',
    invalidFileType: 'Invalid file type. Allowed types: {types}',
  },

  // Legacy top-level helpers
  select: {
    placeholder: 'Select...'
  },
  select_placeholder: 'Select...',

  // Modal
  modal: {
    create: 'Create New Item',
    edit: 'Edit Item',
    view: 'View Item',
    delete: 'Delete Item',
    deleting: 'Deleting...',
    close: 'Close',
    confirm: 'Confirm',
    confirmDelete: 'Are you sure you want to delete this item?',
    deleteWarning: 'This action cannot be undone.',
    closeConfirm: 'Close without saving?',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    loading: 'Loading...',
  },

  // Filters
  filters: {
    title: 'Filters',
    addFilter: 'Add filter',
    removeFilter: 'Remove filter',
    clearFilters: 'Clear all filters',
    equals: 'Equals',
    notEquals: 'Not equals',
    contains: 'Contains',
    notContains: 'Does not contain',
    startsWith: 'Starts with',
    endsWith: 'Ends with',
    greaterThan: 'Greater than',
    lessThan: 'Less than',
    greaterOrEqual: 'Greater or equal',
    lessOrEqual: 'Less or equal',
    between: 'Between',
    isEmpty: 'Is empty',
    isNotEmpty: 'Is not empty',
    isTrue: 'Is true',
    isFalse: 'Is false',
    inList: 'In list',
    notInList: 'Not in list',
    before: 'Before',
    after: 'After',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    lastMonth: 'Last month',
  },

  // Dates
  dates: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    nextWeek: 'Next week',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    nextMonth: 'Next month',
    thisYear: 'This year',
    lastYear: 'Last year',
    nextYear: 'Next year',
    dateRange: 'Date range',
    startDate: 'Start date',
    endDate: 'End date',
  },

  // Validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    integer: 'Please enter a whole number',
    positive: 'Please enter a positive number',
    negative: 'Please enter a negative number',
    min: 'Value must be at least {min}',
    max: 'Value must be at most {max}',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    pattern: 'Invalid format',
    match: 'Values do not match',
    unique: 'This value already exists',
    date: 'Please enter a valid date',
    time: 'Please enter a valid time',
    phone: 'Please enter a valid phone number',
  },

  // Errors
  errors: {
    generic: 'An error occurred',
    network: 'Network error. Please check your connection.',
    server: 'Server error. Please try again later.',
    notFound: 'Resource not found',
    unauthorized: 'You are not authorized to perform this action',
    forbidden: 'Access forbidden',
    timeout: 'Request timed out',
    validation: 'Please correct the errors below',
  },

  // Confirmation
  confirm: {
    delete: 'Are you sure you want to delete this item?',
    deleteMultiple: 'Are you sure you want to delete {count} items?',
    discard: 'Are you sure you want to discard your changes?',
    leave: 'Are you sure you want to leave this page?',
    action: 'Are you sure you want to proceed?',
  },
};

/**
 * Default Spanish translations for the UI kit
 */
export const defaultEsTranslations: TranslationDictionary = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    update: 'Actualizar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    yes: 'Sí',
    no: 'No',
    ok: 'Aceptar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    search: 'Buscar',
    filter: 'Filtrar',
    reset: 'Restablecer',
    clear: 'Limpiar',
    apply: 'Aplicar',
    select: 'Seleccionar',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Deseleccionar todo',
    noData: 'No hay datos disponibles',
    noResults: 'No se encontraron resultados',
    required: 'Requerido',
    optional: 'Opcional',
  },

  table: {
    showing: 'Mostrando {from} a {to} de {total} registros',
    empty: ':(',
    pageSize: 'Mostrar {size} registros',
    firstPage: 'Primera',
    lastPage: 'Última',
    nextPage: 'Siguiente',
    previousPage: 'Anterior',
    goToPage: 'Ir a página',
    sortAscending: 'Ordenar ascendente',
    sortDescending: 'Ordenar descendente',
    noRecords: 'No hay registros para mostrar',
    loading: 'Cargando datos...',
    errorLoading: 'Error al cargar datos',
    selected: '{count} seleccionados',
    actions: 'Acciones',
    columns: 'Columnas',
    showColumns: 'Mostrar columnas',
    hideColumn: 'Ocultar columna',
    resetColumns: 'Restablecer columnas',
    exportData: 'Exportar',
    exportCSV: 'Exportar como CSV',
    exportExcel: 'Exportar como Excel',
    exportPDF: 'Exportar como PDF',
    refresh: 'Actualizar',
    search: 'Buscar...',
    advancedSearch: 'Búsqueda avanzada',
    create: 'Crear',
    delete: 'Eliminar',
    clearSelection: 'Limpiar selección',
    pagination: {
      showing: 'Mostrando {start} a {end} de {total} registros',
      pageSize: 'Tamaño de página',
      first: 'Primera página',
      previous: 'Página anterior',
      next: 'Página siguiente',
      last: 'Última página',
    },
  },

  form: {
    submit: 'Enviar',
    submitting: 'Enviando...',
    saved: 'Cambios guardados exitosamente',
    saveFailed: 'Error al guardar los cambios',
    unsavedChanges: 'Tienes cambios sin guardar',
    discardChanges: '¿Descartar cambios?',
    requiredField: 'Este campo es requerido',
    invalidEmail: 'Por favor ingresa un correo electrónico válido',
    invalidUrl: 'Por favor ingresa una URL válida',
    invalidNumber: 'Por favor ingresa un número válido',
    minValue: 'El valor debe ser al menos {min}',
    maxValue: 'El valor debe ser como máximo {max}',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'Debe tener como máximo {max} caracteres',
    patternMismatch: 'Formato inválido',
    passwordMismatch: 'Las contraseñas no coinciden',
    selectOption: 'Selecciona una opción',
    selectPlaceholder: 'Seleccionar...',
    select: {
      placeholder: 'Seleccionar...'
    },
    searchPlaceholder: 'Escribe para buscar...',
    noOptions: 'No hay opciones disponibles',
    addNew: 'Agregar nuevo',
    removeItem: 'Eliminar elemento',
    uploadFile: 'Subir archivo',
    dropFileHere: 'Arrastra un archivo aquí o haz clic para subir',
    fileTooBig: 'El archivo es muy grande. Tamaño máximo: {max}',
    invalidFileType: 'Tipo de archivo inválido. Tipos permitidos: {types}',
  },

  // Legacy top-level helpers
  select: {
    placeholder: 'Seleccionar...'
  },
  select_placeholder: 'Seleccionar...',

  modal: {
    create: 'Crear Nuevo Elemento',
    edit: 'Editar Elemento',
    view: 'Ver Elemento',
    delete: 'Eliminar Elemento',
    deleting: 'Eliminando...',
    close: 'Cerrar',
    confirm: 'Confirmar',
    confirmDelete: '¿Estás seguro de que deseas eliminar este elemento?',
    deleteWarning: 'Esta acción no se puede deshacer.',
    closeConfirm: '¿Cerrar sin guardar?',
    cancel: 'Cancelar',
    save: 'Guardar',
    saving: 'Guardando...',
    loading: 'Cargando...',
  },

  filters: {
    title: 'Filtros',
    addFilter: 'Agregar filtro',
    removeFilter: 'Eliminar filtro',
    clearFilters: 'Limpiar todos los filtros',
    equals: 'Igual a',
    notEquals: 'Diferente de',
    contains: 'Contiene',
    notContains: 'No contiene',
    startsWith: 'Comienza con',
    endsWith: 'Termina con',
    greaterThan: 'Mayor que',
    lessThan: 'Menor que',
    greaterOrEqual: 'Mayor o igual',
    lessOrEqual: 'Menor o igual',
    between: 'Entre',
    isEmpty: 'Está vacío',
    isNotEmpty: 'No está vacío',
    isTrue: 'Es verdadero',
    isFalse: 'Es falso',
    inList: 'En lista',
    notInList: 'No en lista',
    before: 'Antes de',
    after: 'Después de',
    today: 'Hoy',
    yesterday: 'Ayer',
    thisWeek: 'Esta semana',
    lastWeek: 'Semana pasada',
    thisMonth: 'Este mes',
    lastMonth: 'Mes pasado',
  },

  dates: {
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    thisWeek: 'Esta semana',
    lastWeek: 'Semana pasada',
    nextWeek: 'Próxima semana',
    thisMonth: 'Este mes',
    lastMonth: 'Mes pasado',
    nextMonth: 'Próximo mes',
    thisYear: 'Este año',
    lastYear: 'Año pasado',
    nextYear: 'Próximo año',
    dateRange: 'Rango de fechas',
    startDate: 'Fecha inicio',
    endDate: 'Fecha fin',
  },

  validation: {
    required: 'Este campo es requerido',
    email: 'Por favor ingresa un correo electrónico válido',
    url: 'Por favor ingresa una URL válida',
    number: 'Por favor ingresa un número válido',
    integer: 'Por favor ingresa un número entero',
    positive: 'Por favor ingresa un número positivo',
    negative: 'Por favor ingresa un número negativo',
    min: 'El valor debe ser al menos {min}',
    max: 'El valor debe ser como máximo {max}',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'Debe tener como máximo {max} caracteres',
    pattern: 'Formato inválido',
    match: 'Los valores no coinciden',
    unique: 'Este valor ya existe',
    date: 'Por favor ingresa una fecha válida',
    time: 'Por favor ingresa una hora válida',
    phone: 'Por favor ingresa un número de teléfono válido',
  },

  errors: {
    generic: 'Ocurrió un error',
    network: 'Error de red. Por favor verifica tu conexión.',
    server: 'Error del servidor. Por favor intenta más tarde.',
    notFound: 'Recurso no encontrado',
    unauthorized: 'No estás autorizado para realizar esta acción',
    forbidden: 'Acceso denegado',
    timeout: 'La solicitud expiró',
    validation: 'Por favor corrige los errores a continuación',
  },

  confirm: {
    delete: '¿Estás seguro de que deseas eliminar este elemento?',
    deleteMultiple: '¿Estás seguro de que deseas eliminar {count} elementos?',
    discard: '¿Estás seguro de que deseas descartar los cambios?',
    leave: '¿Estás seguro de que deseas salir de esta página?',
    action: '¿Estás seguro de que deseas continuar?',
  },
};

// Simple deep merge helper used for merging translation dictionaries
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const out = Array.isArray(target) ? [...target] : { ...(target || {}) };
  Object.keys(source).forEach(key => {
    const sVal = source[key];
    const tVal = out[key];
    if (sVal && typeof sVal === 'object' && !Array.isArray(sVal)) {
      out[key] = deepMerge(tVal || {}, sVal);
    } else {
      out[key] = sVal;
    }
  });
  return out;
}

// =============================================================================
// I18N CLASS
// =============================================================================

/**
 * I18n Manager - Handles translations and locale management
 */
export class I18n {
  private config: I18nConfig;
  private currentLocale: string;
  private listeners: Set<(locale: string) => void> = new Set();

  constructor(config: Partial<I18nConfig> = {}) {
  // Base defaults
  const baseDefaults: I18nConfig = {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    locales: [
      { code: 'en', name: 'English', direction: 'ltr' },
      { code: 'es', name: 'Español', direction: 'ltr' },
    ],
    translations: {
      en: defaultEnTranslations,
      es: defaultEsTranslations,
    },
    debug: false,
  };

    // Deep-merge provided translations into the base defaults so apps can override
    const providedTranslations = (config && (config.translations as any)) || {};
    const mergedTranslations: Record<string, TranslationDictionary> = { ...(baseDefaults.translations as any) };

    Object.keys(providedTranslations).forEach(locale => {
      mergedTranslations[locale] = deepMerge(mergedTranslations[locale] || {}, providedTranslations[locale]);
    });

    this.config = {
      ...baseDefaults,
      ...config,
      translations: mergedTranslations,
    };

    this.currentLocale = (config && (config.defaultLocale as string)) || this.config.defaultLocale;
  }

  /**
   * Get current locale
   */
  get locale(): string {
    return this.currentLocale;
  }

  /**
   * Get current locale config
   */
  get localeConfig(): LocaleConfig | undefined {
    return this.config.locales.find(l => l.code === this.currentLocale);
  }

  /**
   * Get all available locales
   */
  get availableLocales(): LocaleConfig[] {
    return this.config.locales;
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
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
  addTranslations(locale: string, translations: TranslationDictionary): void {
    this.config.translations[locale] = deepMerge(this.config.translations[locale] || {}, translations);
  }

  /**
   * Get a nested value from an object using dot notation
   */
  private getNestedValue(obj: TranslationDictionary, path: string): string | undefined {
    const keys = path.split('.');
    let current: TranslationValue | undefined = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Interpolate parameters into a string
   */
  private interpolate(text: string, params?: InterpolationParams): string {
    if (!params) return text;

    // Support both {{key}} and {key} formats
    return text.replace(/\{{1,2}(\w+)\}{1,2}/g, (match, key) => {
      if (key in params) {
        return String(params[key]);
      }
      return match;
    });
  }

  /**
   * Translate a key
   */
  t(key: string, params?: InterpolationParams, fallback?: string): string {
    // Try current locale
    let translation = this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );

    // Try fallback locale
    if (!translation && this.config.fallbackLocale) {
      translation = this.getNestedValue(
        this.config.translations[this.config.fallbackLocale] || {},
        key
      );
    }

    // Handle missing translation
    if (!translation) {
      // Compatibility with app-level t: check if fallback is in params
      const effectiveFallback = fallback || (params as any)?.default || (params as any)?.defaultValue;

      // Use effective fallback string
      if (effectiveFallback) {
        return this.interpolate(effectiveFallback, params);
      }

      if (this.config.onMissingTranslation) {
        return this.config.onMissingTranslation(key, this.currentLocale);
      }

      if (this.config.debug) {
        console.warn(`[i18n] Missing translation: ${key} (${this.currentLocale})`);
      }

      // Return a humanized label instead of raw key
      return this.humanizeKeySegment(key);
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
  resolveLabel(key: string, fallback?: string): string {
    // Prefer direct translation lookup to avoid recursion
    const direct = this.getNestedValue(this.config.translations[this.currentLocale] || {}, key)
      || (this.config.fallbackLocale && this.getNestedValue(this.config.translations[this.config.fallbackLocale] || {}, key));

    if (direct && typeof direct === 'string') return direct;

    if (fallback) return fallback;

    return this.humanizeKeySegment(key);
  }

  /**
   * Humanize last key segment (used as fallback in multiple places)
   */
  private humanizeKeySegment(key: string): string {
    const last = key.split('.').pop() || key;
    let human = last.replace(/[_-]+/g, ' ');
    human = human.replace(/([a-z])([A-Z])/g, '$1 $2');
    human = human
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return human;
  }

  /**
   * Translate with pluralization
   */
  tp(key: string, count: number, params?: InterpolationParams): string {
    const pluralKey = this.getPluralKey(count);
    const fullKey = `${key}.${pluralKey}`;

    // Try the plural form
    let translation = this.t(fullKey, { ...params, count });

    // If not found, try 'other' as fallback
    if (translation === fullKey) {
      translation = this.t(`${key}.other`, { ...params, count });
    }

    // If still not found, try the base key
    if (translation === `${key}.other`) {
      translation = this.t(key, { ...params, count });
    }

    return translation;
  }

  /**
   * Get plural key based on count
   */
  private getPluralKey(count: number): keyof PluralForms {
    if (count === 0) return 'zero';
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    if (count >= 3 && count <= 10) return 'few';
    if (count >= 11 && count <= 99) return 'many';
    return 'other';
  }

  /**
   * Check if a translation exists
   */
  exists(key: string): boolean {
    return !!this.getNestedValue(
      this.config.translations[this.currentLocale] || {},
      key
    );
  }

  /**
   * Format a number according to locale
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(
      this.currentLocale,
      options || localeConfig?.numberFormat
    ).format(value);
  }

  /**
   * Format currency
   */
  formatCurrency(value: number, currency?: string): string {
    const localeConfig = this.localeConfig;
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency: currency || localeConfig?.currency || 'USD',
    }).format(value);
  }

  /**
   * Format a date according to locale
   */
  formatDate(
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(this.currentLocale, options).format(d);
  }

  /**
   * Format relative time
   */
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    return new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: 'auto',
    }).format(value, unit);
  }

  /**
   * Subscribe to locale changes
   */
  subscribe(listener: (locale: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of locale change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLocale));
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let i18nInstance: I18n | null = null;

/**
 * Get the global i18n instance
 */
export function getI18n(): I18n {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}

/**
 * Initialize or replace the global i18n instance
 */
export function initI18n(config?: Partial<I18nConfig>): I18n {
  i18nInstance = new I18n(config);
  return i18nInstance;
}

/**
 * Shorthand translation function
 */
/**
 * Shorthand translation function (canonical)
 */
export function t(key: string, params?: InterpolationParams, fallback?: string): string {
  return getI18n().t(key, params, fallback);
}

/**
 * Shorthand translation function (alias for compatibility)
 */
export const tx = t;



/**
 * Shorthand plural translation function
 */
export function tp(key: string, count: number, params?: InterpolationParams): string {
  return getI18n().tp(key, count, params);
}

/**
 * Resolve a label for a given key with humanized fallback when missing
 */
export function resolveLabel(key: string, fallback?: string): string {
  return getI18n().resolveLabel(key, fallback);
}

// =============================================================================
// REACT INTEGRATION
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

/**
 * I18n Context
 */
export const I18nContext = createContext<I18n | null>(null);

/**
 * I18n Provider Props
 */
export interface I18nProviderProps {
  children: ReactNode;
  config?: Partial<I18nConfig>;
  i18n?: I18n;
}

/**
 * I18n Provider Component
 */
export function I18nProvider({ children, config, i18n }: I18nProviderProps): JSX.Element {
  const [instance] = useState(() => i18n || new I18n(config));

  return (
    <I18nContext.Provider value={instance}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use i18n
 */
export function useI18n() {
  const context = useContext(I18nContext);
  const i18n = context || getI18n();

  const [locale, setLocaleState] = useState(i18n.locale);

  useEffect(() => {
    return i18n.subscribe(setLocaleState);
  }, [i18n]);

  const setLocale = useCallback((newLocale: string) => {
    i18n.setLocale(newLocale);
  }, [i18n]);

  const translate = useCallback((key: string, params?: InterpolationParams, fallback?: string) => {
    return i18n.t(key, params, fallback);
  }, [i18n]);

  const translatePlural = useCallback((key: string, count: number, params?: InterpolationParams) => {
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
    i18n,
  };
}

/**
 * Hook for translated validation messages
 */
export function useTranslatedValidation() {
  const { t } = useI18n();

  return {
    required: () => t('validation.required'),
    email: () => t('validation.email'),
    url: () => t('validation.url'),
    min: (min: number) => t('validation.min', { min }),
    max: (max: number) => t('validation.max', { max }),
    minLength: (min: number) => t('validation.minLength', { min }),
    maxLength: (max: number) => t('validation.maxLength', { max }),
    pattern: () => t('validation.pattern'),
  };
}

export default I18n;
