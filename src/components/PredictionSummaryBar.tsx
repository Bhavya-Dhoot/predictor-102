import React, { useState } from 'react';

export interface PredictionSummary {
  "Market Sentiment"?: string;
  "Predicted Close"?: string;
  "Confidence %"?: string;
  "Up/Down"?: string;
  "Magnitude"?: string;
  "Short Reasoning"?: string;
  "Upside Target"?: string;
  "Timing"?: string;
  "Data Timestamp"?: string;
}

export default function PredictionSummaryBar({ summary }: { summary: PredictionSummary }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile FAB & Drawer */}
      <button
        className="fixed z-40 bottom-6 left-6 md:hidden bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none"
        aria-label="Show Prediction Summary"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Show Prediction Summary</span>
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Drawer background */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}
      {/* Drawer content */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-11/12 max-w-xs bg-blue-50 dark:bg-blue-950 border-r border-blue-200 dark:border-blue-800 p-6 flex flex-col gap-4 shadow-lg transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:fixed md:left-0 md:top-0 md:h-full md:w-72 md:z-30 md:translate-x-0`}
        style={{ transitionProperty: 'transform' }}
        aria-label="Prediction Summary"
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-blue-900 dark:text-blue-200 text-2xl focus:outline-none"
          onClick={() => setOpen(false)}
          aria-label="Close Prediction Summary"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2">Latest Prediction</h2>
        <div className="flex flex-col gap-2">
          <SummaryRow label="Market Sentiment" value={summary["Market Sentiment"]} />
          <SummaryRow label="Predicted Close" value={summary["Predicted Close"]} />
          <SummaryRow label="Confidence %" value={summary["Confidence %"]} />
          <SummaryRow label="Up/Down" value={summary["Up/Down"]} />
          <SummaryRow label="Magnitude" value={summary["Magnitude"]} />
          <SummaryRow label="Upside Target" value={summary["Upside Target"]} />
          <SummaryRow label="Timing" value={summary["Timing"]} />
          <SummaryRow label="Data Timestamp" value={summary["Data Timestamp"]} />
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{summary["Short Reasoning"]}</div>
        </div>
      </aside>
      {/* Desktop sidebar remains always open */}
      <div className="hidden md:block">
        <aside className="fixed left-0 top-0 h-full w-72 bg-blue-50 dark:bg-blue-950 border-r border-blue-200 dark:border-blue-800 z-30 p-6 flex flex-col gap-4 shadow-lg">
          <h2 className="text-lg font-bold mb-2">Latest Prediction</h2>
          <div className="flex flex-col gap-2">
            <SummaryRow label="Market Sentiment" value={summary["Market Sentiment"]} />
            <SummaryRow label="Predicted Close" value={summary["Predicted Close"]} />
            <SummaryRow label="Confidence %" value={summary["Confidence %"]} />
            <SummaryRow label="Up/Down" value={summary["Up/Down"]} />
            <SummaryRow label="Magnitude" value={summary["Magnitude"]} />
            <SummaryRow label="Upside Target" value={summary["Upside Target"]} />
            <SummaryRow label="Timing" value={summary["Timing"]} />
            <SummaryRow label="Data Timestamp" value={summary["Data Timestamp"]} />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{summary["Short Reasoning"]}</div>
          </div>
        </aside>
      </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="font-semibold text-gray-700 dark:text-gray-200">{label}:</span>
      <span className="text-right text-blue-900 dark:text-blue-200 font-mono">{value}</span>
    </div>
  );
}
