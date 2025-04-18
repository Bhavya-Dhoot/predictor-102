import React from 'react';
import { useCountryIndexPrediction } from '@/hooks/useCountryIndexPrediction';

export default function CountryIndexPredictionWidget() {
  const {
    country,
    setCountry,
    index,
    setIndex,
    indexes,
    loading,
    prediction,
    error,
    fetchPrediction,
  } = useCountryIndexPrediction();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Country &amp; Index Prediction</h2>
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label className="block font-semibold mb-1">Country</label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value as 'IN' | 'US')}
            className="border rounded px-2 py-1"
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Index</label>
          <select
            value={index?.symbol || ''}
            onChange={e => setIndex(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {indexes.map(idx => (
              <option key={idx.symbol} value={idx.symbol}>{idx.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={fetchPrediction}
            disabled={loading || !index}
          >
            {loading ? 'Loading...' : 'Get Prediction'}
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {prediction && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-4 whitespace-pre-line mt-4">
          {prediction}
        </div>
      )}
    </div>
  );
}
