import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface AccuracyData {
  date: string;
  accuracy: number;
}

interface AccuracyChartProps {
  data: AccuracyData[];
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Bar dataKey="accuracy" fill="#16a34a" />
    </BarChart>
  </ResponsiveContainer>
);

export default AccuracyChart;
