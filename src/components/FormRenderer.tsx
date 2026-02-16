/**
 * @fileoverview FormRenderer Component
 * 
 * Renders dynamic forms based on JSON configuration with support for:
 * - Grouped sections with collapsible headers
 * - Conditional field visibility
 * - Computed field values
 * - Inline validation
 * - Grid-based layouts
 * 
 * @module components/FormRenderer
 */

import React, { 
  forwardRef, 
  useImperativeHandle, 
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import type { 
  FormConfig, 
  FormSection as FormSectionConfig,
  TabConfig,
  FieldConfig, 
  FieldValue, 
  DataRecord,
} from '../core/types';
import { cn, getNestedValue } from '../core/utils';
import { useI18n, resolveLabel, t } from '../i18n/I18n';
import { evaluateConditions, validateField as coreValidateField } from '../core/validators';
import { TabRenderer } from './TabRenderer';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Form values type
 */
export type FormValues = Record<string, FieldValue>;

/**
 * Form errors type
 */
export type FormErrors = Record<string, string | undefined>;

/**
 * Form touched state type
 */
export type FormTouched = Record<string, boolean>;

/**
 * Field render props passed to renderField
 */
export interface FieldRenderProps {
  /** Field configuration */
  field: FieldConfig;
  /** Current field value */
  value: FieldValue;
  /** All form values */
  formData: FormValues;
  /** Field error message */
  error?: string;
  /** Whether field has been touched */
  touched: boolean;
  /** Whether field is disabled */
  disabled: boolean;
  /** Whether field is read-only */
  readOnly: boolean;
  /** Handle value change */
  onChange: (value: FieldValue) => void;
  /** Handle field blur */
  onBlur: () => void;
}

/**
 * Section render props
 */
export interface SectionRenderProps {
  /** Section configuration */
  section: FormSectionConfig;
  /** Whether section is collapsed */
  isCollapsed: boolean;
  /** Toggle collapse */
  toggleCollapse: () => void;
  /** Rendered field elements */
  children: React.ReactNode;
}

/**
 * FormRenderer props
 */
export interface FormRendererProps<T extends DataRecord = DataRecord> {
  /** Form configuration from JSON */
  config: FormConfig;
  /** Current form values (controlled mode) */
  values?: T;
  /** Initial values (uncontrolled mode) */
  initialValues?: T;
  /** Validation errors from parent */
  errors?: FormErrors;
  /** Form submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
  /** Form cancel handler */
  onCancel?: () => void;
  /** Field value change handler */
  onChange?: (name: string, value: FieldValue, values: T) => void;
  /** Field blur handler */
  onBlur?: (name: string) => void;
  /** Validation error callback */
  onValidationError?: (errors: FormErrors) => void;
  /** Whether form is loading/submitting */
  loading?: boolean;
  /** Whether form is disabled */
  disabled?: boolean;
  /** Whether form is read-only */
  readOnly?: boolean;
  /** Custom field renderer */
  renderField?: (props: FieldRenderProps) => React.ReactNode;
  /** Custom section renderer */
  renderSection?: (props: SectionRenderProps) => React.ReactNode;
  /** Feature flags for conditional rendering */
  featureFlags?: Record<string, boolean>;
  /** Additional class name */
  className?: string;
  /** Hide form buttons */
  hideButtons?: boolean;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Custom header content */
  header?: React.ReactNode;
}

/**
 * FormRenderer ref interface
 */
export interface FormRendererRef<T extends DataRecord = DataRecord> {
  /** Get current form values */
  getValues: () => T;
  /** Set form values */
  setValues: (values: Partial<T>) => void;
  /** Set a single field value */
  setValue: (name: string, value: FieldValue) => void;
  /** Validate all fields */
  validate: () => boolean;
  /** Reset form to initial values */
  reset: () => void;
  /** Get validation errors */
  getErrors: () => FormErrors;
  /** Check if form is dirty */
  isDirty: () => boolean;
  /** Submit the form programmatically */
  submit: () => Promise<void>;
}

// =============================================================================
// DEFAULT FIELD RENDERER
// =============================================================================

/**
 * Default field renderer component
 */
function DefaultFieldRenderer({ 
  field, 
  value, 
  error, 
  touched, 
  disabled,
  readOnly,
  onChange, 
  onBlur,
}: FieldRenderProps): React.ReactElement {
  const { t } = useI18n();
  
  const inputId = `field-${field.name}`;
  const hasError = touched && !!error;

  // Determine input type based on field type
  const getInputType = (): string => {
    switch (field.type) {
      case 'email': return 'email';
      case 'password': return 'password';
      case 'number':
      case 'currency':
      case 'percent': return 'number';
      case 'date': return 'date';
      case 'datetime': return 'datetime-local';
      case 'time': return 'time';
      case 'url': return 'url';
      case 'phone': return 'tel';
      case 'color': return 'color';
      case 'range': return 'range';
      case 'hidden': return 'hidden';
      default: return 'text';
    }
  };

  // Render select field
  if (field.type === 'select' || field.type === 'multiselect') {
    return (
      <div className={cn('dui-field', hasError && 'dui-field--error')}>
        <label htmlFor={inputId} className="dui-field__label">
          {resolveLabel(String(field.label))}
          {field.required && <span className="dui-field__required">*</span>}
        </label>
        <select
          id={inputId}
          name={field.name}
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          className="dui-field__select"
          multiple={field.type === 'multiselect'}
        >
          {!field.required && <option value="">{resolveLabel('select_placeholder','Select...')}</option>}
          {field.options?.map((option) => (
            <option 
              key={String(option.value)} 
              value={String(option.value)}
              disabled={option.disabled}
            >
              {resolveLabel(String(option.label))}
            </option>
          ))}
        </select>
        {field.helpText && <p className="dui-field__help">{field.helpText}</p>}
        {hasError && <p className="dui-field__error">{error}</p>}
      </div>
    );
  }

  // Render checkbox/switch field
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div className={cn('dui-field dui-field--checkbox', hasError && 'dui-field--error')}>
        <label className="dui-field__checkbox-label">
          <input
            type="checkbox"
            id={inputId}
            name={field.name}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled || field.disabled}
            className={field.type === 'switch' ? 'dui-field__switch' : 'dui-field__checkbox'}
          />
          <span>{resolveLabel(String(field.label))}</span>
          {field.required && <span className="dui-field__required">*</span>}
        </label>
        {field.helpText && <p className="dui-field__help">{resolveLabel(String(field.helpText))}</p>}
        {hasError && <p className="dui-field__error">{error}</p>}
      </div>
    );
  }

  // Render textarea field
  if (field.type === 'textarea') {
    return (
      <div className={cn('dui-field', hasError && 'dui-field--error')}>
        <label htmlFor={inputId} className="dui-field__label">
          {resolveLabel(String(field.label))}
          {field.required && <span className="dui-field__required">*</span>}
        </label>
        <textarea
          id={inputId}
          name={field.name}
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          readOnly={readOnly || field.readOnly}
          placeholder={field.placeholder ? resolveLabel(String(field.placeholder)) : undefined}
          maxLength={field.maxLength}
          className="dui-field__textarea"
          rows={4}
        />
        {field.helpText && <p className="dui-field__help">{resolveLabel(String(field.helpText))}</p>}
        {hasError && <p className="dui-field__error">{error}</p>}
      </div>
    );
  }

  // Render radio group
  if (field.type === 'radio') {
    return (
      <div className={cn('dui-field', hasError && 'dui-field--error')}>
        <span className="dui-field__label">
          {resolveLabel(String(field.label))}
          {field.required && <span className="dui-field__required">*</span>}
        </span>
        <div className={cn(
          "dui-field__radio-group",
          field.layout === 'horizontal' && "dui-field__radio-group--horizontal",
          field.layout === 'vertical' && "dui-field__radio-group--vertical"
        )}>
          {field.options?.map((option) => (
            <label key={String(option.value)} className="dui-field__radio-label">
              <input
                type="radio"
                name={field.name}
                value={String(option.value)}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled || field.disabled || option.disabled}
                className="dui-field__radio"
              />
              <span>{resolveLabel(String(option.label))}</span>
            </label>
          ))}
        </div>
        {field.helpText && <p className="dui-field__help">{resolveLabel(String(field.helpText))}</p>}
        {hasError && <p className="dui-field__error">{error}</p>}
      </div>
    );
  }

  // Default: render input field

  // Apply optional display formatting when field is read-only / computed
  let displayValue: string | number | undefined = value as string | number | undefined;
  
  // Transform date/datetime values to HTML input format
  if ((field.type === 'date' || field.type === 'datetime' || field.type === 'time') && value) {
    try {
      const date = new Date(value as string);
      if (!isNaN(date.getTime())) {
        switch (field.type) {
          case 'date':
            displayValue = date.toISOString().split('T')[0];
            break;
          case 'datetime':
            displayValue = date.toISOString().slice(0, 16);
            break;
          case 'time':
            displayValue = date.toTimeString().slice(0, 5);
            break;
        }
      }
    } catch {
      // Keep original value if parsing fails
    }
  }
  
  const shouldFormat = typeof value === 'number' && (readOnly || field.readOnly || !!field.computed) && field.format && typeof field.format.toFixed === 'number';
  if (shouldFormat) {
    try {
      displayValue = (value as number).toFixed(field.format!.toFixed!);
    } catch {
      displayValue = value as number;
    }
  }

  return (
    <div className={cn('dui-field', hasError && 'dui-field--error')}>
      <label htmlFor={inputId} className="dui-field__label">
        {resolveLabel(String(field.label))}
        {field.required && <span className="dui-field__required">*</span>}
      </label>
      <input
        type={getInputType()}
        id={inputId}
        name={field.name}
        value={displayValue as string | number || ''}
        onChange={(e) => {
          let newValue: any = e.target.value;
          
          // Transform date/time inputs back to ISO format
          if ((field.type === 'date' || field.type === 'datetime' || field.type === 'time') && newValue) {
            try {
              if (field.type === 'date') {
                newValue = new Date(newValue + 'T00:00:00').toISOString();
              } else if (field.type === 'datetime') {
                newValue = new Date(newValue).toISOString();
              } else if (field.type === 'time') {
                // Keep time as-is
                newValue = newValue;
              }
            } catch {
              // Keep original value if parsing fails
            }
          } else if (field.type === 'number' || field.type === 'currency' || field.type === 'percent') {
            newValue = newValue === '' ? undefined : parseFloat(newValue);
          }
          
          onChange(newValue);
        }}
        onBlur={onBlur}
        disabled={disabled || field.disabled}
        readOnly={readOnly || field.readOnly}
        placeholder={field.placeholder ? resolveLabel(String(field.placeholder)) : undefined}
        min={field.min}
        max={field.max}
        maxLength={field.maxLength}
        className="dui-field__input"
      />
      {field.helpText && <p className="dui-field__help">{resolveLabel(String(field.helpText))}</p>}
      {hasError && <p className="dui-field__error">{error}</p>}
    </div>
  );
}

// =============================================================================
// DEFAULT SECTION RENDERER
// =============================================================================

/**
 * Default section renderer component
 */
function DefaultSectionRenderer({
  section,
  isCollapsed,
  toggleCollapse,
  children,
}: SectionRenderProps): React.ReactElement {
  return (
    <div className="dui-form-section">
      <div 
        className={cn(
          'dui-form-section__header',
          section.collapsible && 'dui-form-section__header--collapsible'
        )}
        onClick={section.collapsible ? toggleCollapse : undefined}
      >
        {section.icon && (
          <span className="dui-form-section__icon">{section.icon}</span>
        )}
        <div className="dui-form-section__title-group">
          <h3 className="dui-form-section__title">{typeof section.title === 'string' ? resolveLabel(section.title) : section.title}</h3>
          {section.description && (
            <p className="dui-form-section__description">{typeof section.description === 'string' ? resolveLabel(section.description) : section.description}</p>
          )}
        </div>
        {section.collapsible && (
          <span className={cn(
            'dui-form-section__collapse-icon',
            isCollapsed && 'dui-form-section__collapse-icon--collapsed'
          )}>
            ▼
          </span>
        )}
      </div>
      {!isCollapsed && (
        <div 
          className="dui-form-section__content"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${section.columns || 1}, minmax(0, 1fr))`,
            gap: '1rem',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FORM RENDERER COMPONENT
// =============================================================================

/**
 * FormRenderer component
 * 
 * Renders a dynamic form based on JSON configuration.
 * 
 * @example
 * ```tsx
 * <FormRenderer
 *   config={formConfig}
 *   values={formData}
 *   onChange={(name, value, allValues) => setFormData(allValues)}
 *   onSubmit={(values) => saveData(values)}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
function FormRendererInner<T extends DataRecord = DataRecord>(
  props: FormRendererProps<T>,
  ref: React.ForwardedRef<FormRendererRef<T>>
): React.ReactElement {
  const {
    config,
    values: controlledValues,
    initialValues = {} as T,
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
    header,
  } = props;

  const { t } = useI18n();

  // Internal state for uncontrolled mode
  const [internalValues, setInternalValues] = useState<T>(initialValues);
  const [internalErrors, setInternalErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (config.tabs && config.tabs.length > 0) {
      return config.tabs[0].id;
    }
    return '';
  });

  // Collapsed sections state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    (config.sections || []).forEach((section) => {
      if (section.defaultCollapsed) {
        initial.add(section.id);
      }
    });
    return initial;
  });

  // Determine if controlled or uncontrolled
  const isControlled = controlledValues !== undefined;
  const values = isControlled ? controlledValues : internalValues;
  const errors = controlledErrors || internalErrors;

  // Store initial values for dirty check
  const initialValuesRef = React.useRef(initialValues);

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * Check if a field should be visible based on showWhen conditions
   */
  const isFieldVisible = useCallback((field: FieldConfig): boolean => {
    if (field.type === 'hidden') return false;
    if (!field.showWhen) return true;
    return evaluateConditions(field.showWhen as any, values as DataRecord, featureFlags);
  }, [values, featureFlags]);

  /**
   * Check if a section should be visible
   */
  const isSectionVisible = useCallback((section: FormSectionConfig): boolean => {
    if (!section.showWhen) return true;
    return evaluateConditions(section.showWhen as any, values as DataRecord, featureFlags);
  }, [values, featureFlags]);

  /**
   * Check if a tab should be visible
   */
  const isTabVisible = useCallback((tab: TabConfig): boolean => {
    if (!tab.showWhen) return true;
    return evaluateConditions(tab.showWhen as any, values as DataRecord, featureFlags);
  }, [values, featureFlags]);

  /**
   * Get computed value for a field
   */
  const getComputedValue = useCallback((field: FieldConfig): FieldValue => {
    if (!field.computed || !field.computed.formula) {
      return getNestedValue(values as DataRecord, field.name);
    }

    const { formula, deps } = field.computed;

    // Check if all dependencies have values
    const hasAllDeps = deps.every((dep) => {
      const depValue = getNestedValue(values as DataRecord, dep);
      return depValue !== undefined && depValue !== null && depValue !== '';
    });

    if (!hasAllDeps) {
      return getNestedValue(values as DataRecord, field.name);
    }

    try {
      // Build context with dependency values
      const context: Record<string, number> = {};
      for (const dep of deps) {
        const depValue = getNestedValue(values as DataRecord, dep);
        context[dep] = typeof depValue === 'number' ? depValue : parseFloat(String(depValue)) || 0;
      }

      // Replace field references in formula
      let expression = formula;
      for (const [key, value] of Object.entries(context)) {
        expression = expression.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value));
      }

      // Safe arithmetic evaluation (only allow numbers and math operators)
      const safeExpression = expression.replace(/[^0-9+\-*/().Math\s]/g, '');
      const fn = new Function(`return ${safeExpression}`);
      const result = fn();

      return typeof result === 'number' && !isNaN(result) ? result : undefined;
    } catch {
      return getNestedValue(values as DataRecord, field.name);
    }
  }, [values]);

  /**
   * Get all visible fields from all sections
   */
  const getVisibleFields = useCallback((): FieldConfig[] => {
    const sections = config.tabs 
      ? config.tabs.filter(isTabVisible).flatMap(t => t.sections)
      : (config.sections || []);
      
    return sections
      .filter(isSectionVisible)
      .flatMap((section) => section.fields.filter(isFieldVisible));
  }, [config.tabs, config.sections, isTabVisible, isSectionVisible, isFieldVisible]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((field: FieldConfig): string | undefined => {
    const value = field.computed 
      ? getComputedValue(field) 
      : getNestedValue(values as DataRecord, field.name);
    const result = coreValidateField(value, field, values as DataRecord);
    return result.valid ? undefined : result.message;
  }, [values, getComputedValue]);

  /**
   * Validate all visible fields
   */
  const validateAll = useCallback((): boolean => {
    const visibleFields = getVisibleFields();
    const newErrors: FormErrors = {};
    let isValid = true;

    for (const field of visibleFields) {
      const error = validateField(field);
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
  }, [getVisibleFields, validateField, isControlled, onValidationError]);

  /**
   * Set a single field value
   */
  const setValue = useCallback((name: string, value: FieldValue) => {
    const newValues = { ...values, [name]: value } as T;
    
    if (!isControlled) {
      setInternalValues(newValues);
    }

    if (onChange) {
      onChange(name, value, newValues);
    }
  }, [values, isControlled, onChange]);

  /**
   * Set multiple field values
   */
  const setValues = useCallback((newValues: Partial<T>) => {
    const merged = { ...values, ...newValues } as T;
    
    if (!isControlled) {
      setInternalValues(merged);
    }

    // Call onChange for each changed field
    if (onChange) {
      for (const [name, value] of Object.entries(newValues)) {
        onChange(name, value as FieldValue, merged);
      }
    }
  }, [values, isControlled, onChange]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    if (!isControlled) {
      setInternalValues(initialValuesRef.current);
      setInternalErrors({});
    }
    setTouched({});
  }, [isControlled]);

  /**
   * Check if form is dirty (values changed from initial)
   */
  const isDirty = useCallback((): boolean => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (loading || isSubmitting) return;

    // Mark all fields as touched
    const allTouched: FormTouched = {};
    getVisibleFields().forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    // Validate
    const isValid = validateAll();
    if (!isValid) return;

    // Submit
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [loading, isSubmitting, getVisibleFields, validateAll, onSubmit, values]);

  /**
   * Handle field change
   */
  const handleFieldChange = useCallback((name: string, value: FieldValue) => {
    setValue(name, value);

    // Validate on change if validationMode is 'onChange'
    if (config.validationMode === 'onChange') {
      const field = getVisibleFields().find((f) => f.name === name);
      if (field) {
        const error = validateField(field);
        if (!isControlled) {
          setInternalErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
      }
    }
  }, [setValue, config.validationMode, getVisibleFields, validateField, isControlled]);

  /**
   * Handle field blur
   */
  const handleFieldBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (onBlur) {
      onBlur(name);
    }

    // Validate on blur if validationMode is 'onBlur'
    if (config.validationMode === 'onBlur' || !config.validationMode) {
      const field = getVisibleFields().find((f) => f.name === name);
      if (field) {
        const error = validateField(field);
        if (!isControlled) {
          setInternalErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
      }
    }
  }, [onBlur, config.validationMode, getVisibleFields, validateField, isControlled]);

  /**
   * Toggle section collapse
   */
  const toggleSectionCollapse = useCallback((sectionId: string) => {
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

  // ==========================================================================
  // IMPERATIVE HANDLE
  // ==========================================================================

  useImperativeHandle(ref, () => ({
    getValues: () => values,
    setValues,
    setValue,
    validate: validateAll,
    reset,
    getErrors: () => errors,
    isDirty,
    submit: handleSubmit,
  }), [values, setValues, setValue, validateAll, reset, errors, isDirty, handleSubmit]);

  // ==========================================================================
  // RENDER FIELD
  // ==========================================================================

  const renderFieldElement = useCallback((field: FieldConfig): React.ReactNode => {
    if (!isFieldVisible(field)) return null;

    const fieldValue = field.computed 
      ? getComputedValue(field) 
      : getNestedValue(values as DataRecord, field.name);

    const renderProps: FieldRenderProps = {
      field,
      value: fieldValue,
      formData: values as FormValues,
      error: errors[field.name],
      touched: !!touched[field.name],
      disabled: disabled || loading,
      readOnly: readOnly || !!field.computed,
      onChange: (value) => handleFieldChange(field.name, value),
      onBlur: () => handleFieldBlur(field.name),
    };

    // Use custom renderer if provided
    if (customRenderField) {
      return (
        <div 
          key={field.name}
          style={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}
        >
          {customRenderField(renderProps)}
        </div>
      );
    }

    // Use default renderer
    return (
      <div 
        key={field.name}
        style={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}
      >
        <DefaultFieldRenderer {...renderProps} />
      </div>
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

  // ==========================================================================
  // RENDER SECTION
  // ==========================================================================

  const renderSectionElement = useCallback((section: FormSectionConfig): React.ReactNode => {
    if (!isSectionVisible(section)) return null;

    const isCollapsed = collapsedSections.has(section.id);
    const visibleFields = section.fields.filter(isFieldVisible);

    if (visibleFields.length === 0) return null;

    const children = visibleFields.map(renderFieldElement);

    const sectionProps: SectionRenderProps = {
      section,
      isCollapsed,
      toggleCollapse: () => toggleSectionCollapse(section.id),
      children,
    };

    // Use custom renderer if provided
    if (customRenderSection) {
      return <React.Fragment key={section.id}>{customRenderSection(sectionProps)}</React.Fragment>;
    }

    // Use default renderer
    return <DefaultSectionRenderer key={section.id} {...sectionProps} />;
  }, [
    isSectionVisible, 
    collapsedSections, 
    isFieldVisible, 
    renderFieldElement, 
    toggleSectionCollapse, 
    customRenderSection
  ]);

  // ==========================================================================
  // MEMOIZED SECTIONS
  // ==========================================================================

  const renderedSections = useMemo(() => {
    let sectionsToRender: FormSectionConfig[] = [];
    
    if (config.tabs && config.tabs.length > 0) {
      const currentTab = config.tabs.find(t => t.id === activeTab);
      if (currentTab) {
        sectionsToRender = currentTab.sections;
      }
    } else {
      sectionsToRender = config.sections || [];
    }

    return (
      <div className="grid grid-cols-6 gap-6">
        {sectionsToRender.map(section => {
          const content = renderSectionElement(section);
          if (!content) return null;

          const width = section.width || 'full';
          let colSpan = 'col-span-6';
          if (width === '1/2') colSpan = 'col-span-3';
          if (width === '1/3') colSpan = 'col-span-2';
          if (width === '2/3') colSpan = 'col-span-4';

          return (
            <div key={section.id} className={colSpan}>
              {content}
            </div>
          );
        })}
      </div>
    );
  }, [config.tabs, config.sections, activeTab, renderSectionElement]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  const submitLabel = config.submitLabel || t('form.submit');
  const cancelLabel = config.cancelLabel || t('form.cancel');
  const isFormDisabled = disabled || loading || isSubmitting;

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn('dui-form', className)}
    >
      {/* Header */}
      {(config.title || header) && (
        <div className="dui-form__header">
          {header || (
            <>
              <h2 className="dui-form__title">{config.title}</h2>
              {config.description && (
                <p className="dui-form__description">{config.description}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Tabs */}
      {config.tabs && config.tabs.length > 0 && (
        <TabRenderer
          tabs={config.tabs.filter(isTabVisible).map(t => ({
            id: t.id,
            label: t.label,
            icon: t.icon as any
          }))}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />
      )}

      {/* Sections */}
      <div className="dui-form__body">
        {renderedSections}
      </div>

      {/* Footer / Buttons */}
      {(footer || (!hideButtons && (onSubmit || onCancel || config.showCancel))) && (
        <div className="dui-form__footer">
          {footer || (
            <>
              {(onCancel || config.showCancel) && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isFormDisabled}
                  className="dui-form__button dui-form__button--cancel"
                >
                  {cancelLabel}
                </button>
              )}
              {onSubmit && (
                <button
                  type="submit"
                  disabled={isFormDisabled}
                  className="dui-form__button dui-form__button--submit"
                >
                  {(loading || isSubmitting) ? t('form.submitting') : submitLabel}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
}

// Forward ref with generic support
export const FormRenderer = forwardRef(FormRendererInner) as <T extends DataRecord = DataRecord>(
  props: FormRendererProps<T> & { ref?: React.ForwardedRef<FormRendererRef<T>> }
) => React.ReactElement;

// Set display name
(FormRenderer as React.FC).displayName = 'FormRenderer';

export default FormRenderer;
