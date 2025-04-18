"use client";
import React from "react";
import DarkModeToggle from '@/components/DarkModeToggle';

const SettingsPage: React.FC = () => {
  return (
    <main className="max-w-xl mx-auto py-6 px-2 md:py-12 md:px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Settings</h1>
      <section className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 flex flex-col gap-4 items-center">
        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold text-base md:text-lg">API Configuration</label>
          <p className="text-sm text-gray-500 dark:text-gray-400">API keys are managed via environment variables. To update, edit your <code>.env.local</code> file and redeploy.</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold text-base md:text-lg">Prediction Sensitivity</label>
          <input type="range" min="1" max="100" defaultValue="50" className="w-full" disabled />
          <p className="text-xs text-gray-500 mt-1">(Coming soon) Adjust how sensitive predictions are to market changes.</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold text-base md:text-lg">UI Preferences</label>
          <DarkModeToggle />
          <p className="text-xs text-gray-500 mt-1">(Coming soon) Customize your dashboard appearance.</p>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
