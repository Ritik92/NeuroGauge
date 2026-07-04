'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

type Mode = 'signin' | 'signup';
type Role = 'STUDENT' | 'PARENT' | 'SCHOOL_ADMIN';

const BrandMark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8.5 5v10L12 22 3.5 17V7z" />
    <path d="M7 12h3l1.5-3 2 6 1.5-3h1.5" />
  </svg>
);

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px',
  background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 'var(--rad-btn)',
  fontSize: 14.5, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 };

const roleLabels: Record<Role, string> = { STUDENT: 'Student', PARENT: 'Parent', SCHOOL_ADMIN: 'School' };
const roleIcons: Record<Role, React.ReactNode> = {
  STUDENT: <><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></>,
  PARENT: <><path d="M16 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><circle cx="9" cy="8" r="3" /><path d="M20 20v-1a4 4 0 0 0-3-3.85" /><path d="M15 5.15A3 3 0 0 1 15 11" /></>,
  SCHOOL_ADMIN: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></>,
};

export default function AuthCard({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<Role>('STUDENT');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', dateOfBirth: '', grade: '',
    phone: '', name: '', address: '', city: '', state: '', country: '',
    schoolId: '', studentEmail: '',
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const res = await fetch('/api/schools');
      if (!res.ok) throw new Error('Failed to fetch schools');
      return res.json();
    },
    enabled: mode === 'signup',
  });

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }
      if (result?.ok) {
        toast.success('Signed in!');
        router.push('/auth');
        router.refresh();
      }
    } catch {
      toast.error('An error occurred during sign in');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const signupData = {
      email: form.email, password: form.password, role,
      firstName: form.firstName, lastName: form.lastName,
      ...(role === 'STUDENT' && { dateOfBirth: form.dateOfBirth, grade: parseInt(form.grade), schoolId: form.schoolId }),
      ...(role === 'PARENT' && { phone: form.phone, studentEmail: form.studentEmail }),
      ...(role === 'SCHOOL_ADMIN' && { name: form.name, address: form.address, city: form.city, state: form.state, country: form.country, phone: form.phone }),
    };
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      await signIn('credentials', { email: signupData.email, password: signupData.password, redirect: false });
      router.push('/auth');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const seg = (on: boolean): React.CSSProperties => ({
    flex: 1, textAlign: 'center', padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
    fontSize: 14, fontFamily: 'inherit', fontWeight: on ? 600 : 500, color: on ? 'var(--ink)' : 'var(--muted)',
    background: on ? 'var(--surface)' : 'transparent', boxShadow: on ? '0 1px 2px rgba(0,0,0,.08)' : 'none', transition: 'all .18s ease',
  });
  const roleBtn = (on: boolean): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flex: 1, padding: '14px 8px', borderRadius: 11, cursor: 'pointer',
    border: on ? '1.5px solid var(--pri)' : '1px solid var(--border-c)',
    background: on ? 'color-mix(in srgb, var(--pri) 8%, transparent)' : 'var(--surface)',
    color: on ? 'var(--pri)' : 'var(--muted)', transition: 'all .18s ease', fontFamily: 'inherit',
  });
  const submitBtn: React.CSSProperties = {
    width: '100%', height: 48, background: 'var(--pri)', color: '#fff', border: 'none', borderRadius: 'var(--rad-btn)',
    fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };

  return (
    <div className="ng" style={{ minHeight: '100dvh', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Toaster position="top-center" />
      <div style={{ width: 1120, maxWidth: '100%', height: 'min(680px, calc(100dvh - 32px))', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 90px -50px rgba(0,0,0,.45)', border: '1px solid var(--border-c)', background: 'var(--surface)', display: 'flex' }} className="ng-auth-split">

        {/* LEFT brand panel */}
        <div className="ng-auth-brand" style={{ background: 'var(--pri)', color: '#fff', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'absolute', bottom: -120, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><BrandMark /></span>
            <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>NeuroGauge</span>
          </div>
          <div style={{ position: 'relative' }}>
            <h1 style={{ fontSize: 30, lineHeight: 1.14, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Understand how every learner thinks.</h1>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.82)', margin: '14px 0 0', maxWidth: '24em' }}>Science-backed assessments that turn 20 minutes into a clear, shareable profile.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 22 }}>
              {['Cognitive, learning-style & MBTI profile', 'Reports parents actually understand', 'Trusted by 500+ schools'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check /></span>
                  <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,.92)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,.16)', paddingTop: 16 }}>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,.9)', fontStyle: 'italic', margin: 0 }}>&quot;The insight per report is remarkable.&quot;</p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)', margin: '8px 0 0' }}>Dr. Sarah Mitchell · Principal, Edison High</p>
          </div>
        </div>

        {/* RIGHT form panel */}
        <div style={{ flex: 1, minHeight: 0, padding: '44px 56px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* mode tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--tint)', padding: 4, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}>
            <button style={seg(mode === 'signin')} onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
            <button style={seg(mode === 'signup')} onClick={() => { setMode('signup'); setError(''); }}>Create account</button>
          </div>

          {/* ===== SIGN IN ===== */}
          {mode === 'signin' && (
            <form onSubmit={handleSignin} style={{ marginTop: 34 }}>
              <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Welcome back</h2>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '8px 0 0' }}>Sign in to continue to your dashboard.</p>

              <div style={{ marginTop: 28 }}>
                <label style={labelStyle}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                  </span>
                  <input className="ng-input" required type="email" placeholder="you@school.edu" value={form.email} onChange={(e) => set('email', e.target.value)} style={{ ...inputStyle, height: 46, padding: '0 14px 0 42px' }} />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <a href="#" className="ng-link" style={{ fontSize: 13, color: 'var(--pri)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  </span>
                  <input className="ng-input" required type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={(e) => set('password', e.target.value)} style={{ ...inputStyle, height: 46, padding: '0 44px 0 42px' }} />
                  <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                    {showPw
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a13.2 13.2 0 0 1-1.67 2.68" /><path d="M6.6 6.6A13.2 13.2 0 0 0 2 12s3 8 10 8a9.1 9.1 0 0 0 5.4-1.6" /><path d="m2 2 20 20" /></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="ng-btn-primary" style={{ ...submitBtn, marginTop: 26, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>}
              </button>
            </form>
          )}

          {/* ===== SIGN UP ===== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} style={{ marginTop: 30 }}>
              <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Create your account</h2>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '8px 0 0' }}>Tell us who you are — the form adapts to your role.</p>

              <label style={{ ...labelStyle, margin: '24px 0 8px' }}>I am a</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['STUDENT', 'PARENT', 'SCHOOL_ADMIN'] as Role[]).map((r) => (
                  <button key={r} type="button" style={roleBtn(role === r)} onClick={() => setRole(r)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{roleIcons[r]}</svg>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r === 'SCHOOL_ADMIN' ? 'School Admin' : roleLabels[r]}</span>
                  </button>
                ))}
              </div>

              {/* base fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input className="ng-input" required placeholder="Aanya" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input className="ng-input" required placeholder="Mehra" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Email</label>
                <input className="ng-input" required type="email" placeholder="you@school.edu" value={form.email} onChange={(e) => set('email', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input className="ng-input" required type="password" placeholder="••••••••" value={form.password} onChange={(e) => set('password', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm</label>
                  <input className="ng-input" required type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* role-specific */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-c)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{roleLabels[role]} details</span>
                </div>

                {role === 'STUDENT' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Date of birth</label>
                        <input className="ng-input" required type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} style={{ ...inputStyle, color: form.dateOfBirth ? 'var(--ink)' : 'var(--muted)' }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Grade</label>
                        <input className="ng-input" required type="number" placeholder="10" value={form.grade} onChange={(e) => set('grade', e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <label style={labelStyle}>School</label>
                      <select className="ng-input" required value={form.schoolId} onChange={(e) => set('schoolId', e.target.value)} style={{ ...inputStyle, color: form.schoolId ? 'var(--ink)' : 'var(--muted)', appearance: 'none', cursor: 'pointer' }}>
                        <option value="" disabled>Select your school</option>
                        {schools?.slice().sort((a: any, b: any) => a.name.localeCompare(b.name)).map((s: any) => (
                          <option key={s.id} value={s.id} style={{ color: 'var(--ink)' }}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {role === 'PARENT' && (
                  <div>
                    <div>
                      <label style={labelStyle}>Phone number</label>
                      <input className="ng-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <label style={labelStyle}>Your child&apos;s email</label>
                      <input className="ng-input" required type="email" placeholder="child@school.edu" value={form.studentEmail} onChange={(e) => set('studentEmail', e.target.value)} style={inputStyle} />
                      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '7px 0 0' }}>We&apos;ll link your account to your child&apos;s report.</p>
                    </div>
                  </div>
                )}

                {role === 'SCHOOL_ADMIN' && (
                  <div>
                    <div><label style={labelStyle}>School name</label><input className="ng-input" required placeholder="Edison High School" value={form.name} onChange={(e) => set('name', e.target.value)} style={inputStyle} /></div>
                    <div style={{ marginTop: 14 }}><label style={labelStyle}>Address</label><input className="ng-input" required placeholder="123 Learning Ave" value={form.address} onChange={(e) => set('address', e.target.value)} style={inputStyle} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                      <div><label style={labelStyle}>City</label><input className="ng-input" required placeholder="Mumbai" value={form.city} onChange={(e) => set('city', e.target.value)} style={inputStyle} /></div>
                      <div><label style={labelStyle}>State</label><input className="ng-input" required placeholder="Maharashtra" value={form.state} onChange={(e) => set('state', e.target.value)} style={inputStyle} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                      <div><label style={labelStyle}>Country</label><input className="ng-input" required placeholder="India" value={form.country} onChange={(e) => set('country', e.target.value)} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Phone</label><input className="ng-input" required type="tel" placeholder="+91 22 1234 5678" value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inputStyle} /></div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 'var(--rad-btn)', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)', color: '#b23c28', fontSize: 13.5 }}>{error}</div>
              )}

              <button type="submit" disabled={loading} className="ng-btn-primary" style={{ ...submitBtn, marginTop: 24, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>}
              </button>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', margin: '14px 0 0' }}>By creating an account you agree to our Terms &amp; Privacy Policy.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
