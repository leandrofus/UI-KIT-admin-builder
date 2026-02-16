/**
 * @fileoverview Base Field Components - Standard field implementations
 * 
 * Provides base implementations for common field types that can be
 * used as-is or extended for custom behavior.
 * 
 * @module field-system/fields
 */

import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import type { FieldValue, DataRecord } from '../core/types';
import type { BaseFieldProps } from './FieldRegistry';
import { cn } from '../core/utils';
import { useI18n, resolveLabel, t } from '../i18n/I18n';

// =============================================================================
// COMMON STYLES
// =============================================================================

const baseInputClass = `
  w-full px-3 py-2 rounded-md border border-gray-300
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  disabled:bg-gray-100 disabled:cursor-not-allowed
  read-only:bg-gray-50
  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800 dark:read-only:bg-gray-800
`.trim().replace(/\s+/g, ' ');

const errorInputClass = 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:focus:ring-red-700';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

const errorTextClass = 'text-sm text-red-500 dark:text-red-400 mt-1';

const helperTextClass = 'text-sm text-gray-500 dark:text-gray-400 mt-1';

// =============================================================================
// TEXT FIELD
// =============================================================================

export interface TextFieldProps extends BaseFieldProps<string> {
  /** Input type (text, email, password, tel, url) */
  inputType?: 'text' | 'email' | 'password' | 'tel' | 'url';
  /** Placeholder text */
  placeholder?: string;
  /** Max length */
  maxLength?: number;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Prefix element */
  prefix?: React.ReactNode;
  /** Suffix element */
  suffix?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
    const { t } = useI18n();
    const {
      field,
      value = '',
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      inputType = 'text',
      placeholder,
      maxLength,
      autoFocus,
      prefix,
      suffix,
    } = props;

    const hasError = touched && error;

    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label htmlFor={field.name} className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-gray-500">{prefix}</div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            id={field.name}
            name={field.name}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder ? resolveLabel(String(placeholder)) : (field.placeholder ? resolveLabel(String(field.placeholder)) : undefined)}
            maxLength={maxLength || field.maxLength}
            autoFocus={autoFocus}
            className={cn(
              baseInputClass,
              hasError && errorInputClass,
              prefix && 'pl-10',
              suffix && 'pr-10'
            )}
          />
          
          {suffix && (
            <div className="absolute right-3 text-gray-500">{suffix}</div>
          )}
        </div>

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{resolveLabel(String(field.helpText))}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// NUMBER FIELD
// =============================================================================

export interface NumberFieldProps extends BaseFieldProps<number> {
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

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  function NumberField(props, ref) {
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
      showSpinner = true,
    } = props;

    const hasError = touched && error;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        onChange(undefined as unknown as number);
        return;
      }
      
      let num = parseFloat(val);
      if (isNaN(num)) return;
      
      if (decimals !== undefined) {
        num = parseFloat(num.toFixed(decimals));
      }
      
      onChange(num);
    }, [onChange, decimals]);

    const { t } = useI18n();
    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label htmlFor={field.name} className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type="number"
          id={field.name}
          name={field.name}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          min={min ?? field.min}
          max={max ?? field.max}
          step={step}
          className={cn(
            baseInputClass,
            hasError && errorInputClass,
            !showSpinner && '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
        />

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{t(String(field.helpText))}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// CURRENCY FIELD
// =============================================================================

export interface CurrencyFieldProps extends BaseFieldProps<number> {
  /** Currency code (USD, EUR, etc.) */
  currency?: string;
  /** Locale for formatting */
  locale?: string;
  /** Symbol position */
  symbolPosition?: 'before' | 'after';
}

export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  function CurrencyField(props, ref) {
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
      currency = 'USD',
      locale = 'en-US',
      symbolPosition = 'before',
    } = props;

    const [displayValue, setDisplayValue] = useState(() => {
      if (value === undefined || value === null) return '';
      return value.toString();
    });

    const hasError = touched && error;

    const currencySymbol = useMemo(() => {
      const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
      const parts = formatter.formatToParts(0);
      return parts.find(p => p.type === 'currency')?.value || '$';
    }, [currency, locale]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/[^0-9.,]/g, '');
      setDisplayValue(val);
      
      const num = parseFloat(val.replace(',', '.'));
      if (!isNaN(num)) {
        onChange(num);
      } else if (val === '') {
        onChange(undefined as unknown as number);
      }
    }, [onChange]);

    const handleBlur = useCallback(() => {
      if (value !== undefined && value !== null) {
        setDisplayValue(value.toFixed(2));
      }
      onBlur?.();
    }, [value, onBlur]);

    const { t } = useI18n();
    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label htmlFor={field.name} className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          {symbolPosition === 'before' && (
            <div className="absolute left-3 text-gray-500">{currencySymbol}</div>
          )}
          
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            id={field.name}
            name={field.name}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={t('currency.placeholder') || '0.00'}
            className={cn(
              baseInputClass,
              hasError && errorInputClass,
              symbolPosition === 'before' && 'pl-8',
              symbolPosition === 'after' && 'pr-8'
            )}
          />
          
          {symbolPosition === 'after' && (
            <div className="absolute right-3 text-gray-500">{currencySymbol}</div>
          )}
        </div>

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{t(String(field.helpText))}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// TEXTAREA FIELD
// =============================================================================

export interface TextareaFieldProps extends BaseFieldProps<string> {
  /** Number of rows */
  rows?: number;
  /** Whether to auto-resize */
  autoResize?: boolean;
  /** Max height for auto-resize */
  maxHeight?: number;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(props, ref) {
    const { t } = useI18n();
    const {
      field,
      value = '',
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      readOnly,
      className,
      rows = 3,
      autoResize = false,
      maxHeight,
    } = props;

    const hasError = touched && error;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      
      if (autoResize) {
        e.target.style.height = 'auto';
        const newHeight = Math.min(e.target.scrollHeight, maxHeight || Infinity);
        e.target.style.height = `${newHeight}px`;
      }
    }, [onChange, autoResize, maxHeight]);

    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label htmlFor={field.name} className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={field.name}
          name={field.name}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          placeholder={field.placeholder ? resolveLabel(String(field.placeholder)) : undefined}
          className={cn(
            baseInputClass,
            hasError && errorInputClass,
            'resize-y'
          )}
          style={autoResize ? { overflow: 'hidden' } : undefined}
        />

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{t(String(field.helpText))}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// SELECT FIELD
// =============================================================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps<string | number> {
  /** Available options */
  options?: SelectOption[];
  /** Placeholder option text */
  placeholderOption?: string;
  /** Allow empty selection */
  allowEmpty?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(props, ref) {
    const { t } = useI18n();
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
      placeholderOption = 'Select...',
      allowEmpty = true,
    } = props;

    const hasError = touched && error;

    // Get options from props or field config
    const options: SelectOption[] = useMemo(() => {
      if (propOptions) return propOptions;
      if (field.options) {
        return field.options.map(opt => 
          typeof opt === 'string' 
            ? { value: opt, label: opt }
            : opt as SelectOption
        );
      }
      return [];
    }, [propOptions, field.options]);

    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label htmlFor={field.name} className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          id={field.name}
          name={field.name}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || readOnly}
          className={cn(
            baseInputClass,
            hasError && errorInputClass,
            'cursor-pointer'
          )}
        >
          {allowEmpty && (
            <option value="">{resolveLabel(String(placeholderOption))}</option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {resolveLabel(String(option.label))}
            </option>
          ))}
        </select>

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{t(String(field.helpText))}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// CHECKBOX FIELD
// =============================================================================

export interface CheckboxFieldProps extends BaseFieldProps<boolean> {
  /** Checkbox label (different from field label) */
  checkboxLabel?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(props, ref) {
    const { t } = useI18n();
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
      checkboxLabel,
    } = props;

    const hasError = touched && error;

    return (
      <div className={cn('field-wrapper', className)}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled || readOnly}
            className={cn(
              'h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:bg-gray-700',
              'focus:ring-2 focus:ring-blue-500',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t(String(checkboxLabel || field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{field.helpText}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// SWITCH FIELD
// =============================================================================

export interface SwitchFieldProps extends BaseFieldProps<boolean> {
  /** On label */
  onLabel?: string;
  /** Off label */
  offLabel?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  function SwitchField(props, ref) {
    const { t } = useI18n();
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
      size = 'md',
    } = props;

    const hasError = touched && error;

    const sizes = {
      sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', translate: 'translate-x-4' },
      md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' },
      lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', translate: 'translate-x-7' },
    };

    const sizeClasses = sizes[size];

    return (
      <div className={cn('field-wrapper', className)}>
        {field.label && (
          <label className={labelClass}>
            {resolveLabel(String(field.label))}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="flex items-center gap-3">
          {offLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{resolveLabel(String(offLabel))}</span>}
          
          <button
            ref={ref as unknown as React.Ref<HTMLButtonElement>}
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => !disabled && !readOnly && onChange(!value)}
            onBlur={onBlur}
            disabled={disabled || readOnly}
            className={cn(
              'relative inline-flex shrink-0 cursor-pointer rounded-full',
              'border-2 border-transparent transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              sizeClasses.track,
              value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
              (disabled || readOnly) && 'cursor-not-allowed opacity-50'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block rounded-full bg-white dark:bg-gray-200 shadow',
                'transform ring-0 transition duration-200 ease-in-out',
                sizeClasses.thumb,
                value ? sizeClasses.translate : 'translate-x-0'
              )}
            />
          </button>
          
          {onLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{t(String(onLabel))}</span>}
        </div>

        {hasError && <p className={errorTextClass}>{error}</p>}
        {field.helpText && !hasError && (
          <p className={helperTextClass}>{field.helpText}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// HIDDEN FIELD
// =============================================================================

export const HiddenField: React.FC<BaseFieldProps> = ({ field, value }) => {
  return (
    <input
      type="hidden"
      name={field.name}
      value={value as string ?? ''}
    />
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export const baseFields = {
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
  hidden: HiddenField,
};

export default baseFields;
