// Temporary type definition for yahooFinance.historical options, since node_modules is not accessible
export type YahooHistoricalOptions = {
  period1: string | number | Date;
  period2?: string | number | Date;
  interval?: "1mo" | "1d" | "1wk";
  events?: "history" | "dividends" | "split";
  includeAdjustedClose?: boolean;
};
