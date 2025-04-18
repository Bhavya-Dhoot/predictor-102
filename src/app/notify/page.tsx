"use client";
import React, { useState } from 'react';

const NotifyPage: React.FC = () => {
  const [minutes, setMinutes] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetTimer = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/notify/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timerMinutes: minutes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to set timer');
      setResult(data.status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto py-6 px-2 md:py-12 md:px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Set Activity Timer & Get Email Notification</h1>
      <section className="mb-6 md:mb-8 w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center">
        <label className="block mb-2 font-semibold text-base md:text-lg">Timer (minutes):</label>
        <input
          type="number"
          min={1}
          max={1440}
          value={minutes}
          onChange={e => setMinutes(Number(e.target.value))}
          className="border rounded p-2 w-24 text-center mb-4"
        />
        <button
          onClick={handleSetTimer}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-50 w-full md:w-auto"
          disabled={loading || minutes < 1}
        >
          {loading ? 'Setting Timer...' : 'Set Timer & Notify'}
        </button>
      </section>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {result && <div className="bg-green-100 dark:bg-green-900 rounded p-4 mt-4 text-center">{result}</div>}
      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        When the timer is up, an email will be sent to <b>dhoot.bhavya1@gmail.com</b>.
      </p>
    </main>
  );
};

export default NotifyPage;
