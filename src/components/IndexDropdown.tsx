"use client";
import React from 'react';

export const MAJOR_INDIAN_INDEXES = [
  { label: 'Nifty 50', symbol: '^NSEI' },
  { label: 'Sensex', symbol: '^BSESN' },
  { label: 'Nifty Bank', symbol: '^NSEBANK' },
  { label: 'Nifty Next 50', symbol: '^NSMIDCP' },
];

export const MAJOR_US_INDEXES = [
  { label: 'S&P 500 ETF', symbol: 'SPY' },
  { label: 'Dow Jones Industrial Average ETF', symbol: 'DIA' },
  { label: 'NASDAQ 100 ETF', symbol: 'QQQ' },
  { label: 'Russell 2000 ETF', symbol: 'IWM' },
  { label: 'S&P 500 Equal Weight ETF', symbol: 'RSP' },
  { label: 'S&P MidCap 400 ETF', symbol: 'MDY' },
  { label: 'S&P SmallCap 600 ETF', symbol: 'SLY' },
  { label: 'Vanguard Total Stock Market ETF', symbol: 'VTI' },
  { label: 'Vanguard S&P 500 ETF', symbol: 'VOO' },
  { label: 'Vanguard Russell 1000 ETF', symbol: 'VONE' },
];

type Props = {
  value: string;
  onChange: (symbol: string) => void;
  country?: 'IN' | 'US';
};

const IndexDropdown: React.FC<Props> = ({ value, onChange, country = 'IN' }) => {
  const indexes = country === 'IN' ? MAJOR_INDIAN_INDEXES : MAJOR_US_INDEXES;
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Select Index:</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-xs bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {indexes.map(idx => (
          <option value={idx.symbol} key={idx.symbol}>
            {idx.label} ({idx.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default IndexDropdown;
