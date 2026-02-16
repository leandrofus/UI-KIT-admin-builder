/**
 * @fileoverview Modal config - Canonical modal config format and parsing
 *
 * Defines the canonical "modal config" format (title by mode, sections, footer labels)
 * and parseModalConfig(raw, mode) that returns a resolved config for DynamicModal.
 *
 * @module config-system/modalConfig
 */

import type { ModalMode } from '../core/types';
import type { FormConfig } from '../core/types';
import {
  parseFormConfig,
  type RawFormConfig,
  type RawSectionConfig,
  type ParserOptions,
} from './ConfigParser';

// =============================================================================
// TYPES
// =============================================================================

/** Title or submit label: single string or per-mode */
export type TitleOrLabelByMode =
  | string
  | { create?: string; edit?: string; view?: string };

/** Raw modal config (JSON shape) - extends form with title/labels by mode */
export interface RawModalConfig extends Omit<RawFormConfig, 'title'> {
  id: string;
  /** Title: string or per mode (create, edit, view) */
  title: string | { create?: string; edit?: string; view?: string };
  subtitle?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  /** Flat fields (no sections) - will be wrapped in a default section */
  fields?: Record<string, unknown>[];
  sections?: RawSectionConfig[];
  columns?: number;
  footer?: {
    submitLabel?: TitleOrLabelByMode;
    cancelLabel?: string;
    resetLabel?: string;
    align?: 'left' | 'center' | 'right' | 'between';
  };
  [key: string]: unknown;
}

/** Result of parseModalConfig: form config plus resolved title/labels for the given mode */
export interface ParsedModalConfig {
  formConfig: FormConfig;
  title: string;
  submitLabel: string;
  cancelLabel?: string;
  size?: RawModalConfig['size'];
  subtitle?: string;
  icon?: string;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Resolves title for the given mode (string or record by mode).
 */
export function getModalTitle(
  title: TitleOrLabelByMode | undefined,
  mode: ModalMode
): string {
  if (title == null) return '';
  if (typeof title === 'string') return title;
  return title[mode] ?? title.edit ?? title.create ?? title.view ?? '';
}

/**
 * Resolves submit button label for the given mode.
 */
export function getModalSubmitLabel(
  submitLabel: TitleOrLabelByMode | undefined,
  mode: ModalMode
): string {
  if (submitLabel == null) {
    return mode === 'create' ? 'Create' : mode === 'edit' ? 'Save' : 'Close';
  }
  if (typeof submitLabel === 'string') return submitLabel;
  return submitLabel[mode] ?? submitLabel.edit ?? submitLabel.create ?? 'Save';
}

// =============================================================================
// PARSER
// =============================================================================

/**
 * Parses raw modal JSON into a resolved config for the given mode.
 * - Normalizes sections (or flat fields) into FormConfig via parseFormConfig.
 * - Resolves title and submitLabel for the given mode.
 * Use translateConfig(raw) before calling if the JSON contains i18n keys.
 */
export function parseModalConfig(
  raw: RawModalConfig,
  mode: ModalMode,
  options: ParserOptions = {}
): ParsedModalConfig {
  // Build RawFormConfig: ensure sections array (wrap flat fields if needed)
  const rawForm: RawFormConfig = {
    id: raw.id,
    title: getModalTitle(raw.title, mode),
    sections:
      raw.sections && raw.sections.length > 0
        ? raw.sections
        : raw.fields && raw.fields.length > 0
          ? [
              {
                id: 'default',
                title: '',
                columns: raw.columns ?? 2,
                fields: raw.fields,
              },
            ]
          : [],
  };

  const formConfig = parseFormConfig(rawForm, options);

  return {
    formConfig,
    title: getModalTitle(raw.title, mode),
    submitLabel: getModalSubmitLabel(raw.footer?.submitLabel, mode),
    cancelLabel: raw.footer?.cancelLabel,
    size: raw.size,
    subtitle: raw.subtitle,
    icon: raw.icon,
    showCloseButton: raw.showCloseButton,
    closeOnEscape: raw.closeOnEscape,
    closeOnBackdrop: raw.closeOnBackdrop,
  };
}
