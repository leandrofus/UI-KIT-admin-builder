/**
 * @fileoverview Hook for managing form state
 * 
 * Handles form values, validation, touched state, and submission.
 * Designed for dynamic forms with conditional fields.
 * 
 * @module hooks/useFormState
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import type { 
  DataRecord, 
  FieldValue, 
  FieldConfig, 
  FormSection,
  FieldCondition 
} from '../core/types';
import { 
  validateField, 
  validateForm, 
  evaluateConditions,
  isEmpty 
} from '../core/validators';
import { setNestedValue, getNestedValue } from '../core/utils';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Form state
 */
export interface FormState<T = DataRecord> {
  /** Current form values */
  values: T;
  /** Validation errors by field name */
  errors: Record<string, string>;
  /** Which fields have been touched */
  touched: Record<string, boolean>;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Whether form has been modified */
  isDirty: boolean;
  /** Whether form is valid */
  isValid: boolean;
  /** Submit count */
  submitCount: number;
}

/**
 * Form actions
 */
export interface FormActions<T = DataRecord> {
  /** Set a single field value */
  setValue: (name: string, value: FieldValue) => void;
  /** Set multiple values at once */
  setValues: (values: Partial<T>) => void;
  /** Mark a field as touched */
  setTouched: (name: string, isTouched?: boolean) => void;
  /** Mark multiple fields as touched */
  setAllTouched: () => void;
  /** Set a field error manually */
  setError: (name: string, error: string | undefined) => void;
  /** Clear all errors */
  clearErrors: () => void;
  /** Validate a single field */
  validateField: (name: string) => boolean;
  /** Validate all fields */
  validateAll: () => boolean;
  /** Handle field change (sets value and optionally validates) */
  handleChange: (name: string, value: FieldValue) => void;
  /** Handle field blur (marks touched and validates) */
  handleBlur: (name: string) => void;
  /** Submit the form */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /** Reset form to initial values */
  reset: (newValues?: Partial<T>) => void;
  /** Get field props helper */
  getFieldProps: (name: string) => FieldProps;
  /** Check if a field should be visible */
  isFieldVisible: (field: FieldConfig) => boolean;
  /** Get all visible fields from sections */
  getVisibleFields: (sections: FormSection[]) => FieldConfig[];
}

/**
 * Props to spread on a field component
 */
export interface FieldProps {
  name: string;
  value: FieldValue;
  error?: string;
  touched: boolean;
  onChange: (value: FieldValue) => void;
  onBlur: () => void;
}

/**
 * Options for useFormState hook
 */
export interface UseFormStateOptions<T = DataRecord> {
  /** Initial form values */
  initialValues: T;
  /** Field configurations for validation */
  fields?: FieldConfig[];
  /** Form sections (alternative to fields) */
  sections?: FormSection[];
  /** Validation mode */
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
  /** Change handler */
  onChange?: (name: string, value: FieldValue, values: T) => void;
  /** Validation error handler */
  onValidationError?: (errors: Record<string, string>) => void;
  /** Whether to validate on mount */
  validateOnMount?: boolean;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for managing form state
 * 
 * @example
 * const { state, actions } = useFormState({
 *   initialValues: { name: '', email: '' },
 *   fields: [
 *     { name: 'name', type: 'text', label: 'Name', required: true },
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *   ],
 *   onSubmit: async (values) => {
 *     await api.post('/users', values);
 *   },
 * });
 */
export function useFormState<T extends DataRecord = DataRecord>(
  options: UseFormStateOptions<T>
): { state: FormState<T>; actions: FormActions<T> } {
  const {
    initialValues,
    fields: fieldsProp = [],
    sections = [],
    validationMode = 'onBlur',
    onSubmit,
    onChange,
    onValidationError,
    validateOnMount = false,
  } = options;

  // Extract fields from sections if provided
  const fields = useMemo(() => {
    if (fieldsProp.length > 0) return fieldsProp;
    return sections.flatMap(section => section.fields);
  }, [fieldsProp, sections]);

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Keep track of initial values for dirty check
  const initialValuesRef = useRef(initialValues);

  // ==========================================================================
  // COMPUTED
  // ==========================================================================

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // ==========================================================================
  // FIELD VISIBILITY
  // ==========================================================================

  const isFieldVisible = useCallback((field: FieldConfig): boolean => {
    if (!field.showWhen) return true;
    return evaluateConditions(field.showWhen, values as DataRecord);
  }, [values]);

  const getVisibleFields = useCallback((formSections: FormSection[]): FieldConfig[] => {
    return formSections
      .filter(section => {
        if (!section.showWhen) return true;
        return evaluateConditions(section.showWhen, values as DataRecord);
      })
      .flatMap(section => section.fields.filter(isFieldVisible));
  }, [values, isFieldVisible]);

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateSingleField = useCallback((name: string): boolean => {
    const field = fields.find(f => f.name === name);
    if (!field) return true;

    // Skip validation for hidden fields
    if (!isFieldVisible(field)) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
      return true;
    }

    const value = getNestedValue(values as DataRecord, name);
    const result = validateField(value, field, values as DataRecord);

    if (!result.valid && result.message) {
      setErrors(prev => ({ ...prev, [name]: result.message! }));
      return false;
    } else {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
      return true;
    }
  }, [fields, values, isFieldVisible]);

  const validateAllFields = useCallback((): boolean => {
    const visibleFields = fields.filter(isFieldVisible);
    const result = validateForm(values as DataRecord, visibleFields);

    setErrors(result.errors);

    if (!result.valid && onValidationError) {
      onValidationError(result.errors);
    }

    return result.valid;
  }, [fields, values, isFieldVisible, onValidationError]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setValue = useCallback((name: string, value: FieldValue) => {
    setValues(prev => setNestedValue(prev as DataRecord, name, value) as T);

    // Call onChange callback
    if (onChange) {
      const newValues = setNestedValue(values as DataRecord, name, value) as T;
      onChange(name, value, newValues);
    }

    // Validate on change if configured
    if (validationMode === 'onChange' && touched[name]) {
      // Defer validation to next tick to use updated values
      setTimeout(() => validateSingleField(name), 0);
    }
  }, [onChange, values, validationMode, touched, validateSingleField]);

  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldTouched = useCallback((name: string, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const setAllFieldsTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
  }, [fields]);

  const setFieldError = useCallback((name: string, error: string | undefined) => {
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleChange = useCallback((name: string, value: FieldValue) => {
    setValue(name, value);
  }, [setValue]);

  const handleBlur = useCallback((name: string) => {
    setFieldTouched(name, true);

    if (validationMode === 'onBlur' || validationMode === 'onChange') {
      validateSingleField(name);
    }
  }, [setFieldTouched, validationMode, validateSingleField]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitCount(c => c + 1);
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

  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues 
      ? { ...initialValuesRef.current, ...newValues }
      : initialValuesRef.current;
    
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);

    if (newValues) {
      initialValuesRef.current = resetValues;
    }
  }, []);

  const getFieldProps = useCallback((name: string): FieldProps => {
    return {
      name,
      value: getNestedValue(values as DataRecord, name),
      error: touched[name] ? errors[name] : undefined,
      touched: touched[name] || false,
      onChange: (value: FieldValue) => handleChange(name, value),
      onBlur: () => handleBlur(name),
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  // ==========================================================================
  // RETURN
  // ==========================================================================

  const state: FormState<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    submitCount,
  };

  const actions: FormActions<T> = {
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
    getVisibleFields,
  };

  return { state, actions };
}

export default useFormState;
