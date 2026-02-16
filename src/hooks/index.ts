/**
 * @fileoverview Hooks module exports
 * 
 * @module hooks
 */

// Paginated data management
export { usePaginatedData } from './usePaginatedData';
export type {
  PaginatedDataState,
  PaginatedDataActions,
  UsePaginatedDataOptions,
} from './usePaginatedData';

// Server-side table data (fetchFn + pagination/sort/search/filters/selection)
export { useServerTableData } from './useServerTableData';
export type {
  SortState as ServerTableSortState,
  UseServerTableDataOptions,
  UseServerTableDataReturn,
} from './useServerTableData';

// Form state management
export { useFormState } from './useFormState';
export type {
  FormState,
  FormActions,
  FieldProps,
  UseFormStateOptions,
} from './useFormState';

// Column configuration
export { useColumnConfig } from './useColumnConfig';
export type {
  ColumnState,
  ColumnConfigState,
  ColumnConfigActions,
  UseColumnConfigOptions,
} from './useColumnConfig';

// Table selection
export { useTableSelection } from './useTableSelection';
export type {
  TableSelectionState,
  TableSelectionActions,
  UseTableSelectionOptions,
} from './useTableSelection';
