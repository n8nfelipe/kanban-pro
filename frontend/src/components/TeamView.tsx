'use client';

import React, { useEffect } from 'react';
import { Mail, CheckCircle2, CircleDashed, Loader2, UserPlus } from 'lucide-react';
import { useMemberStore } from '@/store/useMemberStore';
import { useAppStore } from '@/store/useAppStore';

const GRADIENT_COLORS = [
  'linear-gradient(135deg,#0ea5e9,#6366f1)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#34d399,#059669)',
  'linear-gradient(135deg,#f472b6,#fb7185)',
  'linear-gradient(135deg,#fbbf24,#ea580c)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(index: number): string {
  return GRADIENT_COLORS[index % GRADIENT_COLORS.length];
}

export default function TeamView() {
  const { activeWorkspaceId } = useAppStore();
  const { members, loading, fetchMembers } = useMemberStore();

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchMembers(activeWorkspaceId);
    }
  }, [activeWorkspaceId, fetchMembers]);

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--neon-blue)' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'aurora-appear 0.4s ease-out' }}>
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Team & Members</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          {members.length} member{members.length !== 1 ? 's' : ''} in this workspace
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', overflowY: 'auto', paddingBottom: '20px' }}>
        {members.map((member, index) => (
          <div key={member.id} style={{
            background: 'rgba(8, 12, 26, 0.55)', backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            transition: 'transform 0.2s, background 0.2s', cursor: 'pointer', position: 'relative', overflow: 'hidden'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(8, 12, 26, 0.55)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: getGradient(index), opacity: 0.15 }} />
            
            <div className="avatar" style={{ 
              width: '64px', height: '64px', fontSize: '20px', 
              background: getGradient(index), marginBottom: '16px', 
              border: '4px solid rgba(8, 12, 26, 0.9)', zIndex: 1 
            }}>
              {getInitials(member.name)}
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 4px', fontFamily: "'Outfit', sans-serif", zIndex: 1 }}>
              {member.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', fontFamily: "'JetBrains Mono', monospace", zIndex: 1 }}>
              {member.email}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--neon-blue)' }}>{member._count?.cards || 0}</span>
                <span>tasks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--neon-purple)' }}>{(member._count?.boards || 0) + (member._count?.ownedBoards || 0)}</span>
                <span>boards</span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '6px 14px', marginTop: '16px',
              background: 'rgba(255,255,255,0.03)', borderRadius: '20px', 
              fontSize: '11px', color: 'var(--text-secondary)' 
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)' }} />
              Active
            </div>

            <div style={{ 
              marginTop: '16px', fontSize: '10px', color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace" 
            }}>
              Joined {new Date(member.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {/* Invite Button Card */}
        <div style={{
          border: '1.5px dashed var(--border-subtle)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '12px', color: 'var(--text-muted)', transition: 'all 0.2s', cursor: 'pointer', minHeight: '300px'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-blue)'; e.currentTarget.style.color = 'var(--neon-blue)'; e.currentTarget.style.background = 'rgba(56,189,248,0.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={24} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Invite New Member</span>
        </div>
      </div>
    </div>
  );
}
