import React, { useMemo } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';

interface ListViewProps {}

export default function ListView({}: ListViewProps) {
  const { board } = useBoardStore();

  const allCards = useMemo(() => {
    if (!board) return [];

    const cards: any[] = [];
    board.columns.forEach((col: any) => {
      col.cards.forEach((card: any) => {
        cards.push({ ...card, columnTitle: col.title });
      });
    });
    return cards;
  }, [board]);

  if (!board) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading board data...</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return ['var(--neon-rose)', 'rgba(244,114,182,0.1)', 'rgba(244,114,182,0.2)'];
      case 'high':   return ['var(--neon-amber)', 'rgba(251,191,36,0.1)', 'rgba(251,191,36,0.2)'];
      case 'medium': return ['var(--neon-blue)', 'rgba(56,189,248,0.1)', 'rgba(56,189,248,0.2)'];
      case 'low':    return ['var(--neon-green)', 'rgba(52,211,153,0.1)', 'rgba(52,211,153,0.2)'];
      default:       return ['var(--text-muted)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)'];
    }
  };

  return (
    <div style={{
      height: '100%', width: '100%',
      background: 'rgba(8, 12, 26, 0.55)',
      backdropFilter: 'blur(18px)',
      borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', animation: 'aurora-appear 0.4s ease-out',
    }}>
      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1.5fr 1fr 1fr 1fr 1fr',
        gap: '16px', padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}><AlignLeft size={14}/> Task</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}><ShieldAlert size={14}/> Priority</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}><User size={14}/> Assignee</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Calendar size={14}/> Start Date</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Calendar size={14}/> Due Date</div>
      </div>

      {/* Table Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {allCards.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks available.</div>
        ) : (
          allCards.map((card, idx) => {
            const [pColor, pBg, pBorder] = getPriorityColor(card.priority);
            
            return (
              <div key={card.id} className="list-row" style={{
                display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1.5fr 1fr 1fr 1fr 1fr',
                gap: '16px', padding: '14px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Title & Desc */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{card.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.description}</div>
                </div>

                {/* Status Column */}
                <div>
                  <span style={{
                    fontSize: '10.5px', fontWeight: 600, color: 'var(--neon-indigo)',
                    background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
                    padding: '4px 10px', borderRadius: '20px', display: 'inline-block',
                  }}>
                    {card.columnTitle}
                  </span>
                </div>

                {/* Priority */}
                <div>
                  <span style={{
                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace",
                    color: pColor, background: pBg, border: `1px solid ${pBorder}`, padding: '4px 8px', borderRadius: '6px',
                  }}>
                    {card.priority}
                  </span>
                </div>

                {/* Assignee */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {card.assignee ? (
                    <>
                      <div className="avatar" style={{ background: card.assignee.color, width: '24px', height: '24px', fontSize: '8px' }}>{card.assignee.initials}</div>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{card.assignee.name}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                  )}
                </div>

                {/* Start Date */}
                <div style={{ fontSize: '12px', color: card.startDate ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                  {card.startDate || '-'}
                </div>

                {/* Due Date */}
                <div style={{ fontSize: '12px', color: card.dueDate ? 'white' : 'var(--text-muted)', fontWeight: card.dueDate ? 500 : 400 }}>
                  {card.dueDate || '-'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
