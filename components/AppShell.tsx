'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

type Role = 'STUDENT' | 'PARENT' | 'SCHOOL_ADMIN' | 'SYSTEM_ADMIN';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const icons = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
  building: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></>,
  userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  clip: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" /></>,
};

const brandGlyph = <><path d="M12 2l8.5 5v10L12 22 3.5 17V7z" /><path d="M7 12h3l1.5-3 2 6 1.5-3h1.5" /></>;

const portals: Record<Role, string> = { STUDENT: 'Student portal', PARENT: 'Parent portal', SCHOOL_ADMIN: 'School admin', SYSTEM_ADMIN: 'System admin' };

function navFor(role: Role, schoolId?: string): { label: string; href: string; icon: React.ReactNode }[] {
  switch (role) {
    case 'STUDENT':
      return [
        { label: 'Dashboard', href: '/dashboard/student', icon: icons.grid },
        { label: 'Assignments', href: '/dashboard/student/assignments', icon: icons.book },
        { label: 'Reports', href: '/dashboard/student/reports', icon: icons.file },
      ];
    case 'PARENT':
      return [
        { label: 'Dashboard', href: '/dashboard/parent', icon: icons.grid },
        { label: 'Reports', href: '/dashboard/parent/reports', icon: icons.file },
      ];
    case 'SCHOOL_ADMIN':
      return [
        { label: 'Home', href: '/dashboard/school', icon: icons.grid },
        { label: 'Add Students', href: '/dashboard/school/addstudents', icon: icons.userPlus },
        ...(schoolId ? [{ label: 'Reports', href: `/dashboard/school/${schoolId}/reports`, icon: icons.file }] : []),
        { label: 'Student List', href: '/dashboard/school/studentlist', icon: icons.list },
      ];
    case 'SYSTEM_ADMIN':
      return [
        { label: 'Dashboard', href: '/dashboard/admin', icon: icons.grid },
        { label: 'Schools', href: '/dashboard/admin/schools', icon: icons.building },
        { label: 'Assessments', href: '/dashboard/admin/assessments', icon: icons.clip },
        { label: 'Reports', href: '/dashboard/admin/schoolReports', icon: icons.file },
      ];
  }
}

function initialsOf(name: string) {
  return name.split(/[\s@.]+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export default function AppShell({
  role,
  children,
  schoolId,
  userName: userNameProp,
}: {
  role: Role;
  children: React.ReactNode;
  schoolId?: string;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const items = navFor(role, schoolId);
  // active = the item whose href is the longest prefix of the current path
  let activeHref = '';
  for (const it of items) {
    if (pathname === it.href || pathname.startsWith(it.href + '/')) {
      if (it.href.length > activeHref.length) activeHref = it.href;
    }
  }
  const activeItem = items.find((i) => i.href === activeHref) ?? items[0];

  const userName = userNameProp || (session?.user as any)?.name || session?.user?.email || 'User';
  const initials = initialsOf(userName);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const rowStyle = (on: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
    background: on ? 'var(--tint)' : 'transparent', color: on ? 'var(--pri)' : 'var(--muted)',
    fontWeight: on ? 600 : 500, fontSize: 14, border: 'none', width: '100%', fontFamily: 'inherit',
    transition: 'all .15s ease', boxSizing: 'border-box', textDecoration: 'none',
  });

  return (
    <div className="ng" style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 250, flex: '0 0 auto', background: 'var(--surface)', borderRight: '1px solid var(--border-c)', display: 'flex', flexDirection: 'column', padding: '22px 16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 8px' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--tint)', color: 'var(--pri)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ico>{brandGlyph}</Ico></span>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>NeuroGauge</span>
        </div>

        <div style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, margin: '22px 8px 8px' }}>{portals[role]}</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((it) => (
            <Link key={it.href} href={it.href} style={rowStyle(it.href === activeItem.href)}>
              <span style={{ width: 20, height: 20, flex: '0 0 auto', display: 'inline-flex' }}><Ico>{it.icon}</Ico></span>
              <span>{it.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderTop: '1px solid var(--border-c)', paddingTop: 14 }}>
          <div style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: 10, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{portals[role]}</div>
          </div>
          <button onClick={handleLogout} title="Log out" className="ng-btn-soft" style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico size={17}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></Ico>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, background: 'var(--canvas)', padding: '32px 36px' }}>
        {children}
      </main>
    </div>
  );
}
