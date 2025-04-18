import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface ChartData {
  date: string;
  close: number;
}

interface MarketChartProps {
  data: ChartData[];
}

const MarketChart: React.FC<MarketChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={['auto', 'auto']} />
      <Tooltip />
      <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default MarketChart;
