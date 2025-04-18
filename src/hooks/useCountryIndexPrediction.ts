"use client";
import { useState } from 'react';

// Supported countries and their major indexes
const COUNTRY_INDEXES = {
  IN: [
    { name: 'Nifty 50', symbol: '^NSEI' },
    { name: 'Sensex', symbol: '^BSESN' },
    { name: 'Nifty Bank', symbol: '^NSEBANK' },
    { name: 'Nifty Next 50', symbol: '^NSMIDCP' },
  ],
  US: [
    { name: 'S&P 500', symbol: '^GSPC' },
    { name: 'Dow Jones', symbol: '^DJI' },
    { name: 'Nasdaq 100', symbol: '^NDX' },
    { name: 'Russell 2000', symbol: '^RUT' },
    { name: 'SPDR S&P 500 ETF (SPY)', symbol: 'SPY' },
    { name: 'Invesco QQQ Trust (QQQ)', symbol: 'QQQ' },
  ],
};

export type Country = 'IN' | 'US';
export type IndexOption = { name: string; symbol: string };

export function useCountryIndexPrediction() {
  const [country, setCountry] = useState<Country>('IN');
  const [index, setIndex] = useState<IndexOption | null>(COUNTRY_INDEXES['IN'][0]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const indexes = COUNTRY_INDEXES[country];

  const selectCountry = (newCountry: Country) => {
    setCountry(newCountry);
    setIndex(COUNTRY_INDEXES[newCountry][0]);
    setPrediction(null);
    setError(null);
  };

  const selectIndex = (symbol: string) => {
    const found = COUNTRY_INDEXES[country].find(idx => idx.symbol === symbol) || null;
    setIndex(found);
    setPrediction(null);
    setError(null);
  };

  const fetchPrediction = async () => {
    if (!index) return;
    setLoading(true);
    setPrediction(null);
    setError(null);
    try {
      // Fetch current quote (for context)
      const quoteRes = await fetch(`/api/market/quote?symbol=${encodeURIComponent(index.symbol)}`);
      const current = quoteRes.ok ? await quoteRes.json() : null;
      // Fetch prediction
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: index.symbol, current }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPrediction(data.result);
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    country,
    setCountry: selectCountry,
    index,
    setIndex: selectIndex,
    indexes,
    loading,
    prediction,
    error,
    fetchPrediction,
  };
}
