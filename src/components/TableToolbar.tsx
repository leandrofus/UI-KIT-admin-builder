/**
 * TableToolbar Component
 * 
 * Renders a toolbar above a table with search, filters, and action buttons
 * 
 * Features:
 * - Text search input
 * - Advanced search modal
 * - Refresh button
 * - Create button
 * - Selection actions (show only when rows are selected)
 * - Dynamic column filters
 */

import React, { useState, useCallback } from 'react';
import { t, resolveLabel } from '../i18n/I18n';
import { cn } from '../core/utils';
import type { ColumnConfig } from '../core/types';

// ============================================================================
// TYPES
// ============================================================================

export interface TableToolbarProps {
  /** Show search input */
  showSearch?: boolean;
  
  /** Search placeholder text */
  searchPlaceholder?: string;
  
  /** Current search value */
  searchValue?: string;
  
  /** Callback when search input changes */
  onSearch?: (query: string) => void;
  
  /** Show refresh button */
  showRefresh?: boolean;
  
  /** Callback when refresh button is clicked */
  onRefresh?: () => void;
  
  /** Loading state for refresh button */
  refreshLoading?: boolean;
  
  /** Show create button */
  showCreate?: boolean;
  
  /** Label for create button */
  createLabel?: string;
  
  /** Callback when create button is clicked */
  onCreate?: () => void;
  
  /** Show advanced search */
  showAdvancedSearch?: boolean;
  
  /** Callback when advanced search is opened */
  onAdvancedSearch?: () => void;
  
  /** Number of selected rows (shows selection actions) */
  selectedCount?: number;
  
  /** Callback when selection actions are triggered */
  onClearSelection?: () => void;
  
  /** Callback when delete selected is clicked */
  onDeleteSelected?: () => void;
  
  /** Callback when toggle enabled is clicked */
  onToggleEnabled?: () => void;
  
  /** Delete selected button label */
  deleteLabel?: string;

  /** Callback when export selected is clicked */
  onExport?: () => void;

  /** Show export button in main toolbar */
  showExport?: boolean;
  
  /** Custom toolbar height */
  height?: string | number;
  
  /** Custom class name */
  className?: string;
  
  /** Column definitions (for advanced filtering) */
  columns?: ColumnConfig[];
  
  /** Custom toolbar content (renders after standard buttons) */
  renderCustomContent?: () => React.ReactNode;

  /** Optional handler to open a Columns selector modal */
  onOpenColumns?: () => void;

  /** Show a columns button (only rendered if onOpenColumns is provided) */
  showColumnsButton?: boolean;

  /** Whether column prefs need syncing (will show a small indicator) */
  columnsNeedsSync?: boolean;
  
  /** Show view switcher (Table/Kanban) */
  showViewSwitcher?: boolean;

  /** Current active view */
  activeView?: 'table' | 'kanban';

  /** Callback when view changes */
  onViewChange?: (view: 'table' | 'kanban') => void;
  
  /** Disable entire toolbar */
  disabled?: boolean;
  
  /** Show border bottom */
  bordered?: boolean;
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5Z" />
    </svg>
  ),
  refresh: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992M2.763 9.348c.547-4.055 4.29-7.298 8.888-7.298 4.694 0 8.502 3.362 8.996 7.748h4.992v-.001M2.723 13.467c.12.95.904 1.676 1.9 1.676h15.692c.996 0 1.78-.726 1.9-1.676m-17.492 0a2.25 2.25 0 0 0-1.853-2.965 2.25 2.25 0 0 0-2.236 2.965m19.5 0a2.25 2.25 0 0 0 1.853-2.965 2.25 2.25 0 0 0 2.236 2.965" />
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L19.18 2.318c.169-.897-.134-1.638-1.034-1.638h-5.096c-.9 0-1.203.74-1.034 1.638L9.26 9M4.25 9L4.596 18c.305 1.619 1.045 2.5 2.589 2.5h6.63c1.544 0 2.284-.881 2.589-2.5l.346-9m-4.215 0h3.02m-9.755 0c.342.052.682.107 1.022.166" />
    </svg>
  ),
  advancedSearch: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM21 21l-5.197-5.197" />
    </svg>
  ),
  toggle: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
    </svg>
  ),
  table: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5a1.125 1.125 0 0 0 1.125 1.125m17.25 0a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125a1.125 1.125 0 0 1-1.125-1.125M3.375 11.25h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 11.25a1.125 1.125 0 0 0 1.125 1.125m17.25 0a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125a1.125 1.125 0 0 1-1.125-1.125M3.375 3h17.25m-17.25 0a1.125 1.125 0 0 1-1.125 1.125M3.375 3a1.125 1.125 0 0 0 1.125-1.125m17.25 0a1.125 1.125 0 0 0 1.125 1.125m-1.125-1.125a1.125 1.125 0 0 1-1.125 1.125" />
    </svg>
  ),
  kanban: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.75v10.5m1.125-10.5h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125H7.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Zm5.625 0h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125h-1.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Zm5.625 0h1.125a1.125 1.125 0 0 1 1.125 1.125v1.125a1.125 1.125 0 0 1-1.125 1.125h-1.125a1.125 1.125 0 0 1-1.125-1.125V7.875a1.125 1.125 0 0 1 1.125-1.125Z" />
    </svg>
  ),
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TableToolbar(props: TableToolbarProps): React.ReactElement {

  const {
    showSearch = false,
    searchPlaceholder,
    searchValue = '',
    onSearch,
    showRefresh = false,
    onRefresh,
    refreshLoading = false,
    showCreate = false,
    createLabel,
    onCreate,
    showAdvancedSearch = false,
    onAdvancedSearch,
    selectedCount = 0,
    onClearSelection,
    onDeleteSelected,
    onToggleEnabled,
    deleteLabel,
    onExport,
    height = '56px',
    className,
    columns,
    renderCustomContent,
    onOpenColumns,
    showColumnsButton = false,
    columnsNeedsSync = false,
    showViewSwitcher = false,
    activeView = 'table',
    onViewChange,
    disabled = false,
    bordered = true,
  } = props;

  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  }, [onSearch]);

  // Only render if there are any tools to show
  const hasTools = showSearch || showRefresh || showCreate || showAdvancedSearch || props.showColumnsButton || (props.showExport && onExport);
  
  if (!hasTools && selectedCount === 0 && !renderCustomContent) {
    return <></>;
  }

  return (
    <div
      className={cn(
        'dui-table-toolbar',
        bordered && 'dui-table-toolbar-bordered',
        disabled && 'dui-table-toolbar-disabled',
        className
      )}
    >
      {/* 1. Left Side: Search & Advanced Search (Always Visible) */}
      {showSearch && (
        <div className="dui-table-toolbar-search">
          {Icons.search}
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder || t('table.search', { default: 'Buscar...' })}
            disabled={disabled}
            className="v2-input v2-input-with-icon"
          />
        </div>
      )}

      {showAdvancedSearch && onAdvancedSearch && (
        <button
          type="button"
          onClick={onAdvancedSearch}
          disabled={disabled}
          className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
          title={t('table.advancedSearch', { default: 'Búsqueda avanzada' })}
        >
          {Icons.advancedSearch}
          {t('table.advancedSearch', { default: 'Avanzada' })}
        </button>
      )}

      {/* View Switcher (Table/Kanban) */}
      {showViewSwitcher && onViewChange && (
        <div className="dui-table-view-switcher" style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: '8px', marginLeft: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onViewChange('table')}
            className={cn(
              "dui-table-toolbar-btn px-2 py-1 border-0",
              activeView === 'table' ? "bg-white shadow-sm dark:bg-gray-700 dark:text-white" : "bg-transparent text-muted"
            )}
            style={{ borderRadius: '6px', minWidth: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={t('table.viewTable', { default: 'Vista Tabla' })}
          >
            {Icons.table}
          </button>
          <button
            type="button"
            onClick={() => onViewChange('kanban')}
            className={cn(
              "dui-table-toolbar-btn px-2 py-1 border-0",
              activeView === 'kanban' ? "bg-white shadow-sm dark:bg-gray-700 dark:text-white" : "bg-transparent text-muted"
            )}
            style={{ borderRadius: '6px', minWidth: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={t('table.viewKanban', { default: 'Vista Kanban' })}
          >
            {Icons.kanban}
          </button>
        </div>
      )}

      {/* 2. Middle: Spacer */}
      <div className="dui-table-toolbar-spacer" />

      {/* 3. Right Side: Actions (Context Sensitive) */}
      <div className="dui-table-toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        
        {/* Selection Actions */}
        {selectedCount > 0 ? (
          <>
            <span className="dui-table-toolbar-selection-badge" style={{ marginRight: '0.5rem' }}>
              {t('table.selected', { count: selectedCount })}
            </span>
            
            {onDeleteSelected && (
              <button
                type="button"
                onClick={onDeleteSelected}
                disabled={disabled}
                className="dui-table-toolbar-btn dui-table-toolbar-btn-danger"
              >
                {Icons.trash}
                {deleteLabel || t('table.delete')}
              </button>
            )}

            {onToggleEnabled && (
              <button
                type="button"
                onClick={onToggleEnabled}
                disabled={disabled}
                className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
                title={t('table.toggleEnabled', { default: 'Habilitar/Deshabilitar' })}
              >
                {Icons.toggle}
              </button>
            )}

            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                disabled={disabled}
                className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
              >
                {t('table.clearSelection')}
              </button>
            )}
            
            {/* Divider between selection actions and common actions */}
            <div style={{ width: 1, height: 24, background: 'var(--border-color)', margin: '0 0.25rem' }} />
          </>
        ) : (
          /* Normal Actions (Refresh, Create) */
          <>
            {showRefresh && onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={disabled || refreshLoading}
                className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
                title={t('table.refresh', { default: 'Refrescar' })}
              >
                {Icons.refresh}
                {t('table.refresh', { default: 'Refrescar' })}
              </button>
            )}

            {showCreate && onCreate && (
              <button
                type="button"
                onClick={onCreate}
                disabled={disabled}
                className="dui-table-toolbar-btn dui-table-toolbar-btn-primary"
              >
                {Icons.plus}
                {createLabel || t('table.create', { default: 'Crear' })}
              </button>
            )}
          </>
        )}

        {/* Common Actions (Always Visible or contextual logic preserved) */}
        
        {/* Export */}
        {props.showExport && onExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={disabled}
            className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
            title={t('export', { default: 'Exportar' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.2em', height: '1.2em' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            {/* Show label only if selected count is 0 to save space, or just icon? Keeping icon + text for consistency */}
            {selectedCount > 0 ? '' : t('export', { default: 'Exportar' })}
          </button>
        )}

        {/* Columns */}
        {props.showColumnsButton && onOpenColumns && (
          <button
            type="button"
            onClick={onOpenColumns}
            disabled={disabled}
            className="dui-table-toolbar-btn dui-table-toolbar-btn-secondary"
            title={t('columns.title', { default: 'Columnas' })}
          >
            {t('columns.title', { default: 'Columnas' })}
            {columnsNeedsSync && (
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#ef4444', borderRadius: 8, marginLeft: 8 }} />
            )}
          </button>
        )}

        {/* Custom Content */}
        {renderCustomContent && (
          <div className="dui-table-toolbar-custom">
            {renderCustomContent()}
          </div>
        )}
      </div>
    </div>
  );
}

export default TableToolbar;
