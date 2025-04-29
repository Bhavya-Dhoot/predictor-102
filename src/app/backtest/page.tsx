"use client";
import React, { useState, useMemo, useEffect } from 'react';

function fuzzyMatchIndices(indices: {label: string, symbol: string}[], query: string) {
  if (!query) return indices;
  const q = query.toLowerCase();
  return indices.filter(idx => idx.label.toLowerCase().includes(q) || idx.symbol.toLowerCase().includes(q));
}

const DEFAULT_DAYS = 30;

const BacktestPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [indices, setIndices] = useState<{label: string, symbol: string}[]>([]);
  const [symbol, setSymbol] = useState('');
  const [indexName, setIndexName] = useState('');
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [results, setResults] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIndices() {
      const res = await fetch('/indian_indices.json');
      const data = await res.json();
      setIndices(data);
      if (data.length > 0) {
        setSymbol(data[0].symbol);
        setIndexName(data[0].label);
      }
    }
    loadIndices();
  }, []);

  const filteredIndices = useMemo(() => fuzzyMatchIndices(indices, search), [indices, search]);

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setSummary(null);
    try {
      const res = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, days })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data.results);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Backtest failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-slate-100 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Sidebar Slider */}
      <aside className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 shadow-lg px-2 py-8 w-28 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-3">
          <span className="text-blue-700 dark:text-blue-400 text-xl font-bold rotate-90 mb-6 tracking-widest">Backtest Days</span>
          <input
            id="days-slider"
            type="range"
            min={2}
            max={365}
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="slider-vertical h-64 w-3 accent-blue-600"
          />
          <span className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-400 bg-white/60 dark:bg-gray-900/80 px-3 py-1 rounded shadow">{days}</span>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-2 md:px-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-8 text-blue-800 dark:text-blue-300 tracking-tight">Predictor 101</h1>
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-10 border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold mb-4 text-lg text-blue-700 dark:text-blue-400">Backtest {indexName} <span className="text-gray-500 dark:text-gray-400 text-base">(Yahoo: {symbol})</span></h2>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
              <label className="mr-2 font-medium text-gray-700 dark:text-gray-200">Search Index:</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Search by name or symbol"
              />
              <div className="relative w-64 mt-2 md:mt-0">
                <ul className="absolute z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl max-h-44 overflow-auto w-full shadow-lg">
                  {filteredIndices.map(idx => (
                    <li
                      key={idx.symbol}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-all ${idx.symbol === symbol ? 'bg-blue-50 dark:bg-blue-800 font-bold' : ''}`}
                      onClick={() => { setSymbol(idx.symbol); setIndexName(idx.label); }}
                    >
                      {idx.label} <span className="text-xs text-gray-500">({idx.symbol})</span>
                    </li>
                  ))}
                  {filteredIndices.length === 0 && <li className="px-4 py-2 text-gray-500">No matches found</li>}
                </ul>
              </div>
              <button
                className="ml-0 md:ml-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 font-semibold transition-all"
                onClick={runBacktest}
                disabled={loading}
              >
                {loading ? 'Running...' : 'Run Backtest'}
              </button>
            </div>
            {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
            {summary && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mt-4 mb-4">
                <div className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Summary</div>
                <div>Symbol: <b>{summary.symbol}</b></div>
                <div>Days: <b>{summary.days}</b></div>
                <div>MAE: <b>{summary.mae}</b></div>
                <div>MAPE: <b>{summary.mape}%</b></div>
                <div>Total Predictions: <b>{summary.total}</b></div>
              </div>
            )}
            {results && results.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-xs border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-blue-100 dark:bg-blue-900">
                      <th className="px-3 py-2 border">Date</th>
                      <th className="px-3 py-2 border">Predicted</th>
                      <th className="px-3 py-2 border">Actual</th>
                      <th className="px-3 py-2 border">Error</th>
                      <th className="px-3 py-2 border">% Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r: any, i: number) => (
                      <tr key={i} className="border-t hover:bg-blue-50 dark:hover:bg-blue-950 transition-all">
                        <td className="px-3 py-2 border">{r.date}</td>
                        <td className="px-3 py-2 border">{r.predicted.toFixed(2)}</td>
                        <td className="px-3 py-2 border">{r.actual.toFixed(2)}</td>
                        <td className="px-3 py-2 border">{r.error.toFixed(2)}</td>
                        <td className="px-3 py-2 border">{r.percentError.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BacktestPage;
