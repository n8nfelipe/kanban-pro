import React from 'react';
import { Monitor, Bell, Shield, Cloud, CreditCard, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsView() {
  const { theme, setTheme, auroraEnabled, setAuroraEnabled, autoSyncEnabled, setAutoSyncEnabled, saveSettings } = useAppStore();

  const settingsSections = [
    { title: 'Appearance & System', icon: <Monitor size={18} />, desc: 'Configure theme and default views', id: 'appearance' },
    { title: 'Notifications', icon: <Bell size={18} />, desc: 'Manage email and app alerts', id: 'alerts' },
    { title: 'Security', icon: <Shield size={18} />, desc: '2FA and connected devices', id: 'security' },
    { title: 'Integrations', icon: <Cloud size={18} />, desc: 'GitHub, Slack, and Webhooks', id: 'integrations' },
    { title: 'Billing', icon: <CreditCard size={18} />, desc: 'Manage Enterprise subscription', id: 'billing' },
  ];

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
  };

  const handleAuroraToggle = () => {
    setAuroraEnabled(!auroraEnabled);
  };

  const handleAutoSyncToggle = () => {
    setAutoSyncEnabled(!autoSyncEnabled);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'aurora-appear 0.4s ease-out' }}>
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: "'Outfit', sans-serif", margin: 0 }}>System Settings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Control your workspace preferences.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={saveSettings}><Save size={14}/> Save Changes</button>
      </div>

      <div style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0 }}>
        {/* Sidebar Nav */}
        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--border-subtle)', paddingRight: '20px' }}>
          {settingsSections.map((sec, i) => (
            <div key={sec.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
              cursor: 'pointer', background: i === 0 ? 'rgba(56,189,248,0.06)' : 'transparent',
              color: i === 0 ? 'var(--neon-blue)' : 'var(--text-secondary)',
              border: `1px solid ${i === 0 ? 'rgba(56,189,248,0.2)' : 'transparent'}`, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'white'; } }}
            onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              {sec.icon}
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{sec.title}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '20px' }}>
          <div style={{ background: 'rgba(8, 12, 26, 0.4)', borderRadius: '20px', border: '1px solid var(--border-subtle)', padding: '32px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 24px', fontFamily: "'Outfit', sans-serif" }}>Appearance</h3>
            
            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Theme Preference</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose your workspace theme structure.</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn-ghost${theme === 'light' ? ' btn-primary' : ''}`} 
                  onClick={() => handleThemeChange('light')}
                >
                  Light
                </button>
                <button 
                  className={`btn-ghost${theme === 'dark' ? ' btn-primary' : ''}`} 
                  onClick={() => handleThemeChange('dark')}
                >
                  Premium Dark
                </button>
                <button 
                  className={`btn-ghost${theme === 'system' ? ' btn-primary' : ''}`} 
                  onClick={() => handleThemeChange('system')}
                >
                  System
                </button>
              </div>
            </div>

            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Aurora Effects</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enable dynamic animated gradient backgrounds.</div>
              </div>
              <div 
                style={{ 
                  width: '40px', height: '20px', 
                  background: auroraEnabled ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)', 
                  borderRadius: '10px', position: 'relative', cursor: 'pointer', 
                  boxShadow: auroraEnabled ? '0 0 10px rgba(52,211,153,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
                onClick={handleAuroraToggle}
              >
                <div style={{ 
                  width: '16px', height: '16px', background: 'white', borderRadius: '50%', 
                  position: 'absolute', 
                  left: auroraEnabled ? '22px' : '2px', top: '2px',
                  transition: 'left 0.2s'
                }} />
              </div>
            </div>

            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Auto-Sync Dashboards</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Keep Timeline and Analytics synced with Board changes via WebSockets.</div>
              </div>
              <div 
                style={{ 
                  width: '40px', height: '20px', 
                  background: autoSyncEnabled ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)', 
                  borderRadius: '10px', position: 'relative', cursor: 'pointer', 
                  boxShadow: autoSyncEnabled ? '0 0 10px rgba(52,211,153,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
                onClick={handleAutoSyncToggle}
              >
                <div style={{ 
                  width: '16px', height: '16px', background: 'white', borderRadius: '50%', 
                  position: 'absolute', 
                  left: autoSyncEnabled ? '22px' : '2px', top: '2px',
                  transition: 'left 0.2s'
                }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
