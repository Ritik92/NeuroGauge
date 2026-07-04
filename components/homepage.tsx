'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BrandMark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8.5 5v10L12 22 3.5 17V7z" />
    <path d="M7 12h3l1.5-3 2 6 1.5-3h1.5" />
  </svg>
);

const testimonials = [
  {
    quote: '“NeuroGauge changed how we understand and support students — the insight per report is remarkable.”',
    initials: 'SM',
    name: 'Dr. Sarah Mitchell',
    role: 'Principal, Edison High School',
  },
  {
    quote: '“I can pinpoint a student’s strengths and growth areas in minutes — with evidence I actually trust.”',
    initials: 'JW',
    name: 'James Wilson',
    role: 'School Counselor',
  },
  {
    quote: '“For the first time I understand how my daughter learns best. It changed how we support her at home.”',
    initials: 'LC',
    name: 'Lisa Chen',
    role: 'Parent',
  },
];

const features = [
  {
    title: 'AI-powered analysis',
    body: 'Thousands of signals distilled into one clear cognitive profile you can actually act on.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z" />
        <path d="M19 3v3" /><path d="M20.5 4.5h-3" />
      </svg>
    ),
  },
  {
    title: 'Adaptive assessments',
    body: 'Questions adjust to each student in real time, so every result is precise — never one-size-fits-all.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Reports parents understand',
    body: 'Plain-language insights and next steps — no psychology degree required.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l3-3 3 3 5-6" />
      </svg>
    ),
  },
];

const roles = [
  { title: 'Schools', body: 'See strengths and support needs across every cohort.', accent: false,
    icon: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></> },
  { title: 'Students', body: 'Discover how you learn and where you’ll thrive.', accent: false,
    icon: <><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></> },
  { title: 'Parents', body: 'Understand your child in language that makes sense.', accent: true,
    icon: <path d="M12 20.5S4 14.8 4 9.4A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 8 3.4c0 5.4-8 11.1-8 11.1z" /> },
  { title: 'Counselors', body: 'Guide course and career choices with real evidence.', accent: false,
    icon: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 5.3-5.3 2.2 2.2-5.3z" /></> },
];

const steps = [
  { n: '01', title: 'Assess', body: 'Students take a 20-minute adaptive assessment on any device.',
    icon: <><path d="M9 4h6v3H9z" /><path d="M8 5H6v16h12V5h-2" /><path d="M9 13l2 2 4-4" /></> },
  { n: '02', title: 'Analyze', body: 'Our AI builds a full cognitive, learning-style and MBTI profile.',
    icon: <path d="M3 12h4l3 8 4-16 3 8h4" /> },
  { n: '03', title: 'Guide', body: 'A shareable report lays out strengths, fits and next steps.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 5.3-5.3 2.2 2.2-5.3z" /></> },
];

export default function LandingPage() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  const wrap: React.CSSProperties = { maxWidth: 1160, margin: '0 auto', padding: '0 40px' };
  const sectionKicker = (label: string) => (
    <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--num-color)', fontWeight: 600 }}>{label}</div>
  );
  const h2: React.CSSProperties = { fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 'var(--w-head)' as any, letterSpacing: 'var(--letter-head)', color: 'var(--ink)', margin: '12px 0 0' };
  const cardBase: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 'var(--rad-card)', boxShadow: 'var(--shadow-card)' };

  return (
    <div className="ng">
      {/* ===== NAV ===== */}
      <div style={{ borderBottom: '1px solid var(--border-c)', position: 'sticky', top: 0, zIndex: 20, background: 'color-mix(in srgb, var(--canvas) 88%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div style={{ ...wrap, padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--tint)', color: 'var(--pri)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><BrandMark /></span>
            <span style={{ fontSize: 19, fontWeight: 600, fontFamily: 'var(--font-head)', letterSpacing: '-0.01em', color: 'var(--ink)' }}>NeuroGauge</span>
          </div>
          <div className="ng-nav-center">
            {['Features', 'How it works', 'For schools', 'Testimonials'].map((l) => (
              <a key={l} href="#" className="ng-link" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => router.push('/auth/signin')} style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 14, padding: '9px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Sign in</button>
            <button onClick={() => router.push('/auth/signup')} className="ng-btn-primary" style={{ background: 'var(--pri)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 'var(--rad-btn)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Register your school</button>
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div style={{ ...wrap, padding: '66px 40px 40px' }}>
        <div className="ng-hero-grid">
          <div style={{ animation: 'ng-fade-up .5s ease-out both' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--tint)', color: 'var(--pri)', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 999 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" /></svg>
              Trusted by 500+ schools
            </span>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 47, lineHeight: 1.07, fontWeight: 'var(--w-head)' as any, letterSpacing: 'var(--letter-head)', color: 'var(--ink)', margin: '20px 0 0' }}>
              See how every student <span style={{ color: 'var(--pri)' }}>really learns.</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.62, color: 'var(--muted)', margin: '20px 0 0', maxWidth: '31em' }}>
              NeuroGauge turns a 20-minute adaptive assessment into a clear, science-backed profile — cognitive strengths, learning style and the careers that fit.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/auth/signup')} className="ng-btn-primary" style={{ background: 'var(--pri)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 'var(--rad-btn)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Get started
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </button>
              <button onClick={() => router.push('/auth/signin')} className="ng-btn-soft" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--ink)', padding: '12px 20px', borderRadius: 'var(--rad-btn)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>See a sample report</button>
            </div>
          </div>

          {/* product-preview report card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ ...cardBase, boxShadow: 'var(--shadow-hover)', padding: 20, width: 380, maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-head)' }}>AM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>Aanya Mehra</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Grade 10 · Cognitive profile</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--d1)', background: 'color-mix(in srgb, var(--d1) 13%, transparent)', padding: '4px 9px', borderRadius: 999 }}>Ready</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                <svg width="220" height="205" viewBox="0 0 220 205">
                  <polygon points="110,27 184.2,80.9 155.9,168.1 64.1,168.1 35.8,80.9" fill="none" stroke="var(--border-c)" strokeWidth="1" />
                  <polygon points="110,53.5 159,89.1 140.3,146.7 79.7,146.7 61,89.1" fill="none" stroke="var(--border-c)" strokeWidth="1" />
                  <polygon points="110,79.3 134.4,97.1 125.1,125.8 94.9,125.8 85.6,97.1" fill="none" stroke="var(--border-c)" strokeWidth="1" />
                  <line x1="110" y1="105" x2="110" y2="27" stroke="var(--border-c)" />
                  <line x1="110" y1="105" x2="184.2" y2="80.9" stroke="var(--border-c)" />
                  <line x1="110" y1="105" x2="155.9" y2="168.1" stroke="var(--border-c)" />
                  <line x1="110" y1="105" x2="64.1" y2="168.1" stroke="var(--border-c)" />
                  <line x1="110" y1="105" x2="35.8" y2="80.9" stroke="var(--border-c)" />
                  <polygon points="110,33.2 160.4,88.6 149,158.6 82.5,142.9 52.2,86.2" fill="var(--pri)" fillOpacity="0.15" stroke="var(--pri)" strokeWidth="2" strokeLinejoin="round" />
                  {[[110, 33.2], [160.4, 88.6], [149, 158.6], [82.5, 142.9], [52.2, 86.2]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3" fill="var(--pri)" />)}
                  <text x="110" y="18" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Logic</text>
                  <text x="192" y="82" textAnchor="start" fontSize="10.5" fill="var(--muted)">Verbal</text>
                  <text x="156" y="185" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Spatial</text>
                  <text x="64" y="185" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Memory</text>
                  <text x="28" y="82" textAnchor="end" fontSize="10.5" fill="var(--muted)">Focus</text>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[['Visual', 82, 'var(--d1)'], ['Auditory', 64, 'var(--d5)'], ['Kinesthetic', 48, 'var(--d2)']].map(([label, val, color]) => (
                  <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 78, fontSize: 12, color: 'var(--muted)' }}>{label}</span>
                    <div style={{ flex: 1, height: 7, borderRadius: 999, background: 'var(--border-c)', overflow: 'hidden' }}><div style={{ width: `${val}%`, height: '100%', background: color as string, borderRadius: 999 }} /></div>
                    <span style={{ width: 26, textAlign: 'right', fontSize: 11.5, color: 'var(--muted)' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Best-fit careers</div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {['UX Design', 'Data Science', 'Psychology'].map((c) => (
                    <span key={c} style={{ background: 'var(--tint)', color: 'var(--pri)', fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 999 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{ ...wrap, padding: '8px 40px 44px' }}>
        <div className="ng-grid-4">
          {[['500+', 'Schools enrolled'], ['100k+', 'Students assessed'], ['95%', 'Counselor satisfaction'], ['30%', 'Better course-fit']].map(([n, l]) => (
            <div key={l} style={{ ...cardBase, padding: 20 }}>
              <div style={{ fontSize: 29, fontWeight: 600, fontFamily: 'var(--font-head)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>{n}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{ ...wrap, padding: '60px 40px' }}>
        {sectionKicker('01 · Features')}
        <h2 style={{ ...h2, maxWidth: '16em' }}>Rigorous science, made genuinely readable.</h2>
        <div className="ng-grid-3" style={{ marginTop: 36 }}>
          {features.map((f) => (
            <div key={f.title} className="ng-lift" style={{ ...cardBase, padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '16px 0 0' }}>{f.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', margin: '8px 0 0' }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BUILT FOR EVERYONE ===== */}
      <div style={{ background: 'var(--tint)' }}>
        <div style={{ ...wrap, padding: '60px 40px' }}>
          {sectionKicker('02 · Built for everyone')}
          <h2 style={h2}>One assessment, four points of view.</h2>
          <div className="ng-grid-4" style={{ marginTop: 32 }}>
            {roles.map((r) => (
              <div key={r.title} style={{ ...cardBase, padding: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: r.accent ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--tint)', color: r.accent ? 'var(--accent)' : 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{r.icon}</svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '14px 0 0' }}>{r.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)', margin: '6px 0 0' }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div style={{ ...wrap, padding: '60px 40px' }}>
        {sectionKicker('03 · How it works')}
        <h2 style={h2}>From assessment to guidance in three steps.</h2>
        <div className="ng-grid-3" style={{ marginTop: 36, gap: 24 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ borderTop: '2px solid var(--pri)', paddingTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 34, fontWeight: 'var(--w-head)' as any, color: 'var(--pri)', letterSpacing: '-0.02em' }}>{s.n}</span>
                <span style={{ color: 'var(--muted)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg></span>
              </div>
              <h3 style={{ margin: '14px 0 0', fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6, margin: '6px 0 0' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TESTIMONIAL ===== */}
      <div style={{ borderTop: '1px solid var(--border-c)', borderBottom: '1px solid var(--border-c)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '66px 40px', textAlign: 'center' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--accent)', margin: '0 auto 14px' }} />
          {sectionKicker('What educators say')}
          <div style={{ minHeight: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <blockquote style={{ margin: 0 }}>
              <p style={{ fontFamily: 'var(--font-head)', fontSize: 24, lineHeight: 1.4, fontWeight: 'var(--w-head)' as any, color: 'var(--ink)', letterSpacing: 'var(--letter-head)', margin: 0 }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{t.initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.role}</div>
                </div>
              </div>
            </blockquote>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {testimonials.map((_, i) => (
              <button key={i} aria-label={`Testimonial ${i + 1}`} onClick={() => setActive(i)} style={{ height: 8, width: active === i ? 24 : 8, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', background: active === i ? 'var(--pri)' : 'var(--border-c)', transition: 'all .2s ease' }} />
            ))}
          </div>
        </div>
      </div>

      {/* ===== CLOSING CTA ===== */}
      <div style={{ ...wrap, padding: '64px 40px' }}>
        <div style={{ background: 'var(--pri)', borderRadius: 'calc(var(--rad-card) + 6px)', padding: '56px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 'var(--w-head)' as any, letterSpacing: 'var(--letter-head)', color: '#fff', margin: 0 }}>Ready to understand every learner?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.85)', margin: '12px auto 0', maxWidth: '34em' }}>Join 500+ schools using NeuroGauge to turn assessments into guidance students actually feel.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth/signup')} style={{ background: '#fff', color: 'var(--pri)', border: 'none', padding: '12px 22px', borderRadius: 'var(--rad-btn)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Register your school</button>
            <button onClick={() => router.push('/auth/signin')} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.45)', padding: '12px 22px', borderRadius: 'var(--rad-btn)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>See a sample report</button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ borderTop: '1px solid var(--border-c)' }}>
        <div className="ng-foot-grid" style={{ ...wrap, padding: '48px 40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--tint)', color: 'var(--pri)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><BrandMark size={18} /></span>
              <span style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>NeuroGauge</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', margin: '14px 0 0', maxWidth: '26em' }}>Understand how every learner thinks, learns and grows.</p>
          </div>
          {[['Product', ['Features', 'Pricing', 'Sample report', 'Security']], ['Company', ['About', 'Blog', 'Careers', 'Contact']], ['Legal', ['Privacy', 'Terms', 'Cookie policy']]].map(([title, links]) => (
            <div key={title as string}>
              <div style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 600, marginBottom: 14 }}>{title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {(links as string[]).map((l) => <a key={l} href="#" className="ng-link" style={{ fontSize: 13.5, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border-c)' }}>
          <div style={{ ...wrap, padding: '18px 40px', fontSize: 12.5, color: 'var(--muted)' }}>© 2026 NeuroGauge. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
