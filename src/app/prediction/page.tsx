"use client";
import React, { useEffect, useState } from 'react';
import MarketChart, { ChartData } from '@/components/MarketChart';
import PredictionCard from '@/components/PredictionCard';
import AccuracyChart, { AccuracyData } from '@/components/AccuracyChart';
import PredictionSummaryBar, { PredictionSummary } from '@/components/PredictionSummaryBar';
import IndexDropdown, { MAJOR_INDIAN_INDEXES } from '@/components/IndexDropdown';

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

const PredictionPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [market, setMarket] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [prediction, setPrediction] = useState('');
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const summary = extractPredictionSummary(prediction);

  useEffect(() => {
    const fetchMarketAndHistory = async () => {
      try {
        setError(null);
        // Fetch latest quote for prediction
        const res = await fetch(`/api/market?symbol=${encodeURIComponent(symbol)}`);
        if (!res.ok) throw new Error('Failed to fetch market data');
        const data = await res.json();
        setMarket(data);
        // Fetch historical data for chart
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
        // Simulate accuracy data (for demo)
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

  // Get the display name of the selected index
  const selectedIndex = MAJOR_INDIAN_INDEXES.find(idx => idx.symbol === symbol);

  return (
    <div className="flex flex-col md:flex-row">
      {summary && <PredictionSummaryBar summary={summary} />}
      <main className="w-full max-w-3xl mx-auto py-6 px-2 md:py-8 md:px-4 md:ml-72">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center md:text-left">Prediction - {selectedIndex ? selectedIndex.label : symbol}</h1>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center md:justify-start">
          <IndexDropdown value={symbol} onChange={setSymbol} country="IN" />
        </div>
        <section className="mb-6 md:mb-8">
          <h2 className="font-semibold mb-2">Historical Chart</h2>
          <MarketChart data={chartData} />
        </section>
        <section className="mb-6 md:mb-8">
          <h2 className="font-semibold mb-2">Today's Prediction</h2>
          <PredictionCard prediction={prediction} loading={loading} error={error || undefined} />
          {apiError && (
            <div className="bg-red-100 dark:bg-red-900 rounded p-4 mt-4 text-red-800 dark:text-red-200">
              <b>Prediction API Error:</b> {apiError}
            </div>
          )}
        </section>
        <section>
          <h2 className="font-semibold mb-2">Historical Accuracy</h2>
          <AccuracyChart data={accuracyData} />
        </section>
      </main>
    </div>
  );
};

export default PredictionPage;
