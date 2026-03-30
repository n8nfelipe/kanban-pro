'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Layers, Users, Settings2, Bell, Search, Plus,
  Filter, Zap, ChevronRight, BarChart3, Calendar, Inbox,
  Hash, Star, Activity, Command, GitPullRequest, Loader2, LogOut
} from 'lucide-react';
import ListView from './ListView';
import TimelineView from './TimelineView';
import AnalyticsView from './AnalyticsView';
import TeamView from './TeamView';
import InboxView from './InboxView';
import SettingsView from './SettingsView';
import NewTaskModal from './NewTaskModal';
import NewBoardModal from './NewBoardModal';
import AuthPage from './AuthPage';
import { useAppStore, MainAppView, KanbanTab } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
// import { MOCK_WORKSPACES } from '@/lib/mockData';

const bottomLinks = [
  { id: 'team',      icon: Users,     label: 'Team',      badge: null },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
  { id: 'inbox',     icon: Inbox,     label: 'Inbox',     badge: '3'  },
  { id: 'settings',  icon: Settings2, label: 'Settings',  badge: null },
];

const viewTabs: KanbanTab[] = ['Board', 'List', 'Timeline', 'Analytics'];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    activeWorkspaceId, activeBoardId, mainAppView, kanbanActiveTab, boardsList,
    setWorkspace, setBoard, setMainView, setKanbanTab, openNewTaskModal, openNewBoardModal,
    workspacesConfig, fetchWorkspaces, searchQuery, setSearchQuery
  } = useAppStore();

  const { user, loading, fetchUser, logout } = useAuthStore();
  const [boardLoading, setBoardLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--neon-blue)' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Derive current display names
  const currentWorkspace = workspacesConfig.find(w => w.id === activeWorkspaceId) || workspacesConfig[0] || { name: 'Loading...', accent: '#666', icon: '◌' };
  const activeBoards = boardsList.filter(b => b.workspaceId === activeWorkspaceId);
  const currentBoard = activeBoards.find(b => b.id === activeBoardId) || activeBoards[0] || { name: 'Board' };

  // Helper to simulate network delay switching boards
  const handleBoardSwitch = (id: string) => {
    if (activeBoardId === id && mainAppView === 'Kanban') return;
    setBoardLoading(true);
    setBoard(id);
    setTimeout(() => {
      setBoardLoading(false);
    }, 600);
  };

  const handleBottomLink = (id: string) => {
    if (id === 'analytics') {
      setKanbanTab('Analytics');
    } else if (id === 'team') {
      setMainView('Team');
    } else if (id === 'inbox') {
      setMainView('Inbox');
    } else if (id === 'settings') {
      setMainView('Settings');
    }
  };

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
          {workspacesConfig.map(ws => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <a key={ws.id} onClick={(e) => { e.preventDefault(); setWorkspace(ws.id); }} href="#" className={`nav-item${isActive ? ' active' : ''}`}
                style={{
                  marginBottom: '2px',
                  ...(isActive ? {
                    color: ws.accent,
                    background: `rgba(${ws.rgb || '255,255,255'},0.07)`,
                    borderColor: `rgba(${ws.rgb || '255,255,255'},0.18)`,
                  } : {})
                }}>
                <span style={{ fontSize: '17px', lineHeight: 1, color: ws.accent, filter: isActive ? `drop-shadow(0 0 6px ${ws.accent})` : 'none' }}>{ws.icon}</span>
                <span style={{ flex: 1, fontSize: '12.5px' }}>{ws.name}</span>
                <span className="workspace-count">{ws.count || 0}</span>
                {isActive && <ChevronRight size={11} style={{ color: ws.accent, flexShrink: 0 }} />}
              </a>
            );
          })}
        </div>

        <div className="sidebar-divider" />

        {/* Active Boards */}
        <div style={{ padding: '10px 12px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '4px' }}>
            <div className="nav-section-label" style={{ margin: 0 }}>Active Boards</div>
            <button
              onClick={openNewBoardModal}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-blue)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            ><Plus size={12} /></button>
          </div>
          {activeBoards.map(board => {
            const Icon = board.icon;
            const isActive = board.id === activeBoardId && mainAppView === 'Kanban';
            return (
              <a key={board.id} onClick={(e) => { e.preventDefault(); handleBoardSwitch(board.id); }} href="#" className={`nav-item${isActive ? ' active' : ''}`}
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
                {isActive && <div className="nav-active-dot" />}
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
              const isActive = (link.id === 'analytics' && mainAppView === 'Kanban' && kanbanActiveTab === 'Analytics') ||
                               (mainAppView !== 'Kanban' && mainAppView.toLowerCase() === link.id);
              
              return (
                <a key={i} onClick={(e) => { e.preventDefault(); handleBottomLink(link.id); }} href="#" 
                   className={`nav-item${isActive ? ' active' : ''}`} style={{ position: 'relative', justifyContent: 'flex-start', fontSize: '12px', padding: '7px 10px' }}>
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
          <div className="user-card" onClick={() => setMainView('Settings')}>
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', width: '34px', height: '34px', fontSize: '10px', flexShrink: 0 }}>
              {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div className="status-dot" />
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{user.email}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); logout(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
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
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: currentWorkspace.accent || 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{currentWorkspace.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '16px', fontWeight: 300 }}>/</span>
                <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.025em', color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{mainAppView === 'Kanban' ? currentBoard.name : mainAppView}</h1>
              </div>
              
              {mainAppView === 'Kanban' && (
                <>
                  <span style={{
                    fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--neon-indigo)', background: 'rgba(129,140,248,0.08)',
                    border: '1px solid rgba(129,140,248,0.2)',
                    padding: '2px 9px', borderRadius: '20px', fontWeight: 700,
                  }}>v2.1.0</span>
                  <span style={{
                    fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--neon-amber)', background: 'rgba(251,191,36,0.07)',
                    border: '1px solid rgba(251,191,36,0.18)',
                    padding: '2px 9px', borderRadius: '20px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <GitPullRequest size={10} /> Sprint 14
                  </span>
                </>
              )}
            </div>

            {/* Right controls */}
            {mainAppView === 'Kanban' && (
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
                <button className="btn-icon" style={{ marginLeft: '2px' }} onClick={() => setMainView('Inbox')}>
                  <Bell size={15} />
                  <div className="notification-dot" />
                </button>

                <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* New task */}
                <button className="btn-primary" onClick={() => openNewTaskModal()}>
                  <Plus size={14} />
                  New Task
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Toolbar strip (Only on Kanban) */}
        {mainAppView === 'Kanban' && (
          <div className="toolbar-strip">
            {/* View tabs */}
            <div className="view-tabs">
              {viewTabs.map(tab => (
                <button
                  key={tab}
                  className={`view-tab${kanbanActiveTab === tab ? ' active' : ''}`}
                  onClick={() => setKanbanTab(tab)}
                >{tab}</button>
              ))}
            </div>

            {/* Right info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Team avatars */}
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} onClick={() => setMainView('Team')}>
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
                  cursor: 'pointer'
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
        )}

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', padding: '20px 24px' }}>
          {boardLoading ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-muted)' }}>
              <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite', color: currentWorkspace.accent }} />
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Syncing {currentBoard.name}...</div>
            </div>
          ) : (
            <>
              {mainAppView === 'Kanban' && kanbanActiveTab === 'Board' && children}
              {mainAppView === 'Kanban' && kanbanActiveTab === 'List' && <ListView />}
              {mainAppView === 'Kanban' && kanbanActiveTab === 'Timeline' && <TimelineView />}
              {mainAppView === 'Kanban' && kanbanActiveTab === 'Analytics' && <AnalyticsView />}

              {mainAppView === 'Team' && <TeamView />}
              {mainAppView === 'Inbox' && <InboxView />}
              {mainAppView === 'Settings' && <SettingsView />}
            </>
          )}
        </div>
      </main>

      <NewTaskModal />
      <NewBoardModal />

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
