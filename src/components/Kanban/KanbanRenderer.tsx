import React, { useMemo } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { KanbanRendererProps, KanbanItem } from './KanbanTypes';
import type { DataRecord } from '../../core/types';

/**
 * KanbanRenderer
 * 
 * Generic Kanban component for Dynamic UI Kit.
 * Maps DataRecord[] to KanbanItem[] and handles layout.
 */
export function KanbanRenderer({
  columns,
  data,
  mapRecord,
  mapping = {},
  onItemMove,
  onCardClick,
  loading
}: KanbanRendererProps) {

  // Auto-mapping logic if mapRecord is not provided
  const items = useMemo(() => {
    return data.map((record): KanbanItem => {
      if (mapRecord) return mapRecord(record);

      const idKey = mapping.id || 'id';
      const titleKey = mapping.title || 'name';
      const subtitleKey = mapping.subtitle || 'description';
      const statusKey = mapping.status || 'status';
      const colorKey = mapping.color || 'color';

      return {
        id: record[idKey] as string | number,
        title: record[titleKey] as string,
        subtitle: record[subtitleKey] as string,
        status: String(record[statusKey]).toLowerCase(),
        color: record[colorKey] as string,
        originalData: record
      };
    });
  }, [data, mapRecord, mapping]);

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center h-100 py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="dui-kanban-renderer h-100" style={{ minHeight: '500px' }}>
      <KanbanBoard
        columns={columns}
        items={items}
        onItemMove={(id, status) => onItemMove?.(id, status)}
        onCardClick={onCardClick}
      />
    </div>
  );
}
