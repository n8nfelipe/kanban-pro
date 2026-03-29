import React from 'react';
import { Mail, CheckCircle2, CircleDashed } from 'lucide-react';

export default function InboxView() {
  const notifications = [
    { id: 1, text: 'Alice Lee mentioned you in "Database Schema"', time: '10m ago', unread: true, tag: 'Mention' },
    { id: 2, text: 'Pull request #42 approved by team', time: '1h ago', unread: true, tag: 'System' },
    { id: 3, text: 'Sprint 14 starting tomorrow', time: '1d ago', unread: false, tag: 'System' },
    { id: 4, text: 'Mike Ross assigned "Socket.io Integration" to you', time: '2d ago', unread: false, tag: 'Assignment' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'aurora-appear 0.4s ease-out' }}>
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: "'Outfit', sans-serif", margin: 0 }}>Inbox (3)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Catch up on assignments and mentions across all your boards.</p>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map(notif => (
          <div key={notif.id} style={{
            background: notif.unread ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${notif.unread ? 'rgba(56,189,248,0.2)' : 'var(--border-subtle)'}`,
            borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start',
            backdropFilter: 'blur(16px)', transition: 'transform 0.2s', cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <div style={{ color: notif.unread ? 'var(--neon-blue)' : 'var(--text-muted)' }}>
              {notif.unread ? <CircleDashed size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: notif.unread ? 'white' : 'var(--text-secondary)', fontWeight: notif.unread ? 600 : 500, marginBottom: '6px' }}>{notif.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{notif.time}</span>
                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{notif.tag}</span>
              </div>
            </div>
            <button className="btn-ghost" style={{ padding: '6px 12px' }}>Clear</button>
          </div>
        ))}
      </div>
    </div>
  );
}
