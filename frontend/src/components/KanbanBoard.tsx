'use client';

import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { useBoardStore } from '@/store/useBoardStore';
import { Plus, LayoutGrid } from 'lucide-react';

export const KanbanBoard = () => {
  const { board, moveCard } = useBoardStore();

  if (!board) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        border: '2px solid var(--neon-blue)', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading board...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveCard(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex', gap: '14px', height: '100%',
        alignItems: 'flex-start', paddingBottom: '16px',
        overflowX: 'auto', overflowY: 'hidden',
      }}>
        {board.columns.map((column: any) => (
          <KanbanColumn key={column.id} column={column} />
        ))}

        {/* New Column button */}
        <button
          className="add-column-btn"
          style={{ alignSelf: 'flex-start', marginTop: '0' }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            border: '1.5px dashed currentColor', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '2px',
            opacity: 0.6,
          }}>
            <Plus size={14} />
          </div>
          New Column
        </button>
      </div>
    </DragDropContext>
  );
};
