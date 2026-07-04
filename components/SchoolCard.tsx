'use client'
import React from 'react';
import { Building, Calendar, Flag, Phone, Users } from 'lucide-react';

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;

export function SchoolCard({ school }: { school: any }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <span style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
            <Building size={24} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0 }}>{school.name}</h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '4px 0 0' }}>{school.address}</p>
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--pri)', background: 'var(--tint)', padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
          {school.city}, {school.country}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 22 }}>
        <InfoItem
          icon={<Users size={16} />}
          label="Administrator"
          value={`${school.adminFirstName} ${school.adminLastName}`}
        />
        <InfoItem
          icon={<Phone size={16} />}
          label="Contact"
          value={school.phone}
        />
        <InfoItem
          icon={<Flag size={16} />}
          label="Established"
          value={new Date(school.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        />
        <InfoItem
          icon={<Calendar size={16} />}
          label="Last Updated"
          value={new Date(school.updatedAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 12.5 }}>
        <span style={{ color: 'var(--pri)', display: 'flex' }}>{icon}</span>
        <span>{label}</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '6px 0 0', paddingLeft: 24 }}>{value}</p>
    </div>
  );
}

export function StatsCard({ studentsCount, reportsCount, phone, established }: {
  studentsCount: number;
  reportsCount: number;
  phone: string;
  established: Date;
}) {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <StatItem label="Total Students" value={studentsCount} color="#0E9384" icon={<Users size={20} />} />
      <StatItem label="Reports Generated" value={reportsCount} color="#F1785F" icon={<Flag size={20} />} />
      <div style={{ height: 1, background: 'var(--border-c)' }} />
      <InfoRow
        icon={<Phone size={16} />}
        label="Contact Number"
        value={phone}
      />
      <InfoRow
        icon={<Calendar size={16} />}
        label="Established"
        value={established.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })}
      />
    </div>
  );
}

function StatItem({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 40, height: 40, borderRadius: 11, background: tint(color), color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{icon}</span>
      <div>
        <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ color: 'var(--pri)', display: 'flex' }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{value}</div>
      </div>
    </div>
  );
}
