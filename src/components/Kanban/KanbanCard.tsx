import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanItem } from './KanbanTypes';
import { cn } from '../../core/utils';

interface KanbanCardProps {
  item: KanbanItem;
  onClick?: (item: KanbanItem) => void;
  isOverlay?: boolean;
}

export function KanbanCard({ item, onClick, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "dui-kanban-card card mb-2 shadow-sm border-0",
        isOverlay && "dui-kanban-card-overlay",
        isDragging && "dui-kanban-card-dragging"
      )}
      onClick={() => onClick && onClick(item)}
      style={{
        ...style,
        borderRadius: '8px',
        borderLeft: item.color ? `4px solid ${item.color}` : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title fw-bold text-truncate mb-0" style={{ maxWidth: '90%', fontSize: '0.9rem' }} title={item.title}>
              {item.title}
            </h6>
        </div>
        
        {item.subtitle && (
          <p className="card-subtitle text-muted mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
            {item.subtitle}
          </p>
        )}

        {/* Metadata section */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="dui-kanban-card-metadata mb-2">
             {Object.entries(item.metadata).map(([key, value]) => (
               <div key={key} className="text-secondary d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
                 <span className="text-muted dark:text-gray-400">{key}:</span> 
                 <span className="fw-medium text-dark dark:text-gray-200">{String(value)}</span>
               </div>
             ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-auto">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="badge rounded-pill"
                style={{
                    backgroundColor: tag.color ? `${tag.color}15` : 'var(--bg-tertiary)',
                    color: tag.color || 'var(--text-secondary)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    border: tag.color ? `1px solid ${tag.color}30` : '1px solid var(--border-color)'
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
