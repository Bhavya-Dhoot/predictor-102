"use client";
import React from 'react';

export type ActivityLogEntry = {
  timestamp: string; // ISO string
  action: string;
  details?: string;
};

export default function ActivityLog({ log }: { log: ActivityLogEntry[] }) {
  return (
    <section className="my-8">
      <h2 className="text-lg font-bold mb-2">Activity Log</h2>
      {log.length === 0 ? (
        <div className="text-gray-500">No activity yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded shadow-md">
          {log.map((entry, idx) => (
            <li key={idx} className="px-4 py-3 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <span className="text-xs text-blue-600 dark:text-blue-300 font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{entry.action}</span>
              {entry.details && (
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.details}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
