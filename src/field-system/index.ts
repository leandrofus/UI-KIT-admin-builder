/**
 * @fileoverview Field System module exports
 * 
 * @module field-system
 */

// Field Registry
export {
  FieldRegistry,
  FieldRegistryContext,
  getDefaultRegistry,
  setDefaultRegistry,
  registerField,
  registerFields,
  getField,
  useFieldRegistry,
} from './FieldRegistry';
export type {
  BaseFieldProps,
  FieldComponent,
  FieldRegistration,
  FieldRegistryOptions,
} from './FieldRegistry';

// Field Factory
export {
  useFieldFactory,
  createFieldFactory,
} from './FieldFactory';
export type {
  FieldFactoryOptions,
  RenderedFieldProps,
} from './FieldFactory';

// Base Fields
export {
  TextField,
  NumberField,
  CurrencyField,
  TextareaField,
  SelectField,
  CheckboxField,
  SwitchField,
  HiddenField,
  baseFields,
} from './BaseFields';
export type {
  TextFieldProps,
  NumberFieldProps,
  CurrencyFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  SelectOption,
  CheckboxFieldProps,
  SwitchFieldProps,
} from './BaseFields';
