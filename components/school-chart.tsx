// components/school-chart.tsx
'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function SchoolDistributionChart() {
  const [data, setData] = useState<{ state: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/schools-by-state');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching school data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };

  return (
    <div style={card}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 14px' }}>School Distribution by State</h2>
      <div style={{ height: 256 }}>
        {loading ? (
          <div style={{ width: '100%', height: '100%', borderRadius: 12, background: 'var(--canvas)' }} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false} />
              <XAxis dataKey="state" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border-c)' }} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'color-mix(in srgb, #0E9384 8%, transparent)' }}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 10, fontSize: 13, color: 'var(--ink)' }}
                labelStyle={{ color: 'var(--muted)' }}
              />
              <Bar dataKey="count" fill="#0E9384" radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
