'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { useBoardStore } from '@/store/useBoardStore';
import { Plus, LayoutGrid, X } from 'lucide-react';

export const KanbanBoard = () => {
  const { board, moveCard, addColumn } = useBoardStore();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

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

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex', gap: '14px', height: '100%',
        paddingBottom: '16px', minHeight: 0,
        overflowX: 'auto', overflowY: 'hidden',
      }}>
        {board.columns.map((column: any) => (
          <KanbanColumn key={column.id} column={column} />
        ))}

        {/* New Column Section */}
        {!isAddingColumn ? (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="add-column-btn"
            style={{ alignSelf: 'flex-start', marginTop: '0', flexShrink: 0 }}
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
        ) : (
          <form 
            onSubmit={handleAddColumn}
            style={{ 
              alignSelf: 'flex-start', flexShrink: 0,
              width: '280px', padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Column title..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              autoFocus
              style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)',
                color: 'white', padding: '8px 12px', borderRadius: '8px',
                fontSize: '14px', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => { setIsAddingColumn(false); setNewColumnTitle(''); }}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '6px'
                }}
              >
                <X size={16} />
              </button>
              <button 
                type="submit"
                disabled={!newColumnTitle.trim()}
                style={{
                  background: 'var(--neon-blue)', color: 'black', border: 'none',
                  borderRadius: '6px', padding: '6px 12px', fontSize: '13px',
                  fontWeight: 600, cursor: newColumnTitle.trim() ? 'pointer' : 'not-allowed',
                  opacity: newColumnTitle.trim() ? 1 : 0.5
                }}
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>
    </DragDropContext>
  );
};
