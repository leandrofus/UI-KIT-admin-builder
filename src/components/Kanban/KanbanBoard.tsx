import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
  closestCenter,
} from '@dnd-kit/core';
import { KanbanColumnDef, KanbanItem } from './KanbanTypes';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  columns: KanbanColumnDef[];
  items: KanbanItem[];
  onItemMove: (itemId: UniqueIdentifier, newStatus: string) => void;
  onCardClick?: (item: KanbanItem) => void;
}

export function KanbanBoard({ columns, items, onItemMove, onCardClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItem = items.find((i) => i.id === active.id);
    if (!activeItem) return;

    let newStatus = '';
    
    // Check if over.id is a column
    const overColumn = columns.find(c => c.id === over.id);
    if (overColumn) {
        newStatus = overColumn.id;
    } else {
        // Must be an item, find its status
        const overItem = items.find(i => i.id === over.id);
        if (overItem) {
            newStatus = overItem.status;
        }
    }

    if (newStatus && newStatus !== activeItem.status) {
      onItemMove(active.id, newStatus);
    }
  };

  // Helper to filter items per column
  const getItemsForColumn = (columnId: string) => {
     return items.filter(i => i.status.toLowerCase() === columnId.toLowerCase());
  };

  return (
    <div className="dui-kanban-board d-flex flex-nowrap gap-4 h-100 p-3" style={{ overflowX: 'auto', alignItems: 'flex-start' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            definition={col}
            items={getItemsForColumn(col.id)}
            onCardClick={onCardClick}
          />
        ))}

        <DragOverlay>
            {activeItem ? (
                <div style={{ opacity: 0.8, transform: 'rotate(2deg)' }}>
                    <KanbanCard item={activeItem} isOverlay />
                </div>
            ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
