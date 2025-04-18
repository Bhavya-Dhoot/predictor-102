"use client";
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto py-8 px-2 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-900">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-700 dark:text-blue-200 drop-shadow-lg text-center">Predictor 101: Indian Index Prediction</h1>
      <p className="mb-8 text-base md:text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">
        The next-generation platform for forecasting Indian financial indices. Powered by real-time data and Google Gemini ML. Built with Next.js & Tailwind CSS.
      </p>
      <nav className="mb-8 md:mb-12 flex flex-wrap gap-2 md:gap-4 justify-center w-full">
        <Link href="/dashboard" className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Dashboard</Link>
        <Link href="/prediction" className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Prediction</Link>
        <Link href="/settings" className="rounded-lg bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Settings</Link>
        <Link href="/backtest" className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Backtest</Link>
        <Link href="/notify" className="rounded-lg bg-pink-600 hover:bg-pink-700 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Notify</Link>
        <Link href="/export" className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-4 md:px-5 py-2 font-semibold shadow transition-colors w-full sm:w-auto text-center">Export</Link>
      </nav>
      <section className="w-full max-w-2xl mb-12">
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-xl p-4 md:p-8 flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">About Predictor 101</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center text-sm md:text-base">
            Predictor 101 empowers you to analyze, predict, and backtest the Indian stock market with confidence. Explore dashboards, make predictions, receive notifications, and more—all in a seamless, modern interface.
          </p>
        </div>
      </section>
      <footer className="mt-auto mb-4 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Predictor 101. All rights reserved.
      </footer>
    </main>
  );
};

export default Home;
