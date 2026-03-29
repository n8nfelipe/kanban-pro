import React, { useMemo } from 'react';
import { useBoardStore } from '@/store/useBoardStore';

export default function TimelineView() {
  const { board } = useBoardStore();

  const TIMELINE_START = new Date('2026-03-18T00:00:00Z');
  const TIMELINE_DAYS = 24;
  const DAY_WIDTH = 48; // px per day

  const { cards, dates } = useMemo(() => {
    if (!board) return { cards: [], dates: [] };

    const flatCards: any[] = [];
    board.columns.forEach((col: any) => {
      col.cards.forEach((c: any) => {
        if (c.startDate && c.dueDate) {
          flatCards.push({ ...c, columnTitle: col.title });
        }
      });
    });

    const dts = [];
    for (let i = 0; i < TIMELINE_DAYS; i++) {
      const dt = new Date(TIMELINE_START);
      dt.setUTCDate(dt.getUTCDate() + i);
      dts.push(dt);
    }

    return { cards: flatCards, dates: dts };
  }, [board, TIMELINE_START, TIMELINE_DAYS]);

  if (!board) return null;

  return (
    <div style={{
      height: '100%', width: '100%',
      background: 'rgba(8, 12, 26, 0.55)',
      backdropFilter: 'blur(18px)',
      borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', animation: 'aurora-appear 0.4s ease-out',
    }}>
      {/* Header Info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Sprint Timeline</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Viewing {cards.length} scheduled tasks</p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Y Axis (Task Labels) */}
        <div style={{
          width: '240px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column', background: 'rgba(3,5,8,0.3)', zIndex: 10
        }}>
          {/* Header spacer */}
          <div style={{ height: '44px', borderBottom: '1px solid var(--border-subtle)' }} />
          <div style={{ flex: 1, overflowY: 'auto' }} className="timeline-y-scroll">
            {cards.map(card => (
              <div key={card.id} style={{
                height: '48px', padding: '0 16px', display: 'flex', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '12px', fontWeight: 500,
                color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {card.title}
              </div>
            ))}
          </div>
        </div>

        {/* Right X Axis (Gantt Chart Area) */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative' }}>
          {/* Date Header */}
          <div style={{
            display: 'flex', height: '44px', borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(255,255,255,0.01)', width: `${TIMELINE_DAYS * DAY_WIDTH}px`
          }}>
            {dates.map((dt, i) => (
              <div key={dt.toISOString()} style={{
                width: `${DAY_WIDTH}px`, flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                borderRight: '1px solid rgba(255,255,255,0.03)',
                background: dt.getUTCDay() === 0 || dt.getUTCDay() === 6 ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {dt.getUTCDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Grid area */}
          <div style={{ position: 'relative', width: `${TIMELINE_DAYS * DAY_WIDTH}px`, height: 'calc(100% - 44px)' }}>
            {/* Background Grid Lines */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
              {dates.map((dt, i) => (
                <div key={i} style={{
                  width: `${DAY_WIDTH}px`, height: '100%',
                  borderRight: '1px solid rgba(255,255,255,0.02)',
                  background: dt.getUTCDay() === 0 || dt.getUTCDay() === 6 ? 'rgba(255,255,255,0.01)' : 'transparent',
                }} />
              ))}
            </div>

            {/* Task Bars container */}
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }} className="timeline-y-scroll" onScroll={(e) => {
              // Quick and dirty scroll sync (in a real app, use refs)
              const yLabels = document.querySelectorAll('.timeline-y-scroll');
              yLabels.forEach(el => {
                if (el !== e.currentTarget && el.scrollTop !== e.currentTarget.scrollTop) {
                  el.scrollTop = e.currentTarget.scrollTop;
                }
              });
            }}>
              {cards.map((card, idx) => {
                // Calculate position
                const start = new Date(card.startDate + 'T00:00:00Z');
                const end = new Date(card.dueDate + 'T23:59:59Z');
                
                // Diff in days relative to timeline start
                const startOff = (start.getTime() - TIMELINE_START.getTime()) / (1000 * 3600 * 24);
                const dur = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

                const left = Math.max(0, startOff * DAY_WIDTH);
                const width = Math.max(DAY_WIDTH, dur * DAY_WIDTH);

                // Bar color logic based on priority
                let bgGradient = 'linear-gradient(90deg, #38bdf8, #818cf8)';
                let glow = 'rgba(56, 189, 248, 0.4)';
                if (card.priority === 'urgent') { 
                  bgGradient = 'linear-gradient(90deg, #f472b6, #e11d48)'; glow = 'rgba(244,114,182,0.4)'; 
                } else if (card.priority === 'high') { 
                  bgGradient = 'linear-gradient(90deg, #fbbf24, #d97706)'; glow = 'rgba(251,191,36,0.4)'; 
                } else if (card.priority === 'low') { 
                  bgGradient = 'linear-gradient(90deg, #34d399, #059669)'; glow = 'rgba(52,211,153,0.4)'; 
                }

                return (
                  <div key={card.id} style={{
                    height: '48px', position: 'relative', borderBottom: '1px solid transparent',
                    display: 'flex', alignItems: 'center'
                  }}>
                    <div style={{
                      position: 'absolute', left: `${left}px`, width: `${width}px`,
                      height: '24px', borderRadius: '12px', background: bgGradient,
                      boxShadow: `0 4px 12px ${glow}`, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', padding: '0 8px',
                      color: 'white', fontSize: '10px', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap'
                    }} title={`${card.title} (${card.startDate} to ${card.dueDate})`}>
                      {card.assignee && (
                        <div className="avatar" style={{ background: 'rgba(0,0,0,0.2)', width: '16px', height: '16px', fontSize: '6px', marginRight: '6px', border: '1px solid rgba(255,255,255,0.4)' }}>
                          {card.assignee.initials}
                        </div>
                      )}
                      {card.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
