declare module 'yahoo-finance2' {
  export interface HistoricalOptions {
    period1: string | number | Date;
    period2?: string | number | Date;
    interval?: "1mo" | "1d" | "1wk";
    events?: "history" | "dividends" | "split";
    includeAdjustedClose?: boolean;
  }
}
