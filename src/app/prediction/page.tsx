"use client";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import MarketChart, { ChartData } from '@/components/MarketChart';
import PredictionCard from '@/components/PredictionCard';
import AccuracyChart, { AccuracyData } from '@/components/AccuracyChart';
import PredictionSummaryBar, { PredictionSummary } from '@/components/PredictionSummaryBar';

function fuzzyMatchIndices(indices: {label: string, symbol: string}[], query: string) {
  if (!query) return indices;
  const q = query.toLowerCase();
  return indices.filter(idx => idx.label.toLowerCase().includes(q) || idx.symbol.toLowerCase().includes(q));
}

const DEFAULT_SYMBOL = '^NSEI'; // Nifty 50 on Yahoo Finance
const DEFAULT_INDEX_NAME = 'Nifty 50';

function extractPredictionSummary(prediction: string): PredictionSummary | null {
  // Try to extract the first JSON block from the model's response
  const match = prediction.match(/\{[\s\S]*?\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    return obj;
  } catch {
    return null;
  }
}

type IndexOption = { label: string; symbol: string };

const PredictionPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [search, setSearch] = useState('');
  const [indexName, setIndexName] = useState<string>(DEFAULT_INDEX_NAME);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);
  const [indices, setIndices] = useState<IndexOption[]>([]);
  const [indicesLoading, setIndicesLoading] = useState(true);
  const [market, setMarket] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [prediction, setPrediction] = useState('');
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    async function loadIndices() {
      setIndicesLoading(true);
      const res = await fetch('/indian_indices.json');
      const data = await res.json();
      setIndices(data);
      setIndicesLoading(false);
    }
    loadIndices();
  }, []);

  const filteredIndices = useMemo(() => fuzzyMatchIndices(indices, search), [indices, search]);

  const summary = extractPredictionSummary(prediction);

  useEffect(() => {
    const fetchMarketAndHistory = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/market?symbol=${encodeURIComponent(symbol)}`);
        if (!res.ok) throw new Error('Failed to fetch market data');
        const data = await res.json();
        setMarket(data);
        const histRes = await fetch(`/api/market/history?symbol=${encodeURIComponent(symbol)}&range=6mo`);
        if (!histRes.ok) throw new Error('Failed to fetch historical data');
        const hist = await histRes.json();
        if (hist.s === 'ok' && Array.isArray(hist.t)) {
          const chartArr: ChartData[] = hist.t.map((t: number, i: number) => ({
            date: new Date(t * 1000).toLocaleDateString(),
            close: hist.c[i],
          }));
          setChartData(chartArr);
        } else {
          setChartData([]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchMarketAndHistory();
  }, [symbol]);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!market) return;
      setLoading(true);
      setError(null);
      setApiError(null);
      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, historical: [], current: market }),
        });
        if (!res.ok) {
          const data = await res.json();
          setApiError(data.error || 'Prediction API error');
          throw new Error(data.error || 'Prediction API error');
        }
        const data = await res.json();
        setPrediction(data.result);
        setAccuracyData([
          { date: 'Mon', accuracy: 85 },
          { date: 'Tue', accuracy: 88 },
          { date: 'Wed', accuracy: 90 },
          { date: 'Thu', accuracy: 92 },
          { date: 'Fri', accuracy: 91 },
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [market, symbol]);

  useEffect(() => {
    const idx = indices.find((idx: IndexOption) => idx.symbol === symbol);
    setIndexName(idx ? idx.label : symbol);
  }, [symbol, indices]);

  // Keyboard navigation and click outside
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

  // Handler for dropdown selection
  const handleSelect = (idx: IndexOption) => {
    setSymbol(idx.symbol);
    setIndexName(idx.label);
    setShowDropdown(false);
    setSearch('');
    setHighlightedIdx(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-slate-100 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <main className="w-full max-w-3xl mx-auto py-6 px-2 md:py-8 md:px-4">
        {summary && <PredictionSummaryBar summary={summary} />}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-800 dark:text-blue-300 tracking-tight text-center md:text-left">Prediction - {indexName}</h1>
        {/* Index Selector */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center relative z-20">
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
                ) : filteredIndices.map((idx: IndexOption, i: number) => (
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
        </div>
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-10 border border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Historical Chart</h2>
            <MarketChart data={chartData} />
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Today's Prediction</h2>
            <PredictionCard prediction={prediction} loading={loading} error={error || undefined} />
            {apiError && (
              <div className="bg-red-100 dark:bg-red-900 rounded p-4 mt-4 text-red-800 dark:text-red-200">
                <b>Prediction API Error:</b> {apiError}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Historical Accuracy</h2>
            <AccuracyChart data={accuracyData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PredictionPage;
