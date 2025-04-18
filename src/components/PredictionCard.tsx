import React from 'react';

interface PredictionCardProps {
  prediction: string;
  loading?: boolean;
  error?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, loading, error }) => {
  if (loading) return <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 animate-pulse">Loading prediction...</div>;
  if (error) return <div className="bg-red-100 dark:bg-red-900 rounded p-4 text-red-700 dark:text-red-300">{error}</div>;
  let parsed: Record<string, any> | null = null;
  try {
    parsed = prediction && prediction.trim().startsWith('{') ? JSON.parse(prediction) : null;
  } catch {}
  if (parsed && typeof parsed === 'object') {
    return (
      <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 whitespace-pre-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(parsed).map(([key, value]) => (
            <div key={key} className="flex flex-col mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{key.replace(/_/g, ' ')}:</span>
              <span className="text-blue-900 dark:text-blue-200 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 whitespace-pre-line">
      {prediction}
    </div>
  );
};

export default PredictionCard;
