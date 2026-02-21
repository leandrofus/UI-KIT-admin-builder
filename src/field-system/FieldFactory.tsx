/**
 * @fileoverview Field Factory - Create field instances from configuration
 * 
 * Provides factory functions to create field components from JSON configuration,
 * with support for computed fields, conditional visibility, and validation.
 * 
 * @module field-system/FieldFactory
 */

import React, { useMemo, useCallback } from 'react';
import { useI18n as useTranslation } from '../i18n';
import type { FieldConfig, FieldValue, DataRecord, FormSection } from '../core/types';
import { evaluateConditions, validateField } from '../core/validators';
import { getNestedValue } from '../core/utils';
import { useFieldRegistry, type BaseFieldProps, type FieldComponent } from './FieldRegistry';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Field factory options
 */
export interface FieldFactoryOptions {
  /** Additional props to pass to all fields */
  defaultProps?: Partial<BaseFieldProps>;
  /** Wrapper component for fields */
  wrapper?: React.ComponentType<{ field: FieldConfig; children: React.ReactNode }>;
  /** Error display component */
  errorComponent?: React.ComponentType<{ error: string }>;
  /** Label component */
  labelComponent?: React.ComponentType<{ field: FieldConfig }>;
  /** Custom field component overrides */
  overrides?: Record<string, FieldComponent>;
  /** Fallback component for unknown field types */
  fallback?: FieldComponent;
}

/**
 * Rendered field props
 */
export interface RenderedFieldProps {
  field: FieldConfig;
  value: FieldValue;
  formData: DataRecord;
  onChange: (name: string, value: FieldValue) => void;
  onBlur?: (name: string) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  disabled?: boolean;
  readOnly?: boolean;
}

// =============================================================================
// FIELD FACTORY HOOK
// =============================================================================

/**
 * Hook to create field components from configuration
 * 
 * @example
 * const { renderField, renderSection, isFieldVisible } = useFieldFactory({
 *   defaultProps: { className: 'my-field' },
 * });
 * 
 * return (
 *   <form>
 *     {fields.map(field => renderField({
 *       field,
 *       value: values[field.name],
 *       formData: values,
 *       onChange: handleChange,
 *     }))}
 *   </form>
 * );
 */
export function useFieldFactory(options: FieldFactoryOptions = {}) {
  const registry = useFieldRegistry();
  const { t } = useTranslation();
  const {
    defaultProps = {},
    wrapper: Wrapper,
    errorComponent: ErrorComponent,
    labelComponent: LabelComponent,
    overrides = {},
    fallback: FallbackComponent,
  } = options;

  /**
   * Check if a field should be visible
   */
  const isFieldVisible = useCallback((field: FieldConfig, formData: DataRecord): boolean => {
    // Hidden type is always invisible in forms
    if (field.type === 'hidden') return false;

    // Check showWhen condition
    if (field.showWhen) {
      return evaluateConditions(field.showWhen, formData);
    }

    return true;
  }, []);

  /**
   * Get computed field value
   */
  const getComputedValue = useCallback((field: FieldConfig, formData: DataRecord): FieldValue => {
    if (!field.computed || !field.computed.formula) {
      return getNestedValue(formData, field.name);
    }

    const { formula, deps } = field.computed;

    // Check if all dependencies have values
    const hasAllDeps = deps.every(dep => {
      const value = getNestedValue(formData, dep);
      return value !== undefined && value !== null && value !== '';
    });

    if (!hasAllDeps) {
      return getNestedValue(formData, field.name);
    }

    try {
      // Build context with dependency values
      const context: Record<string, number> = {};
      for (const dep of deps) {
        const value = getNestedValue(formData, dep);
        context[dep] = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
      }

      // Replace field references in formula
      let expression = formula;
      for (const [key, value] of Object.entries(context)) {
        expression = expression.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value));
      }

      // Safe arithmetic evaluation
      const safeExpression = expression.replace(/[^0-9+\-*/().Math\s]/g, '');
      const fn = new Function(`return ${safeExpression}`);
      const result = fn();

      return typeof result === 'number' && !isNaN(result) ? result : undefined;
    } catch {
      return getNestedValue(formData, field.name);
    }
  }, []);

  /**
   * Render a single field
   */
  const renderField = useCallback((props: RenderedFieldProps): React.ReactElement | null => {
    const { 
      field, 
      value: propValue, 
      formData, 
      onChange, 
      onBlur, 
      errors = {}, 
      touched = {},
      disabled: formDisabled = false,
      readOnly: formReadOnly = false,
    } = props;

    // Check visibility
    if (!isFieldVisible(field, formData)) {
      return null;
    }

    // Get component from overrides or registry
    let Component: FieldComponent | undefined = overrides[field.name] || overrides[field.type];
    
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

    // Compute value if needed
    const value = field.computed ? getComputedValue(field, formData) : propValue;

    // Build field props
    const fieldProps: BaseFieldProps = {
      ...defaultProps,
      field,
      value,
      onChange: (newValue: FieldValue) => onChange(field.name, newValue),
      onBlur: onBlur ? () => onBlur(field.name) : undefined,
      error: errors[field.name],
      touched: touched[field.name],
      formData,
      disabled: formDisabled || field.disabled,
      readOnly: formReadOnly || field.readOnly || !!field.computed,
    };

    // Build the field element
    const fieldElement = React.createElement(Component, {
      ...fieldProps,
      key: field.name,
    });

    // Optionally wrap with error and label
    const withError = ErrorComponent && errors[field.name] && touched[field.name]
      ? React.createElement(React.Fragment, null,
          fieldElement,
          React.createElement(ErrorComponent, { error: errors[field.name] })
        )
      : fieldElement;

    const withLabel = LabelComponent
      ? React.createElement(React.Fragment, null,
          React.createElement(LabelComponent, { field }),
          withError
        )
      : withError;

    // Apply wrapper if provided
    if (Wrapper) {
      return React.createElement(Wrapper, { field, children: withLabel, key: field.name });
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
    Wrapper,
  ]);

  /**
   * Render a section of fields
   */
  const renderSection = useCallback((
    section: FormSection, 
    formData: DataRecord,
    handlers: {
      onChange: (name: string, value: FieldValue) => void;
      onBlur?: (name: string) => void;
      errors?: Record<string, string>;
      touched?: Record<string, boolean>;
      disabled?: boolean;
      readOnly?: boolean;
    }
  ): React.ReactElement | null => {
    // Check section visibility
    if (section.showWhen && !evaluateConditions(section.showWhen, formData)) {
      return null;
    }

    const fields = section.fields.map(field => 
      renderField({
        field,
        value: getNestedValue(formData, field.name),
        formData,
        ...handlers,
      })
    ).filter(Boolean);

    if (fields.length === 0) {
      return null;
    }

    return React.createElement(
      'div',
      { 
        key: section.id || section.title, 
        className: 'form-section',
        'data-section': section.id || section.title,
      },
      section.title && React.createElement('h3', { className: 'section-title' }, typeof section.title === 'string' ? t(section.title) : section.title),
      section.description && React.createElement('p', { className: 'section-description' }, typeof section.description === 'string' ? t(section.description) : section.description),
      React.createElement('div', { className: 'section-fields' }, fields)
    );
  }, [renderField]);

  /**
   * Render all sections
   */
  const renderSections = useCallback((
    sections: FormSection[],
    formData: DataRecord,
    handlers: {
      onChange: (name: string, value: FieldValue) => void;
      onBlur?: (name: string) => void;
      errors?: Record<string, string>;
      touched?: Record<string, boolean>;
      disabled?: boolean;
      readOnly?: boolean;
    }
  ): React.ReactElement[] => {
    return sections
      .map(section => renderSection(section, formData, handlers))
      .filter((el): el is React.ReactElement => el !== null);
  }, [renderSection]);

  /**
   * Get visible fields from sections
   */
  const getVisibleFields = useCallback((sections: FormSection[], formData: DataRecord): FieldConfig[] => {
    return sections
      .filter(section => !section.showWhen || evaluateConditions(section.showWhen, formData))
      .flatMap(section => section.fields)
      .filter(field => isFieldVisible(field, formData));
  }, [isFieldVisible]);

  /**
   * Validate visible fields
   */
  const validateVisibleFields = useCallback((
    sections: FormSection[], 
    formData: DataRecord
  ): Record<string, string> => {
    const errors: Record<string, string> = {};
    const visibleFields = getVisibleFields(sections, formData);

    for (const field of visibleFields) {
      const value = getNestedValue(formData, field.name);
      const result = validateField(value, field, formData);
      
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
    validateVisibleFields,
  };
}

// =============================================================================
// STANDALONE FACTORY FUNCTION
// =============================================================================

/**
 * Create a field factory with the given options
 * For use outside of React components
 */
export function createFieldFactory(options: FieldFactoryOptions = {}) {
  const { overrides = {}, fallback } = options;

  return {
    /**
     * Get a field component by type
     */
    getComponent(type: string): FieldComponent | undefined {
      return overrides[type] || fallback;
    },

    /**
     * Check if a field type is supported
     */
    isSupported(type: string): boolean {
      return type in overrides || !!fallback;
    },

    /**
     * Add an override
     */
    addOverride(type: string, component: FieldComponent): void {
      overrides[type] = component;
    },
  };
}

export default useFieldFactory;
