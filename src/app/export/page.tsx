"use client";
import React, { useState } from 'react';

const DEFAULT_SYMBOL = 'NSE:NIFTY';

const ExportPage: React.FC = () => {
  const [predictions, setPredictions] = useState([
    { date: '2025-04-14', predicted: 22250, confidence: 90, reasoning: 'Strong uptrend' },
    { date: '2025-04-15', predicted: 22300, confidence: 92, reasoning: 'Momentum continues' },
    { date: '2025-04-16', predicted: 22400, confidence: 88, reasoning: 'Volatility expected' },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: DEFAULT_SYMBOL, predictions }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${DEFAULT_SYMBOL}_predictions.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-6 px-2 md:py-12 md:px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Export Predictions (Nifty 50)</h1>
      <section className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center gap-4">
        <p className="text-gray-700 dark:text-gray-300 text-center mb-4">Download all your predicted values as a CSV file. Works best on desktop and mobile.</p>
        <button
          onClick={handleExport}
          className="px-6 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow w-full md:w-auto disabled:opacity-50"
          disabled={downloading}
        >
          {downloading ? 'Exporting...' : 'Export as CSV'}
        </button>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <section>
          <h2 className="font-semibold mb-2 mt-8 text-center">Sample Predictions</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2">Date</th>
                <th className="p-2">Predicted</th>
                <th className="p-2">Confidence</th>
                <th className="p-2">Reasoning</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.predicted}</td>
                  <td className="p-2">{row.confidence}%</td>
                  <td className="p-2">{row.reasoning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
};

export default ExportPage;
