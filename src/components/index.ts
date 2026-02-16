/**
 * Components Module
 * 
 * This module exports the main UI components for rendering tables and forms.
 * Components are designed to work with the configuration system and can be
 * used standalone or integrated with the adapters module.
 * 
 * @module components
 */

// ============================================================================
// TableRenderer
// ============================================================================

export {
  TableRenderer,
  type TableRendererProps,
  type TableRendererRef,
  type SortDirection,
  type ColumnSortState,
  type FilterValue,
  type TableFilterState
} from './TableRenderer';

// ============================================================================
// FormRenderer
// ============================================================================

export {
  FormRenderer,
  type FormRendererProps,
  type FormRendererRef,
  type FormValues,
  type FormErrors,
  type FormTouched,
  type FieldRenderProps,
  type SectionRenderProps,
} from './FormRenderer';

// ============================================================================
// DynamicModal
// ============================================================================

export {
  DynamicModal,
  type DynamicModalProps,
  type DynamicModalRef,
  type ModalSize,
  type ModalTab,
  type ModalAction,
  type ConfirmationConfig,
  type TitleOrLabelByMode,
} from './DynamicModal';

// ============================================================================
// TableToolbar
// ============================================================================

export {
  TableToolbar,
  type TableToolbarProps,
} from './TableToolbar';

// ============================================================================
// SidebarRenderer
// ============================================================================

export {
  SidebarRenderer,
  type SidebarRendererProps,
  type SidebarItem,
  type SidebarItemType,
} from './SidebarRenderer';

// ============================================================================
// KanbanRenderer
// ============================================================================

export * from './Kanban/KanbanRenderer';
export * from './Kanban/KanbanTypes';
// ============================================================================
// AdvancedSearchModal
// ============================================================================

export {
  AdvancedSearchModal,
  type AdvancedSearchModalProps,
  type FieldType as AdvancedSearchFieldType,
  type FieldConfig as AdvancedSearchFieldConfig,
  type FieldOption as AdvancedSearchFieldOption,
} from './AdvancedSearchModal';
// ============================================================================
// TabRenderer
// ============================================================================

export {
  TabRenderer,
  type TabRendererProps,
  type TabItem,
} from './TabRenderer';
