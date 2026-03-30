'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const COLUMN_STYLES: Record<string, { accent: string; rgb: string; gradient: string }> = {
  'Backlog':      { accent: '#64748b', rgb: '100,116,139', gradient: 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(100,116,139,0.05))' },
  'To Do':        { accent: '#38bdf8', rgb: '56,189,248',  gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.05))' },
  'In Progress':  { accent: '#a78bfa', rgb: '167,139,250', gradient: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))' },
  'Done':         { accent: '#34d399', rgb: '52,211,153',  gradient: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))' },
};

const COLUMN_EMOJIS: Record<string, string> = {
  'Backlog':     '📋',
  'To Do':       '🔵',
  'In Progress': '⚡',
  'Done':        '✅',
};

export const KanbanColumn = ({ column }: { column: any }) => {
  const { openNewTaskModal } = useAppStore();
  const style = COLUMN_STYLES[column.title] ?? COLUMN_STYLES['To Do'];
  const emoji = COLUMN_EMOJIS[column.title] ?? '📋';

  return (
    <div
      className="kanban-column"
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top accent gradient */}
      <div className="col-top-accent" style={{ background: style.gradient.replace('linear-gradient(135deg, ', 'linear-gradient(90deg, transparent, ').replace(', rgba', ', ').split(', rgba')[0] + ', transparent)' }} />
      {/* Cleaner top accent */}
      <div style={{
        position: 'absolute', top: -1, left: 14, right: 14, height: '2px',
        background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
        opacity: 0.65, borderRadius: '0 0 4px 4px',
      }} />

      {/* Header */}
      <div className="col-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          {/* Glowing dot */}
          <span
            className="col-indicator"
            style={{
              background: style.accent,
              boxShadow: `0 0 8px ${style.accent}99, 0 0 16px ${style.accent}33`,
            }}
          />
          {/* Emoji */}
          <span style={{ fontSize: '13px', lineHeight: 1 }}>{emoji}</span>
          {/* Title */}
          <span className="col-title" style={{ color: style.accent }}>
            {column.title}
          </span>
          {/* Count badge */}
          <span
            className="col-count"
            style={{
              color: style.accent,
              background: `rgba(${style.rgb},0.1)`,
              borderColor: `rgba(${style.rgb},0.22)`,
            }}
          >{String(column.cards.length).padStart(2, '0')}</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1px' }}>
          <button
            className="col-action-btn"
            title="Add card"
            onClick={() => openNewTaskModal(column.id)}
            onMouseEnter={e => { e.currentTarget.style.color = style.accent; e.currentTarget.style.background = `rgba(${style.rgb},0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
          >
            <Plus size={13} />
          </button>
          <button
            className="col-action-btn"
            title="Column options"
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
          >
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Column progress strip */}
      {column.cards.length > 0 && (
        <div style={{ padding: '0 14px 10px' }}>
          <div className="card-progress-bar">
            <div
              className="card-progress-fill"
              style={{
                width: column.title === 'Done' ? '100%' : `${Math.round((column.cards.length / 4) * 100)}%`,
                background: style.accent,
                boxShadow: `0 0 6px ${style.accent}66`,
              }}
            />
          </div>
        </div>
      )}

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="cards-drop-zone"
            style={{
              background: snapshot.isDraggingOver
                ? `rgba(${style.rgb},0.05)`
                : 'transparent',
              boxShadow: snapshot.isDraggingOver
                ? `inset 0 0 30px rgba(${style.rgb},0.04)`
                : 'none',
              borderRadius: '10px',
              outline: snapshot.isDraggingOver
                ? `1px dashed rgba(${style.rgb},0.25)`
                : '1px solid transparent',
              transition: 'all 0.2s ease',
              minHeight: 0
            }}
          >
            {column.cards.map((card: any, index: number) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                columnAccent={style.accent}
                columnRgb={style.rgb}
              />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {column.cards.length === 0 && !snapshot.isDraggingOver && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '6px', padding: '20px 0',
              }}>
                <span style={{ fontSize: '22px', opacity: 0.3 }}>{emoji}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>No tasks yet</span>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add task */}
      <button
        className="add-task-btn"
        onClick={() => openNewTaskModal(column.id)}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `rgba(${style.rgb},0.3)`;
          e.currentTarget.style.color = style.accent;
          e.currentTarget.style.background = `rgba(${style.rgb},0.04)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'none';
        }}
      >
        <Plus size={12} />
        Add task
      </button>
    </div>
  );
};
