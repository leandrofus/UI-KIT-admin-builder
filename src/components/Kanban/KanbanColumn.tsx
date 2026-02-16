import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumnDef, KanbanItem } from './KanbanTypes';
import { KanbanCard } from './KanbanCard';
import { cn } from '../../core/utils';

interface KanbanColumnProps {
  definition: KanbanColumnDef;
  items: KanbanItem[];
  onCardClick?: (item: KanbanItem) => void;
}

export function KanbanColumn({ definition, items, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: definition.id,
  });

  return (
    <div
      className={cn(
        "dui-kanban-column d-flex flex-column h-100",
        isOver && "dui-kanban-column-over"
      )}
      style={{
        minWidth: '300px',
        maxWidth: '300px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        transition: 'background-color 0.2s ease'
      }}
    >
      {/* Header */}
      <div
        className="p-3 border-bottom d-flex justify-content-between align-items-center"
        style={{
             borderTopLeftRadius: '12px',
             borderTopRightRadius: '12px',
             borderTop: `4px solid ${definition.color || '#9ca3af'}`,
             backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-primary dark:text-gray-100" style={{ fontSize: '0.85rem', letterSpacing: '0.025em' }}>
            {definition.title}
            </span>
            <span 
                className="badge rounded-pill bg-light dark:bg-gray-700 text-muted dark:text-gray-300 border dark:border-gray-600" 
                style={{ fontSize: '0.7rem', fontWeight: 600 }}
            >
                {items.length}
            </span>
        </div>
      </div>

      {/* Body / Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-grow-1 p-2 dui-kanban-column-body"
        style={{ 
            overflowY: 'auto', 
            minHeight: '200px',
            backgroundColor: isOver ? 'var(--primary-50)' : 'transparent'
        }}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <KanbanCard key={item.id} item={item} onClick={onCardClick} />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
             <div className="text-center text-muted mt-5" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                <div className="mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
                </div>
                Sin elementos
             </div>
        )}
      </div>
    </div>
  );
}
