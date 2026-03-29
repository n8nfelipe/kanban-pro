import React, { useMemo } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { Activity, Target, Zap, Clock } from 'lucide-react';

export default function AnalyticsView() {
  const { board } = useBoardStore();

  const metrics = useMemo(() => {
    if (!board) return { total: 0, done: 0, byPriority: { urgent: 0, high: 0, medium: 0, low: 0 }, byCol: [] };

    let total = 0;
    let done = 0;
    const byPriority: Record<string, number> = { urgent: 0, high: 0, medium: 0, low: 0 };
    const byCol: { title: string, count: number }[] = [];

    board.columns.forEach((col: any) => {
      const count = col.cards.length;
      total += count;
      byCol.push({ title: col.title, count });
      
      if (col.title.toLowerCase().includes('done')) {
        done += count;
      }

      col.cards.forEach((card: any) => {
        if (byPriority[card.priority] !== undefined) {
          byPriority[card.priority]++;
        }
      });
    });

    return { total, done, byPriority, byCol };
  }, [board]);

  if (!board) return null;

  const progressPct = metrics.total > 0 ? Math.round((metrics.done / metrics.total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div style={{
      height: '100%', width: '100%',
      display: 'flex', flexDirection: 'column', gap: '20px',
      overflow: 'hidden', animation: 'aurora-appear 0.4s ease-out',
    }}>
      {/* Top row: KPI squares */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricCard title="Total Tasks" value={metrics.total} icon={<Target size={18}/>} color="var(--neon-blue)" border="rgba(56,189,248,0.2)" bg="rgba(56,189,248,0.05)" />
        <MetricCard title="Completed" value={metrics.done} icon={<Zap size={18}/>} color="var(--neon-green)" border="rgba(52,211,153,0.2)" bg="rgba(52,211,153,0.05)" />
        <MetricCard title="Urgent" value={metrics.byPriority.urgent} icon={<Activity size={18}/>} color="var(--neon-rose)" border="rgba(244,114,182,0.2)" bg="rgba(244,114,182,0.05)" />
        <MetricCard title="Time Tracked" value="42h" icon={<Clock size={18}/>} color="var(--neon-purple)" border="rgba(167,139,250,0.2)" bg="rgba(167,139,250,0.05)" />
      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', flex: 1, minHeight: 0 }}>
        
        {/* Progress Circular Chart */}
        <div style={{
          background: 'rgba(8, 12, 26, 0.55)', backdropFilter: 'blur(18px)',
          borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(56,189,248,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'flex-start', margin: '0 0 20px 0' }}>Sprint Progress</h3>
          
          <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r={radius} fill="transparent"
                stroke="url(#progress-gradient)" strokeWidth="12"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{progressPct}%</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Done</span>
            </div>
          </div>
        </div>

        {/* Bar Chart: load by column */}
        <div style={{
          background: 'rgba(8, 12, 26, 0.55)', backdropFilter: 'blur(18px)',
          borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '24px', display: 'flex', flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>Tasks Pipeline (Columns)</h3>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '8px', paddingBottom: '12px' }}>
            {metrics.byCol.map((col, i) => {
              const maxCount = Math.max(...metrics.byCol.map(c => c.count), 1);
              const heightPct = (col.count / maxCount) * 100;

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: `${heightPct}%`, minHeight: '4px',
                      background: 'linear-gradient(180deg, rgba(56,189,248,0.8), rgba(99,102,241,0.2))',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: '-24px', width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>
                        {col.count}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500,
                    textAlign: 'center', height: '28px', display: 'flex', alignItems: 'center'
                  }}>
                    {col.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, border, bg }: any) {
  return (
    <div style={{
      background: 'rgba(8, 12, 26, 0.55)', backdropFilter: 'blur(18px)',
      borderRadius: '16px', border: `1px solid rgba(255,255,255,0.05)`,
      padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      transition: 'transform 0.2s, background 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(8, 12, 26, 0.55)'; }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color: color, border: `1px solid ${border}`
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', color: 'white', fontWeight: 800, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, color: color, pointerEvents: 'none' }}>
        {React.cloneElement(icon, { size: 80 })}
      </div>
    </div>
  );
}
