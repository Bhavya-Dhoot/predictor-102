// Utility for logging and retrieving predictions in-memory (per server instance)
export type PredictionLogEntry = {
  timestamp: string;
  symbol: string;
  prediction: any; // JSON block from model
};

let predictionLog: PredictionLogEntry[] = [];

export function addPredictionLog(entry: PredictionLogEntry) {
  predictionLog.push(entry);
}

export function getPredictionLog() {
  return predictionLog;
}

export function clearPredictionLog() {
  predictionLog = [];
}
