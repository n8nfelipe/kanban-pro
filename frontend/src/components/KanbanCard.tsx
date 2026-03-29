'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MoreHorizontal, MessageSquare, Paperclip, CheckCircle2, Clock, Tag, Edit2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface Priority {
  label: string;
  color: string;
  bgRgb: string;
  cardAccent: string;
  emoji: string;
}

const PRIORITIES: Record<string, Priority> = {
  low:    { label: 'LOW',    color: '#94a3b8', bgRgb: '148,163,184', cardAccent: '#64748b', emoji: '▽' },
  medium: { label: 'MED',    color: '#38bdf8', bgRgb: '56,189,248',  cardAccent: '#38bdf8', emoji: '◇' },
  high:   { label: 'HIGH',   color: '#fbbf24', bgRgb: '251,191,36',  cardAccent: '#fbbf24', emoji: '▲' },
  urgent: { label: 'URGENT', color: '#f472b6', bgRgb: '244,114,182', cardAccent: '#f472b6', emoji: '⚠' },
};

const TAGS_BY_PRIORITY: Record<string, string[]> = {
  low:    ['frontend', 'refactor'],
  medium: ['backend', 'api'],
  high:   ['auth', 'security'],
  urgent: ['hotfix', 'prod'],
};

const ASSIGNEES = ['JD', 'AL', 'MK', 'SA'];
const ASSIGNEE_COLORS = [
  'linear-gradient(135deg,#0ea5e9,#6366f1)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#34d399,#059669)',
  'linear-gradient(135deg,#fbbf24,#ea580c)',
];

interface Props { card: any; index: number; columnAccent?: string; columnRgb?: string; }

export const KanbanCard = ({ card, index, columnAccent, columnRgb }: Props) => {
  const [hovered, setHovered] = useState(false);
  const { openNewTaskModal } = useAppStore();
  const p = PRIORITIES[card.priority] ?? PRIORITIES.medium;
  const isHot = card.priority === 'urgent' || card.priority === 'high';
  const isUrgent = card.priority === 'urgent';
  const tags = TAGS_BY_PRIORITY[card.priority] ?? [];
  // Stable fake progress per card based on id char sum
  const progress = ((card.id.charCodeAt(card.id.length - 1) * 17) % 80) + 20;
  const assigneeIdx = card.id.charCodeAt(card.id.length - 1) % ASSIGNEES.length;
  const assignee = ASSIGNEES[assigneeIdx];
  const assigneeColor = ASSIGNEE_COLORS[assigneeIdx];

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent drag or other events if any
    openNewTaskModal(card.columnId, card.id);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card${snapshot.isDragging ? ' is-dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging
              ? 'rgba(14,20,50,0.96)'
              : hovered
                ? 'rgba(15,22,46,0.85)'
                : 'rgba(10,15,38,0.7)',
            border: snapshot.isDragging
              ? `1px solid ${p.cardAccent}60`
              : hovered
                ? `1px solid rgba(255,255,255,0.1)`
                : `1px solid rgba(255,255,255,0.05)`,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ''} rotate(1.5deg)`
              : provided.draggableProps.style?.transform,
            boxShadow: snapshot.isDragging
              ? `0 28px 64px rgba(0,0,0,0.7), 0 0 40px ${p.cardAccent}20`
              : hovered
                ? `0 14px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 20px ${p.cardAccent}10`
                : 'none',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            transition: snapshot.isDragging ? undefined : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Left accent bar */}
          <div
            className="card-left-bar"
            style={{
              background: isUrgent
                ? `linear-gradient(180deg, ${p.cardAccent}, #f43f5e)`
                : p.cardAccent,
              opacity: hovered || snapshot.isDragging ? 1 : isHot ? 0.85 : 0.45,
              boxShadow: (hovered || snapshot.isDragging) ? `0 0 12px ${p.cardAccent}` : `0 0 6px ${p.cardAccent}66`,
              transition: 'opacity 0.2s, box-shadow 0.2s',
            }}
          />

          {/* Hot ambient glow */}
          {isHot && (
            <div
              className="card-ambient"
              style={{
                background: `radial-gradient(circle at 85% 15%, ${p.cardAccent}12, transparent 55%)`,
                opacity: hovered ? 1 : 0.6,
                transition: 'opacity 0.2s',
              }}
            />
          )}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Top row: priority + menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                className="priority-badge"
                style={{
                  color: p.color,
                  background: `rgba(${p.bgRgb},0.12)`,
                  borderColor: `rgba(${p.bgRgb},0.28)`,
                  boxShadow: isHot ? `0 0 8px rgba(${p.bgRgb},0.2)` : 'none',
                }}
              >
                <span style={{ fontSize: '8px' }}>{p.emoji}</span>
                {p.label}
              </span>
              <button
                onClick={handleEditClick}
                title="Edit Task"
                style={{
                  padding: '4px', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', borderRadius: '6px',
                  opacity: hovered ? 1 : 0, transition: 'opacity 0.2s, background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <Edit2 size={13} />
              </button>
            </div>

            {/* Title */}
            <h4 style={{
              margin: 0, fontSize: '13px', fontWeight: 650, lineHeight: 1.4,
              color: hovered ? 'white' : 'var(--text-primary)', letterSpacing: '-0.015em',
              transition: 'color 0.15s',
            }}>
              {card.title}
            </h4>

            {/* Description */}
            {card.description && (
              <p style={{
                margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)',
                lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {card.description}
              </p>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span key={tag} className="card-tag">
                  <Tag size={8} style={{ marginRight: '3px', opacity: 0.7 }} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="card-progress-bar" style={{ flex: 1 }}>
                <div
                  className="card-progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: progress >= 80
                      ? `linear-gradient(90deg, ${p.cardAccent}, #34d399)`
                      : `linear-gradient(90deg, ${p.cardAccent}88, ${p.cardAccent})`,
                    boxShadow: `0 0 6px ${p.cardAccent}44`,
                  }}
                />
              </div>
              <span style={{
                fontSize: '9.5px', fontWeight: 700, color: p.color,
                fontFamily: "'JetBrains Mono', monospace", opacity: 0.8,
              }}>{progress}%</span>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              {/* Due date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <Clock size={10} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Mar 28</span>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Message count */}
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={10} />2
                </span>
                {/* Attachment count */}
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <Paperclip size={10} />1
                </span>
                {/* Assignee avatar */}
                <div
                  className="avatar"
                  title={assignee}
                  style={{
                    background: assigneeColor,
                    width: '22px', height: '22px', fontSize: '7px',
                    boxShadow: hovered ? `0 0 0 2px ${p.cardAccent}44` : 'none',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {assignee}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
