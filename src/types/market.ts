export interface MarketQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface PredictionRequest {
  symbol: string;
  historical: MarketQuote[];
  current: MarketQuote;
}

export interface PredictionResult {
  predictedClose: number;
  confidence: number;
  direction: 'up' | 'down';
  magnitude: number;
  reasoning: string;
}
