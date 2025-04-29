"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';

function fuzzyMatchIndices(indices: {label: string, symbol: string}[], query: string) {
  if (!query) return indices;
  const q = query.toLowerCase();
  return indices.filter(idx => idx.label.toLowerCase().includes(q) || idx.symbol.toLowerCase().includes(q));
}

const DEFAULT_DAYS = 30;

const BacktestPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [indices, setIndices] = useState<{label: string, symbol: string}[]>([]);
  const [indicesLoading, setIndicesLoading] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [indexName, setIndexName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [results, setResults] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    async function loadIndices() {
      setIndicesLoading(true);
      const res = await fetch('/indian_indices.json');
      const data = await res.json();
      setIndices(data);
      if (data.length > 0) {
        setSymbol(data[0].symbol);
        setIndexName(data[0].label);
      }
      setIndicesLoading(false);
    }
    loadIndices();
  }, []);

  const filteredIndices = useMemo(() => fuzzyMatchIndices(indices, search), [indices, search]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!showDropdown) return;
      if (e.key === 'ArrowDown') {
        setHighlightedIdx(idx => Math.min(idx + 1, filteredIndices.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setHighlightedIdx(idx => Math.max(idx - 1, 0));
        e.preventDefault();
      } else if (e.key === 'Enter' && highlightedIdx >= 0 && highlightedIdx < filteredIndices.length) {
        handleSelect(filteredIndices[highlightedIdx]);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        e.preventDefault();
      }
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, filteredIndices, highlightedIdx]);

  const handleSelect = (idx: {label: string, symbol: string}) => {
    setSymbol(idx.symbol);
    setIndexName(idx.label);
    setShowDropdown(false);
    setSearch('');
    setHighlightedIdx(-1);
  };

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
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-2 md:px-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-8 text-blue-800 dark:text-blue-300 tracking-tight">Predictor 101</h1>
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-10 border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold mb-4 text-lg text-blue-700 dark:text-blue-400">Backtest {indexName} <span className="text-gray-500 dark:text-gray-400 text-base">(Yahoo: {symbol})</span></h2>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Index Search Dropdown */}
                <div className="w-full max-w-xs relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true); setHighlightedIdx(0); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search index..."
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 shadow"
                    disabled={indicesLoading}
                    aria-haspopup="listbox"
                    aria-expanded={showDropdown}
                    role="combobox"
                    aria-controls="index-listbox"
                  />
                  {showDropdown && (
                    <ul
                      ref={dropdownRef}
                      id="index-listbox"
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl max-h-60 overflow-auto shadow-lg transition-all"
                    >
                      {indicesLoading ? (
                        <li className="px-4 py-2 text-gray-500">Loading...</li>
                      ) : filteredIndices.length === 0 ? (
                        <li className="px-4 py-2 text-gray-500">No matches found</li>
                      ) : filteredIndices.map((idx, i) => (
                        <li
                          key={idx.symbol}
                          role="option"
                          aria-selected={symbol === idx.symbol}
                          className={`px-4 py-2 cursor-pointer transition-all
                            ${i === highlightedIdx ? 'bg-blue-200 dark:bg-blue-800' : ''}
                            ${idx.symbol === symbol ? 'bg-blue-50 dark:bg-blue-900 font-bold' : ''}
                            hover:bg-blue-100 dark:hover:bg-blue-900`}
                          onMouseEnter={() => setHighlightedIdx(i)}
                          onClick={() => handleSelect(idx)}
                        >
                          {idx.label} <span className="text-xs text-gray-500">({idx.symbol})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Days Input */}
                <div className="flex flex-col items-start w-40">
                  <label htmlFor="days-input" className="mb-1 font-medium text-gray-700 dark:text-gray-200">Days to Backtest</label>
                  <input
                    id="days-input"
                    type="number"
                    min={2}
                    max={365}
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 shadow"
                  />
                </div>
                <button
                  className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 font-semibold transition-all self-end md:self-center"
                  onClick={runBacktest}
                  disabled={loading}
                >
                  {loading ? 'Running...' : 'Run Backtest'}
                </button>
              </div>
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
