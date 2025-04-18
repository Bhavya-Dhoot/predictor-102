"use client";
import React, { useEffect, useState } from 'react';
import MarketChart, { ChartData } from '@/components/MarketChart';
import ActivityLog, { ActivityLogEntry } from '@/components/ActivityLog';
import { MAJOR_INDIAN_INDEXES } from '@/components/IndexDropdown';

const DashboardPage: React.FC = () => {
  const [charts, setCharts] = useState<Record<string, ChartData[]>>({});
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Helper to add to activity log
  const log = (action: string, details?: string) => {
    setActivityLog(prev => [
      { timestamp: new Date().toISOString(), action, details },
      ...prev,
    ]);
  };

  useEffect(() => {
    MAJOR_INDIAN_INDEXES.forEach(async idx => {
      log('Fetching chart data', idx.symbol);
      try {
        const histRes = await fetch(`/api/market/history?symbol=${encodeURIComponent(idx.symbol)}&range=6mo`);
        if (!histRes.ok) throw new Error('Failed to fetch historical data');
        const hist = await histRes.json();
        if (hist.s === 'ok' && Array.isArray(hist.t)) {
          const chartArr: ChartData[] = hist.t.map((t: number, i: number) => ({
            date: new Date(t * 1000).toLocaleDateString(),
            close: hist.c[i],
          }));
          setCharts(prev => ({ ...prev, [idx.symbol]: chartArr }));
          log('Chart data loaded', `${idx.label}: ${chartArr.length} points`);
        } else {
          setCharts(prev => ({ ...prev, [idx.symbol]: [] }));
          log('No chart data', idx.label);
        }
      } catch (err: any) {
        setError(err.message);
        setCharts(prev => ({ ...prev, [idx.symbol]: [] }));
        log('Error fetching chart data', `${idx.label}: ${err.message}`);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-6 px-2 md:py-8 md:px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Dashboard - Indian Indices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
        {MAJOR_INDIAN_INDEXES.map(idx => (
          <section key={idx.symbol} className="mb-6 md:mb-8 bg-white dark:bg-gray-900 rounded shadow p-3 md:p-4">
            <h2 className="font-semibold mb-2 text-center">{idx.label} ({idx.symbol})</h2>
            <MarketChart data={charts[idx.symbol] || []} />
          </section>
        ))}
      </div>
      <ActivityLog log={activityLog} />
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </main>
  );
};

export default DashboardPage;
