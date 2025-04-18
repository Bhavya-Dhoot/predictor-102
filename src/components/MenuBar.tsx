"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/prediction', label: 'Prediction' },
  { href: '/settings', label: 'Settings' },
  { href: '/backtest', label: 'Backtest' },
  { href: '/notify', label: 'Notify' },
  { href: '/export', label: 'Export' },
];

const MenuBar: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-blue-700 dark:text-blue-300 tracking-tight select-none">Predictor 101</span>
        </div>
        <ul className="flex gap-2 md:gap-4">
          {menuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium text-sm md:text-base hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
