/**
 * @fileoverview DynamicModal Component
 * 
 * A modal dialog wrapper for dynamic forms with support for:
 * - Multiple tabs/sections
 * - Loading and error states
 * - Confirmation dialogs
 * - Custom actions (save, delete, cancel)
 * - Backdrop click handling
 * - Keyboard shortcuts (Escape to close)
 * 
 * @module components/DynamicModal
 */

import React, { 
  forwardRef, 
  useImperativeHandle, 
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import type { 
  FormConfig, 
  FieldValue, 
  DataRecord,
  ModalMode,
} from '../core/types';
import { getModalTitle, getModalSubmitLabel } from '../config-system/modalConfig';
import { cn } from '../core/utils';
import { useI18n, t } from '../i18n/I18n';
import { FormRenderer, type FormRendererRef, type FormErrors } from './FormRenderer';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Tab configuration for tabbed modals
 */
export interface ModalTab {
  /** Unique tab identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Tab icon (optional) */
  icon?: React.ReactNode;
  /** Tab content (FormConfig or custom content) */
  content?: FormConfig;
  /** Custom render function for tab content */
  render?: (formData: DataRecord) => React.ReactNode;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Badge count or text */
  badge?: string | number;
}

/**
 * Modal action button
 */
export interface ModalAction {
  /** Unique action identifier */
  id: string;
  /** Button label */
  label: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Icon (optional) */
  icon?: React.ReactNode;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Whether action is loading */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void | Promise<void>;
  /** Position in footer */
  position?: 'left' | 'right';
}

/**
 * Confirmation dialog config
 */
export interface ConfirmationConfig {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'danger';
}

/**
 * Title or submit label: single string or per-mode (create/edit/view)
 */
export type TitleOrLabelByMode = string | { create?: string; edit?: string; view?: string };

/**
 * DynamicModal props
 */
export interface DynamicModalProps<T extends DataRecord = DataRecord> {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal mode: create (new), edit (existing), or view (read-only). When 'view', submit/delete are hidden and form is read-only. */
  mode?: ModalMode;
  /** Modal title (string or per-mode object) */
  title: string | TitleOrLabelByMode;
  /** Modal subtitle/description */
  subtitle?: string;
  /** Submit button label (string or per-mode). Only shown when mode !== 'view' and onSubmit is provided. */
  submitLabel?: TitleOrLabelByMode;
  /** Modal size */
  size?: ModalSize;
  /** Form configuration (for single-form modals) */
  config?: FormConfig;
  /** Tabs configuration (for tabbed modals) */
  tabs?: ModalTab[];
  /** Initial form values */
  initialValues?: T;
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
  /** Delete handler (shows delete button if provided) */
  onDelete?: () => void | Promise<void>;
  /** Custom actions */
  actions?: ModalAction[];
  /** External loading state */
  loading?: boolean;
  /** External error message */
  error?: string;
  /** Validation errors */
  errors?: FormErrors;
  /** Whether to close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Whether to close on Escape key */
  closeOnEscape?: boolean;
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Additional class name */
  className?: string;
  /** Delete confirmation config */
  deleteConfirmation?: ConfirmationConfig;
  /** Whether to show close button in header */
  showCloseButton?: boolean;
  /** Custom field renderer for FormRenderer */
  renderField?: React.ComponentProps<typeof FormRenderer>['renderField'];
  /** Custom section renderer for FormRenderer */
  renderSection?: React.ComponentProps<typeof FormRenderer>['renderSection'];
  /** Feature flags for conditional rendering */
  featureFlags?: Record<string, boolean>;
  /** Theme mode: 'system' (prefers-color-scheme), 'light' or 'dark' */
  theme?: 'system' | 'light' | 'dark';
  /** Entity name for dynamic translations (e.g. "Delete {{entity}}") */
  entityName?: string;
}

/**
 * DynamicModal ref interface
 */
export interface DynamicModalRef<T extends DataRecord = DataRecord> {
  /** Get current form values */
  getValues: () => T;
  /** Set form values */
  setValues: (values: Partial<T>) => void;
  /** Validate form */
  validate: () => boolean;
  /** Reset form */
  reset: () => void;
  /** Close the modal */
  close: () => void;
  /** Submit the form */
  submit: () => Promise<void>;
}

// =============================================================================
// SIZE MAP
// =============================================================================

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'dui-modal--sm',
  md: 'dui-modal--md',
  lg: 'dui-modal--lg',
  xl: 'dui-modal--xl',
  full: 'dui-modal--full',
};

// =============================================================================
// CONFIRMATION DIALOG
// =============================================================================

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  config: ConfirmationConfig;
  loading?: boolean;
  entityName?: string;
}

function ConfirmDialog({ open, onConfirm, onCancel, config, loading, entityName }: ConfirmDialogProps) {
  const { t } = useI18n();

  if (!open) return null;

  const resolvedEntity = entityName || t('entities.unknown', undefined, 'Item');

  return (
    <div className="dui-modal__confirm-overlay">
      <div className="dui-modal__confirm-dialog">
        <h4 className="dui-modal__confirm-title">{typeof config.title === 'string' ? t(config.title, { entity: resolvedEntity }) : config.title}</h4>
        <p className="dui-modal__confirm-message">{typeof config.message === 'string' ? t(config.message, { entity: resolvedEntity }) : config.message}</p>
        <div className="dui-modal__confirm-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="dui-modal__button dui-modal__button--secondary"
          >
            {config.cancelLabel || t('modal.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'dui-modal__button',
              config.confirmVariant === 'danger' 
                ? 'dui-modal__button--danger' 
                : 'dui-modal__button--primary'
            )}
          >
            {loading ? t('modal.loading') : config.confirmLabel || t('modal.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DYNAMIC MODAL COMPONENT
// =============================================================================

/**
 * DynamicModal component
 * 
 * A flexible modal dialog for forms and content.
 * 
 * @example
 * ```tsx
 * <DynamicModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit Product"
 *   config={productFormConfig}
 *   initialValues={product}
 *   onSubmit={handleSave}
 *   onDelete={handleDelete}
 *   size="lg"
 * />
 * ```
 */
function DynamicModalInner<T extends DataRecord = DataRecord>(
  props: DynamicModalProps<T>,
  ref: React.ForwardedRef<DynamicModalRef<T>>
): React.ReactElement | null {
  const {
    open,
    onClose,
    mode,
    title: titleProp,
    submitLabel: submitLabelProp,
    subtitle,
    size = 'xl',
    config,
    tabs,
    initialValues = {} as T,
    onSubmit,
    onDelete,
    actions = [],
    loading = false,
    error,
    errors,
    closeOnBackdropClick = false,
    closeOnEscape = true,
    header,
    footer,
    className,
    deleteConfirmation,
    showCloseButton = true,
    renderField,
    renderSection,
    featureFlags = {},
    theme = 'system',
    entityName,
  } = props;

  const { t } = useI18n();
  const effectiveMode: ModalMode = mode ?? 'edit';
  const resolvedEntity = entityName || t('entities.unknown', undefined, 'Item');

  const title = typeof titleProp === 'string'
    ? titleProp
    : getModalTitle(titleProp, effectiveMode);
  const submitLabel = submitLabelProp == null
    ? (effectiveMode === 'create' ? t('modal.create', { entity: resolvedEntity }) : t('modal.save'))
    : (typeof submitLabelProp === 'string'
        ? submitLabelProp
        : getModalSubmitLabel(submitLabelProp, effectiveMode));
  const isViewMode = effectiveMode === 'view';

  const formRef = useRef<FormRendererRef<T>>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState<string>(tabs?.[0]?.id || '');
  const [internalValues, setInternalValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setInternalValues(initialValues);
      setActiveTab(tabs?.[0]?.id || '');
      setShowDeleteConfirm(false);
    }
  }, [open, initialValues, tabs]);

  // Handle Escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showDeleteConfirm) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose, showDeleteConfirm]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus trap (basic implementation)
  useEffect(() => {
    if (!open || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, selectextarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && !showDeleteConfirm) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose, showDeleteConfirm]);

  /**
   * Handle form value change
   */
  const handleFormChange = useCallback((name: string, value: FieldValue, values: T) => {
    setInternalValues(values);
  }, []);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(async () => {
    if (loading || isSubmitting) return;

    // Validate first
    const isValid = formRef.current?.validate();
    if (!isValid) return;

    const values = formRef.current?.getValues() || internalValues;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [loading, isSubmitting, internalValues, onSubmit]);

  /**
   * Handle delete
   */
  const handleDelete = useCallback(async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete]);

  /**
   * Handle delete button click
   */
  const handleDeleteClick = useCallback(() => {
    if (deleteConfirmation) {
      setShowDeleteConfirm(true);
    } else if (onDelete) {
      handleDelete();
    }
  }, [deleteConfirmation, onDelete, handleDelete]);

  // ==========================================================================
  // IMPERATIVE HANDLE
  // ==========================================================================

  useImperativeHandle(ref, () => ({
    getValues: () => formRef.current?.getValues() || internalValues,
    setValues: (values) => {
      formRef.current?.setValues(values);
      setInternalValues((prev) => ({ ...prev, ...values }));
    },
    validate: () => formRef.current?.validate() || true,
    reset: () => {
      formRef.current?.reset();
      setInternalValues(initialValues);
    },
    close: onClose,
    submit: handleSubmit,
  }), [internalValues, initialValues, onClose, handleSubmit]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Get current tab config
   */
  const currentTab = useMemo(() => {
    return tabs?.find((tab) => tab.id === activeTab);
  }, [tabs, activeTab]);

  /**
   * Get current form config
   */
  const currentFormConfig = useMemo(() => {
    if (config) return config;
    return currentTab?.content;
  }, [config, currentTab]);

  /**
   * Render tabs header
   */
  const renderTabs = useCallback(() => {
    if (!tabs || tabs.length === 0) return null;

    return (
      <div className="dui-modal__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'dui-modal__tab',
              activeTab === tab.id && 'dui-modal__tab--active',
              tab.disabled && 'dui-modal__tab--disabled'
            )}
          >
            {tab.icon && <span className="dui-modal__tab-icon">{tab.icon}</span>}
            <span className="dui-modal__tab-label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="dui-modal__tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
    );
  }, [tabs, activeTab]);

  /**
   * Render content
   */
  const renderContent = useCallback(() => {
    // Custom render for current tab
    if (currentTab?.render) {
      return currentTab.render(internalValues as DataRecord);
    }

    // Form content
    if (currentFormConfig) {
      return (
        <FormRenderer<T>
          ref={formRef}
          config={currentFormConfig}
          values={internalValues}
          errors={errors}
          onChange={handleFormChange}
          loading={loading || isSubmitting}
          readOnly={isViewMode}
          renderField={renderField}
          renderSection={renderSection}
          featureFlags={featureFlags}
          hideButtons
        />
      );
    }

    return null;
  }, [
    currentTab, 
    currentFormConfig, 
    internalValues, 
    errors, 
    handleFormChange, 
    loading, 
    isSubmitting,
    renderField,
    renderSection,
  ]);

  /**
   * Render actions
   */
  const renderActions = useCallback(() => {
    if (footer) return footer;

    const leftActions = actions.filter((a) => a.position === 'left');
    const rightActions = actions.filter((a) => a.position !== 'left');

    return (
      <div className="dui-modal__footer">
        <div className="dui-modal__footer-left">
          {/* Delete button (hidden in view mode) */}
          {!isViewMode && onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={loading || isSubmitting || isDeleting}
              className="dui-modal__button dui-modal__button--danger"
            >
              {isDeleting ? t('modal.deleting', { entity: resolvedEntity }) : t('modal.delete', { entity: resolvedEntity })}
            </button>
          )}
          
          {/* Left custom actions */}
          {leftActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={cn(
                'dui-modal__button',
                `dui-modal__button--${action.variant || 'secondary'}`
              )}
            >
              {action.icon && <span className="dui-modal__button-icon">{action.icon}</span>}
              {action.loading ? t('modal.loading') : action.label}
            </button>
          ))}
        </div>

        <div className="dui-modal__footer-right">
          {/* Right custom actions */}
          {rightActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={cn(
                'dui-modal__button',
                `dui-modal__button--${action.variant || 'secondary'}`
              )}
            >
              {action.icon && <span className="dui-modal__button-icon">{action.icon}</span>}
              {action.loading ? t('modal.loading') : action.label}
            </button>
          ))}

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading || isSubmitting}
            className="dui-modal__button dui-modal__button--secondary"
          >
            {t('modal.cancel')}
          </button>

          {/* Submit button (hidden in view mode) */}
          {!isViewMode && onSubmit && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isSubmitting}
              className="dui-modal__button dui-modal__button--primary"
            >
              {(loading || isSubmitting) ? t('modal.saving') : submitLabel}
            </button>
          )}
        </div>
      </div>
    );
  }, [
    footer,
    actions,
    onDelete,
    onSubmit,
    onClose,
    handleDeleteClick,
    handleSubmit,
    loading,
    isSubmitting,
    isDeleting,
    isViewMode,
    submitLabel,
    t,
  ]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!open) return null;

  const overlayClass = cn(
    'dui-modal__overlay',
    theme === 'dark' ? 'dui-theme--dark' : theme === 'light' ? 'dui-theme--light' : ''
  );

  const modalContent = (
    <div 
      className={overlayClass}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={cn(
          'dui-modal',
          SIZE_MAP[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {header || (
          <div className="dui-modal__header">
            <div className="dui-modal__header-content">
              <h2 id="modal-title" className="dui-modal__title">{title}</h2>
              {subtitle && <p className="dui-modal__subtitle">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="dui-modal__close"
                aria-label={t('modal.close')}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        {renderTabs()}

        {/* Error message */}
        {error && (
          <div className="dui-modal__error">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="dui-modal__body">
          {renderContent()}
        </div>

        {/* Footer */}
        {renderActions()}

        {/* Delete confirmation */}
        {deleteConfirmation && (
          <ConfirmDialog
            open={showDeleteConfirm}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            config={deleteConfirmation}
            loading={isDeleting}
            entityName={resolvedEntity}
          />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Forward ref with generic support
export const DynamicModal = forwardRef(DynamicModalInner) as <T extends DataRecord = DataRecord>(
  props: DynamicModalProps<T> & { ref?: React.ForwardedRef<DynamicModalRef<T>> }
) => React.ReactElement | null;

// Set display name
(DynamicModal as React.FC).displayName = 'DynamicModal';

export default DynamicModal;
