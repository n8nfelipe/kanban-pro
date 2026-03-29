import React from 'react';
import { Mail, CheckCircle2, CircleDashed } from 'lucide-react';

export default function TeamView() {
  const members = [
    { id: '1', name: 'John Doe', role: 'Admin', email: 'john@kanban.pro', initials: 'JD', color: 'linear-gradient(135deg,#0ea5e9,#6366f1)', status: 'Online' },
    { id: '2', name: 'Alice Lee', role: 'Developer', email: 'alice@kanban.pro', initials: 'AL', color: 'linear-gradient(135deg,#a78bfa,#ec4899)', status: 'In a meeting' },
    { id: '3', name: 'Mike Ross', role: 'Designer', email: 'mike@kanban.pro', initials: 'MR', color: 'linear-gradient(135deg,#34d399,#059669)', status: 'Offline' },
    { id: '4', name: 'Sarah Connor', role: 'Product Manager', email: 'sarah@kanban.pro', initials: 'SC', color: 'linear-gradient(135deg,#f472b6,#fb7185)', status: 'Online' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'aurora-appear 0.4s ease-out' }}>
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Team & Members</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Manage workspace permissions and access roles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', overflowY: 'auto', paddingBottom: '20px' }}>
        {members.map(member => (
          <div key={member.id} style={{
            background: 'rgba(8, 12, 26, 0.55)', backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            transition: 'transform 0.2s, background 0.2s', cursor: 'pointer', position: 'relative', overflow: 'hidden'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(8, 12, 26, 0.55)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: member.color, opacity: 0.15 }} />
            
            <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '20px', background: member.color, marginBottom: '16px', border: '4px solid rgba(8, 12, 26, 0.9)', zIndex: 1 }}>{member.initials}</div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 4px', fontFamily: "'Outfit', sans-serif", zIndex: 1 }}>{member.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', fontFamily: "'JetBrains Mono', monospace", zIndex: 1 }}>{member.role}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.status === 'Online' ? 'var(--neon-green)' : member.status === 'In a meeting' ? 'var(--neon-amber)' : 'var(--text-muted)' }} />
              {member.status}
            </div>

            <button className="btn-ghost" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>View Profile</button>
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
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>+</div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Invite New Member</span>
        </div>
      </div>
    </div>
  );
}
