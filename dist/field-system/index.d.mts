import * as React from 'react';
import React__default, { ComponentType } from 'react';
import { h as FieldValue, e as FieldConfig, D as DataRecord, l as FormSection } from '../types-L6joewgw.mjs';

/**
 * Props passed to all field components
 */
interface BaseFieldProps<T = FieldValue> {
    /** Field configuration */
    field: FieldConfig;
    /** Current field value */
    value: T;
    /** Change handler */
    onChange: (value: T) => void;
    /** Blur handler */
    onBlur?: () => void;
    /** Validation error */
    error?: string;
    /** Whether field has been touched */
    touched?: boolean;
    /** Complete form data (for conditional logic) */
    formData?: DataRecord;
    /** Whether field is disabled */
    disabled?: boolean;
    /** Whether field is read-only */
    readOnly?: boolean;
    /** Additional className */
    className?: string;
}
/**
 * Field component type
 */
type FieldComponent<T = FieldValue> = ComponentType<BaseFieldProps<T>>;
/**
 * Field registration info
 */
interface FieldRegistration {
    /** Field component */
    component: FieldComponent;
    /** Field type identifier */
    type: string;
    /** Human-readable name */
    displayName?: string;
    /** Description */
    description?: string;
    /** Default props */
    defaultProps?: Partial<FieldConfig>;
    /** Whether this field supports multiple values */
    isMultiValue?: boolean;
    /** Value serializer (for complex values) */
    serialize?: (value: FieldValue) => string;
    /** Value deserializer */
    deserialize?: (value: string) => FieldValue;
}
/**
 * Registry options
 */
interface FieldRegistryOptions {
    /** Whether to throw on duplicate registration */
    throwOnDuplicate?: boolean;
    /** Whether to allow overwriting existing registrations */
    allowOverwrite?: boolean;
}
/**
 * Field Registry - Manages custom field component registrations
 *
 * @example
 * // Create a registry
 * const registry = new FieldRegistry();
 *
 * // Register a custom field
 * registry.register({
 *   type: 'color-picker',
 *   component: ColorPickerField,
 *   displayName: 'Color Picker',
 * });
 *
 * // Get the component
 * const ColorField = registry.get('color-picker');
 */
declare class FieldRegistry {
    private fields;
    private options;
    constructor(options?: FieldRegistryOptions);
    /**
     * Register a field type
     */
    register(registration: FieldRegistration): this;
    /**
     * Register multiple field types
     */
    registerMany(registrations: FieldRegistration[]): this;
    /**
     * Get a field component by type
     */
    get(type: string): FieldComponent | undefined;
    /**
     * Get full registration info
     */
    getRegistration(type: string): FieldRegistration | undefined;
    /**
     * Check if a field type is registered
     */
    has(type: string): boolean;
    /**
     * Remove a field registration
     */
    unregister(type: string): boolean;
    /**
     * Get all registered field types
     */
    getTypes(): string[];
    /**
     * Get all registrations
     */
    getAll(): FieldRegistration[];
    /**
     * Clear all registrations
     */
    clear(): void;
    /**
     * Clone the registry
     */
    clone(): FieldRegistry;
    /**
     * Merge another registry into this one
     */
    merge(other: FieldRegistry): this;
}
/**
 * Get the default registry (creates one if needed)
 */
declare function getDefaultRegistry(): FieldRegistry;
/**
 * Set the default registry
 */
declare function setDefaultRegistry(registry: FieldRegistry): void;
/**
 * Register a field to the default registry
 */
declare function registerField(registration: FieldRegistration): void;
/**
 * Register multiple fields to the default registry
 */
declare function registerFields(registrations: FieldRegistration[]): void;
/**
 * Get a field from the default registry
 */
declare function getField(type: string): FieldComponent | undefined;
/**
 * Field Registry Context
 */
declare const FieldRegistryContext: React.Context<FieldRegistry | null>;
/**
 * Hook to access the field registry
 */
declare function useFieldRegistry(): FieldRegistry;

/**
 * @fileoverview Field Factory - Create field instances from configuration
 *
 * Provides factory functions to create field components from JSON configuration,
 * with support for computed fields, conditional visibility, and validation.
 *
 * @module field-system/FieldFactory
 */

/**
 * Field factory options
 */
interface FieldFactoryOptions {
    /** Additional props to pass to all fields */
    defaultProps?: Partial<BaseFieldProps>;
    /** Wrapper component for fields */
    wrapper?: React__default.ComponentType<{
        field: FieldConfig;
        children: React__default.ReactNode;
    }>;
    /** Error display component */
    errorComponent?: React__default.ComponentType<{
        error: string;
    }>;
    /** Label component */
    labelComponent?: React__default.ComponentType<{
        field: FieldConfig;
    }>;
    /** Custom field component overrides */
    overrides?: Record<string, FieldComponent>;
    /** Fallback component for unknown field types */
    fallback?: FieldComponent;
}
/**
 * Rendered field props
 */
interface RenderedFieldProps {
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
declare function useFieldFactory(options?: FieldFactoryOptions): {
    renderField: (props: RenderedFieldProps) => React__default.ReactElement | null;
    renderSection: (section: FormSection, formData: DataRecord, handlers: {
        onChange: (name: string, value: FieldValue) => void;
        onBlur?: (name: string) => void;
        errors?: Record<string, string>;
        touched?: Record<string, boolean>;
        disabled?: boolean;
        readOnly?: boolean;
    }) => React__default.ReactElement | null;
    renderSections: (sections: FormSection[], formData: DataRecord, handlers: {
        onChange: (name: string, value: FieldValue) => void;
        onBlur?: (name: string) => void;
        errors?: Record<string, string>;
        touched?: Record<string, boolean>;
        disabled?: boolean;
        readOnly?: boolean;
    }) => React__default.ReactElement[];
    isFieldVisible: (field: FieldConfig, formData: DataRecord) => boolean;
    getVisibleFields: (sections: FormSection[], formData: DataRecord) => FieldConfig[];
    getComputedValue: (field: FieldConfig, formData: DataRecord) => FieldValue;
    validateVisibleFields: (sections: FormSection[], formData: DataRecord) => Record<string, string>;
};
/**
 * Create a field factory with the given options
 * For use outside of React components
 */
declare function createFieldFactory(options?: FieldFactoryOptions): {
    /**
     * Get a field component by type
     */
    getComponent(type: string): FieldComponent | undefined;
    /**
     * Check if a field type is supported
     */
    isSupported(type: string): boolean;
    /**
     * Add an override
     */
    addOverride(type: string, component: FieldComponent): void;
};

/**
 * @fileoverview Base Field Components - Standard field implementations
 *
 * Provides base implementations for common field types that can be
 * used as-is or extended for custom behavior.
 *
 * @module field-system/fields
 */

interface TextFieldProps extends BaseFieldProps<string> {
    /** Input type (text, email, password, tel, url) */
    inputType?: 'text' | 'email' | 'password' | 'tel' | 'url';
    /** Placeholder text */
    placeholder?: string;
    /** Max length */
    maxLength?: number;
    /** Auto-focus on mount */
    autoFocus?: boolean;
    /** Prefix element */
    prefix?: React__default.ReactNode;
    /** Suffix element */
    suffix?: React__default.ReactNode;
}
declare const TextField: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
interface NumberFieldProps extends BaseFieldProps<number> {
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Decimal places */
    decimals?: number;
    /** Show spinner buttons */
    showSpinner?: boolean;
}
declare const NumberField: React__default.ForwardRefExoticComponent<NumberFieldProps & React__default.RefAttributes<HTMLInputElement>>;
interface CurrencyFieldProps extends BaseFieldProps<number> {
    /** Currency code (USD, EUR, etc.) */
    currency?: string;
    /** Locale for formatting */
    locale?: string;
    /** Symbol position */
    symbolPosition?: 'before' | 'after';
}
declare const CurrencyField: React__default.ForwardRefExoticComponent<CurrencyFieldProps & React__default.RefAttributes<HTMLInputElement>>;
interface TextareaFieldProps extends BaseFieldProps<string> {
    /** Number of rows */
    rows?: number;
    /** Whether to auto-resize */
    autoResize?: boolean;
    /** Max height for auto-resize */
    maxHeight?: number;
}
declare const TextareaField: React__default.ForwardRefExoticComponent<TextareaFieldProps & React__default.RefAttributes<HTMLTextAreaElement>>;
interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
interface SelectFieldProps extends BaseFieldProps<string | number> {
    /** Available options */
    options?: SelectOption[];
    /** Placeholder option text */
    placeholderOption?: string;
    /** Allow empty selection */
    allowEmpty?: boolean;
}
declare const SelectField: React__default.ForwardRefExoticComponent<SelectFieldProps & React__default.RefAttributes<HTMLSelectElement>>;
interface CheckboxFieldProps extends BaseFieldProps<boolean> {
    /** Checkbox label (different from field label) */
    checkboxLabel?: string;
}
declare const CheckboxField: React__default.ForwardRefExoticComponent<CheckboxFieldProps & React__default.RefAttributes<HTMLInputElement>>;
interface SwitchFieldProps extends BaseFieldProps<boolean> {
    /** On label */
    onLabel?: string;
    /** Off label */
    offLabel?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}
declare const SwitchField: React__default.ForwardRefExoticComponent<SwitchFieldProps & React__default.RefAttributes<HTMLInputElement>>;
declare const HiddenField: React__default.FC<BaseFieldProps>;
declare const baseFields: {
    text: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    email: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    password: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    tel: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    url: React__default.ForwardRefExoticComponent<TextFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    number: React__default.ForwardRefExoticComponent<NumberFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    currency: React__default.ForwardRefExoticComponent<CurrencyFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    percent: React__default.ForwardRefExoticComponent<NumberFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    textarea: React__default.ForwardRefExoticComponent<TextareaFieldProps & React__default.RefAttributes<HTMLTextAreaElement>>;
    select: React__default.ForwardRefExoticComponent<SelectFieldProps & React__default.RefAttributes<HTMLSelectElement>>;
    checkbox: React__default.ForwardRefExoticComponent<CheckboxFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    switch: React__default.ForwardRefExoticComponent<SwitchFieldProps & React__default.RefAttributes<HTMLInputElement>>;
    hidden: React__default.FC<BaseFieldProps<FieldValue>>;
};

export { type BaseFieldProps, CheckboxField, type CheckboxFieldProps, CurrencyField, type CurrencyFieldProps, type FieldComponent, type FieldFactoryOptions, type FieldRegistration, FieldRegistry, FieldRegistryContext, type FieldRegistryOptions, HiddenField, NumberField, type NumberFieldProps, type RenderedFieldProps, SelectField, type SelectFieldProps, type SelectOption, SwitchField, type SwitchFieldProps, TextField, type TextFieldProps, TextareaField, type TextareaFieldProps, baseFields, createFieldFactory, getDefaultRegistry, getField, registerField, registerFields, setDefaultRegistry, useFieldFactory, useFieldRegistry };
