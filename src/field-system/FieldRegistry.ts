/**
 * @fileoverview Field Registry - Register and manage custom field components
 * 
 * Provides a centralized registry for field components, allowing dynamic
 * registration of custom fields that can be used in forms and tables.
 * 
 * @module field-system/FieldRegistry
 */

import type { ComponentType } from 'react';
import type { FieldConfig, FieldValue, DataRecord } from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Props passed to all field components
 */
export interface BaseFieldProps<T = FieldValue> {
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
export type FieldComponent<T = FieldValue> = ComponentType<BaseFieldProps<T>>;

/**
 * Field registration info
 */
export interface FieldRegistration {
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
export interface FieldRegistryOptions {
  /** Whether to throw on duplicate registration */
  throwOnDuplicate?: boolean;
  /** Whether to allow overwriting existing registrations */
  allowOverwrite?: boolean;
}

// =============================================================================
// FIELD REGISTRY CLASS
// =============================================================================

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
export class FieldRegistry {
  private fields: Map<string, FieldRegistration> = new Map();
  private options: FieldRegistryOptions;

  constructor(options: FieldRegistryOptions = {}) {
    this.options = {
      throwOnDuplicate: false,
      allowOverwrite: true,
      ...options,
    };
  }

  /**
   * Register a field type
   */
  register(registration: FieldRegistration): this {
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
  registerMany(registrations: FieldRegistration[]): this {
    for (const registration of registrations) {
      this.register(registration);
    }
    return this;
  }

  /**
   * Get a field component by type
   */
  get(type: string): FieldComponent | undefined {
    return this.fields.get(type)?.component;
  }

  /**
   * Get full registration info
   */
  getRegistration(type: string): FieldRegistration | undefined {
    return this.fields.get(type);
  }

  /**
   * Check if a field type is registered
   */
  has(type: string): boolean {
    return this.fields.has(type);
  }

  /**
   * Remove a field registration
   */
  unregister(type: string): boolean {
    return this.fields.delete(type);
  }

  /**
   * Get all registered field types
   */
  getTypes(): string[] {
    return Array.from(this.fields.keys());
  }

  /**
   * Get all registrations
   */
  getAll(): FieldRegistration[] {
    return Array.from(this.fields.values());
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.fields.clear();
  }

  /**
   * Clone the registry
   */
  clone(): FieldRegistry {
    const newRegistry = new FieldRegistry(this.options);
    this.fields.forEach((registration, type) => {
      newRegistry.fields.set(type, { ...registration });
    });
    return newRegistry;
  }

  /**
   * Merge another registry into this one
   */
  merge(other: FieldRegistry): this {
    other.fields.forEach((registration) => {
      this.register(registration);
    });
    return this;
  }
}

// =============================================================================
// DEFAULT REGISTRY
// =============================================================================

/**
 * Global default registry instance
 */
let defaultRegistry: FieldRegistry | null = null;

/**
 * Get the default registry (creates one if needed)
 */
export function getDefaultRegistry(): FieldRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new FieldRegistry();
  }
  return defaultRegistry;
}

/**
 * Set the default registry
 */
export function setDefaultRegistry(registry: FieldRegistry): void {
  defaultRegistry = registry;
}

/**
 * Register a field to the default registry
 */
export function registerField(registration: FieldRegistration): void {
  getDefaultRegistry().register(registration);
}

/**
 * Register multiple fields to the default registry
 */
export function registerFields(registrations: FieldRegistration[]): void {
  getDefaultRegistry().registerMany(registrations);
}

/**
 * Get a field from the default registry
 */
export function getField(type: string): FieldComponent | undefined {
  return getDefaultRegistry().get(type);
}

// =============================================================================
// REACT CONTEXT (FOR DI)
// =============================================================================

import { createContext, useContext } from 'react';

/**
 * Field Registry Context
 */
export const FieldRegistryContext = createContext<FieldRegistry | null>(null);

/**
 * Hook to access the field registry
 */
export function useFieldRegistry(): FieldRegistry {
  const context = useContext(FieldRegistryContext);
  
  if (!context) {
    return getDefaultRegistry();
  }
  
  return context;
}

export default FieldRegistry;
