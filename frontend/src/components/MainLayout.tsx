'use client';

import React, { useState } from 'react';
import {
  LayoutGrid, Layers, Users, Settings2, Bell, Search, Plus,
  Filter, Zap, ChevronRight, BarChart3, Calendar, Inbox,
  Hash, Star, Activity, Command, GitPullRequest,
} from 'lucide-react';

const workspaces = [
  { id: 'w1', name: 'Engineering', icon: '⬡', accent: '#38bdf8', rgb: '56,189,248',  active: true,  count: 12 },
  { id: 'w2', name: 'Marketing',   icon: '◈', accent: '#a78bfa', rgb: '167,139,250', active: false, count: 5  },
  { id: 'w3', name: 'Design',      icon: '◎', accent: '#34d399', rgb: '52,211,153',  active: false, count: 8  },
];

const boards = [
  { id: 'b1', name: 'Sprint Backlog', icon: LayoutGrid, active: true,  tag: 'ACTIVE' },
  { id: 'b2', name: 'Product Roadmap', icon: Layers,    active: false, tag: null },
  { id: 'b3', name: 'Q2 Milestones',   icon: Star,      active: false, tag: null },
];

const bottomLinks = [
  { icon: Users,     label: 'Team',     badge: null },
  { icon: BarChart3, label: 'Analytics', badge: null },
  { icon: Inbox,     label: 'Inbox',    badge: '3'  },
  { icon: Settings2, label: 'Settings', badge: null },
];

const viewTabs = ['Board', 'List', 'Timeline', 'Analytics'];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('Board');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', background: 'var(--bg-base)' }}>

      {/* ─── BACKGROUND LAYERS ─── */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>
      <div className="grid-bg" />
      <div className="scanline" />

      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar" style={{ width: '232px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="sidebar-glow" />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '22px 18px 18px' }}>
          <div className="logo-mark" style={{
            width: '36px', height: '36px', borderRadius: '11px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '16px', color: 'white',
            userSelect: 'none', flexShrink: 0,
          }}>K</div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '15px', letterSpacing: '-0.03em', color: 'white', lineHeight: 1.1 }}>Kanban<span style={{ color: 'var(--neon-blue)' }}>Pro</span></div>
            <div style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.28em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginTop: '1px' }}>SYSTEM v2.1</div>
          </div>
        </div>

        {/* Quick Command */}
        <div style={{ padding: '0 12px', marginBottom: '14px' }}>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 12px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
            cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s',
            fontSize: '11.5px', fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; e.currentTarget.style.color = 'var(--neon-blue)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Search size={12} />
            <span style={{ flex: 1, textAlign: 'left' }}>Quick Search...</span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              fontSize: '9px', fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: '4px',
            }}>⌘K</span>
          </button>
        </div>

        <div className="sidebar-divider" />

        {/* Workspaces */}
        <div style={{ padding: '10px 12px 6px' }}>
          <div className="nav-section-label">Workspaces</div>
          {workspaces.map(ws => (
            <a key={ws.id} href="#" className={`nav-item${ws.active ? ' active' : ''}`}
              style={{
                marginBottom: '2px',
                ...(ws.active ? {
                  color: ws.accent,
                  background: `rgba(${ws.rgb},0.07)`,
                  borderColor: `rgba(${ws.rgb},0.18)`,
                } : {})
              }}>
              <span style={{ fontSize: '17px', lineHeight: 1, color: ws.accent, filter: ws.active ? `drop-shadow(0 0 6px ${ws.accent})` : 'none' }}>{ws.icon}</span>
              <span style={{ flex: 1, fontSize: '12.5px' }}>{ws.name}</span>
              <span className="workspace-count">{ws.count}</span>
              {ws.active && <ChevronRight size={11} style={{ color: ws.accent, flexShrink: 0 }} />}
            </a>
          ))}
        </div>

        <div className="sidebar-divider" />

        {/* Active Boards */}
        <div style={{ padding: '10px 12px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '4px' }}>
            <div className="nav-section-label" style={{ margin: 0 }}>Active Boards</div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-blue)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            ><Plus size={12} /></button>
          </div>
          {boards.map(board => {
            const Icon = board.icon;
            return (
              <a key={board.id} href="#" className={`nav-item${board.active ? ' active' : ''}`}
                style={{ marginBottom: '2px', fontSize: '12.5px' }}>
                <Icon size={13} className="nav-icon" />
                <span style={{ flex: 1 }}>{board.name}</span>
                {board.tag && (
                  <span style={{
                    fontSize: '7.5px', fontWeight: 800, letterSpacing: '0.12em',
                    color: 'var(--neon-green)', background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.2)', padding: '1px 5px', borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{board.tag}</span>
                )}
                {board.active && <div className="nav-active-dot" />}
              </a>
            );
          })}
        </div>

        {/* Activity section */}
        <div style={{ padding: '10px 12px 6px' }}>
          <div className="nav-section-label">Recent Activity</div>
          {[
            { text: 'JWT Auth merged', time: '2m', color: 'var(--neon-green)' },
            { text: 'New task by Alice', time: '8m', color: 'var(--neon-blue)' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 5px ${item.color}` }} />
              <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{item.time}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Bottom nav */}
        <div style={{ padding: '6px 12px 0' }}>
          <div className="sidebar-divider" style={{ marginBottom: '8px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '12px' }}>
            {bottomLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <a key={i} href="#" className="nav-item" style={{ position: 'relative', justifyContent: 'flex-start', fontSize: '12px', padding: '7px 10px' }}>
                  <Icon size={13} className="nav-icon" />
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {link.badge && (
                    <span style={{
                      fontSize: '8.5px', fontWeight: 700, color: 'white',
                      background: 'var(--neon-rose)', padding: '0 4px', borderRadius: '8px',
                      minWidth: '14px', textAlign: 'center', lineHeight: '14px',
                    }}>{link.badge}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '0 12px 16px' }}>
          <div className="user-card">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', width: '34px', height: '34px', fontSize: '10px', flexShrink: 0 }}>JD</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>John Doe</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div className="status-dot" />
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Online · Admin</span>
              </div>
            </div>
            <Settings2 size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, transition: 'color 0.2s' }} />
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}>

        {/* Top bar */}
        <header className="top-bar">
          <div className="top-bar-inner">
            {/* Breadcrumb + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>Engineering</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '16px', fontWeight: 300 }}>/</span>
                <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.025em', color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Sprint Backlog</h1>
              </div>
              <span style={{
                fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--neon-indigo)', background: 'rgba(129,140,248,0.08)',
                border: '1px solid rgba(129,140,248,0.2)',
                padding: '2px 9px', borderRadius: '20px', fontWeight: 700,
              }}>v2.1.0</span>
              {/* Sprint indicator */}
              <span style={{
                fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--neon-amber)', background: 'rgba(251,191,36,0.07)',
                border: '1px solid rgba(251,191,36,0.18)',
                padding: '2px 9px', borderRadius: '20px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <GitPullRequest size={10} /> Sprint 14
              </span>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Search */}
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="search-icon" size={13} />
              </div>

              {/* Filter */}
              <button className="btn-ghost" style={{ gap: '5px' }}>
                <Filter size={12} />
                <span>Filter</span>
              </button>

              {/* Calendar */}
              <button className="btn-icon">
                <Calendar size={15} />
              </button>

              {/* Activity */}
              <button className="btn-icon">
                <Activity size={15} />
              </button>

              {/* Notifications */}
              <button className="btn-icon" style={{ marginLeft: '2px' }}>
                <Bell size={15} />
                <div className="notification-dot" />
              </button>

              <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }} />

              {/* New task */}
              <button className="btn-primary">
                <Plus size={14} />
                New Task
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar strip */}
        <div className="toolbar-strip">
          {/* View tabs */}
          <div className="view-tabs">
            {viewTabs.map(tab => (
              <button
                key={tab}
                className={`view-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >{tab}</button>
            ))}
          </div>

          {/* Right info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Team avatars */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
              {['JD', 'AL', 'MK'].map((init, i) => (
                <div key={i} className="avatar" style={{
                  marginLeft: i > 0 ? '-6px' : 0,
                  background: ['linear-gradient(135deg,#0ea5e9,#6366f1)', 'linear-gradient(135deg,#a78bfa,#ec4899)', 'linear-gradient(135deg,#34d399,#059669)'][i],
                  width: '24px', height: '24px', fontSize: '7px',
                  zIndex: 3 - i, border: '2px solid var(--bg-base)',
                  cursor: 'pointer', transition: 'transform 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >{init}</div>
              ))}
              <div style={{
                marginLeft: '-6px', width: '24px', height: '24px', borderRadius: '50%',
                border: '2px solid var(--bg-base)', background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7px', fontWeight: 700, color: 'var(--text-muted)', zIndex: 0,
              }}>+2</div>
            </div>

            <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />

            <span style={{
              fontSize: '10px', color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Zap size={10} style={{ color: 'var(--neon-amber)' }} />
              Auto-sync
            </span>
            <div className="live-badge">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '20px 24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
