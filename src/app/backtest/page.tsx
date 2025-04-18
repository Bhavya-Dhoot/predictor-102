"use client";
import React, { useState } from 'react';

const DEFAULT_SYMBOL = '^NSEI'; // Nifty 50 on Yahoo Finance
const DEFAULT_INDEX_NAME = 'Nifty 50';

const BacktestPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const historyRes = await fetch(`/api/market/history?symbol=${encodeURIComponent(DEFAULT_SYMBOL)}&range=1y`);
      const history = historyRes.ok ? await historyRes.json() : null;
      if (!history || !history.t || history.t.length < days) throw new Error('Not enough data for backtest.');
      // Simple backtest: compare close price n days ago to today
      const startClose = history.c[history.c.length - days];
      const endClose = history.c[history.c.length - 1];
      setResults({ startClose, endClose, change: endClose - startClose, percent: ((endClose - startClose) / startClose) * 100 });
    } catch (err: any) {
      setError(err.message || 'Backtest failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Predictor 101</h1>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Backtest {DEFAULT_INDEX_NAME} (NSE: ^NSEI)</h2>
        <div className="mb-4">
          <label className="mr-2">Days to backtest:</label>
          <input
            type="number"
            value={days}
            min={2}
            max={365}
            onChange={e => setDays(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
          <button
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={runBacktest}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Backtest'}
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {results && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-4 mt-4">
            <div>Start Close ({days} days ago): <b>{results.startClose}</b></div>
            <div>End Close (Today): <b>{results.endClose}</b></div>
            <div>Change: <b>{results.change.toFixed(2)}</b></div>
            <div>Percent Change: <b>{results.percent.toFixed(2)}%</b></div>
          </div>
        )}
      </section>
    </main>
  );
};

export default BacktestPage;
