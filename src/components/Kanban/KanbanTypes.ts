import type { DataRecord } from '../../core/types';

export interface KanbanItem {
  id: number | string;
  title: string;
  subtitle?: string;
  status: string; // matches column id
  color?: string; // e.g. for priority or type
  tags?: { label: string; color?: string }[];
  metadata?: Record<string, any>; // For extra data like responsible, date, etc.
  originalData?: DataRecord; // Full object reference
}

export interface KanbanColumnDef {
  id: string; // status code
  title: string;
  color?: string; // column header color
}

export interface KanbanRendererProps {
  columns: KanbanColumnDef[];
  data: DataRecord[];
  /** Mapper function to convert DataRecord to KanbanItem */
  mapRecord?: (record: DataRecord) => KanbanItem;
  /** Property names to use for auto-mapping if mapRecord is not provided */
  mapping?: {
    id?: string;
    title?: string;
    subtitle?: string;
    status?: string;
    color?: string;
    tags?: string;
  };
  onItemMove?: (itemId: string | number, newStatus: string) => void;
  onCardClick?: (item: KanbanItem) => void;
  loading?: boolean;
}
