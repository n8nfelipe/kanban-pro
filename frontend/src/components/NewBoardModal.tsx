import React, { useState } from 'react';
import { X, LayoutGrid, Layers, Star, Hexagon, Activity, Briefcase } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const AVAILABLE_ICONS = [
  { id: 'layout', component: LayoutGrid },
  { id: 'layers', component: Layers },
  { id: 'star', component: Star },
  { id: 'hexagon', component: Hexagon },
  { id: 'activity', component: Activity },
  { id: 'briefcase', component: Briefcase },
];

export default function NewBoardModal() {
  const { isNewBoardModalOpen, closeNewBoardModal, addBoard } = useAppStore();

  const [name, setName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState('layout');

  if (!isNewBoardModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const iconToSave = AVAILABLE_ICONS.find(i => i.id === selectedIconId)?.component || LayoutGrid;

    // Dispatch the add board action logic. 
    // This injects `workspaceId` implicitly via the Zustand store method we designed.
    addBoard({
      name,
      icon: iconToSave,
      tag: 'NEW'
    });

    // Reset and close
    setName('');
    setSelectedIconId('layout');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(8, 12, 26, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: 'rgba(15, 20, 35, 0.95)',
        border: '1px solid var(--border-subtle)', borderRadius: '24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create New Board</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Add a new campaign or workflow to this workspace.</p>
          </div>
          <button onClick={closeNewBoardModal} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>BOARD NAME</label>
            <input
              type="text"
              placeholder="e.g. Winter Campaign"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: 'white', padding: '12px 14px',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--neon-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
              autoFocus
              required
            />
          </div>

          {/* Icon Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CHOOSE ICON</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_ICONS.map(iconConfig => {
                const IconComp = iconConfig.component;
                const isSelected = selectedIconId === iconConfig.id;
                return (
                  <button
                    key={iconConfig.id}
                    type="button"
                    onClick={() => setSelectedIconId(iconConfig.id)}
                    style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: isSelected ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'var(--neon-blue)' : 'var(--border-subtle)'}`,
                      color: isSelected ? 'var(--neon-blue)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <IconComp size={18} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-ghost" onClick={closeNewBoardModal}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>Create Board</button>
          </div>

        </form>
      </div>
    </div>
  );
}
