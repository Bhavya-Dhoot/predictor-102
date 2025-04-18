import React from 'react';

interface PredictionCardProps {
  prediction: string;
  loading?: boolean;
  error?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, loading, error }) => {
  if (loading) return <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 animate-pulse">Loading prediction...</div>;
  if (error) return <div className="bg-red-100 dark:bg-red-900 rounded p-4 text-red-700 dark:text-red-300">{error}</div>;
  return (
    <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 whitespace-pre-line">
      {prediction}
    </div>
  );
};

export default PredictionCard;
