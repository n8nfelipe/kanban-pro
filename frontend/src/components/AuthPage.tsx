'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post(endpoint, payload);
      setAuth(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
      </div>
      <div className="grid-bg" />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '400px', padding: '40px',
        background: 'rgba(10, 15, 30, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px', backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '20px', color: 'white',
          }}>K</div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '20px', color: 'white' }}>
              Kanban<span style={{ color: 'var(--neon-blue)' }}>Pro</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              SYSTEM v2.1
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px', textAlign: 'center' }}>
          {isLogin ? 'Sign in to your workspace' : 'Start managing your projects'}
        </p>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: '16px', borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171', fontSize: '12px',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(14, 165, 233, 0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px 12px 42px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(14, 165, 233, 0.4)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%', padding: '12px 14px 12px 42px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(14, 165, 233, 0.4)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', marginTop: '8px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              border: 'none', borderRadius: '12px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {isLogin ? 'Sign in' : 'Create account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{
              background: 'none', border: 'none', color: 'var(--neon-blue)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginLeft: '6px',
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
