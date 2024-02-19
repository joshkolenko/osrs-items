export type WikiAPIResponse = [string, string[], string[], string[]];

export interface PriceData {
  latest: {
    high: number;
    highTime: number;
    low: number;
    lowTime: number;
  };
  daily: PriceDataTimeseries;
  hourly: PriceDataTimeseries;
}

export type PriceDataTimeseries = {
  timestamp: number;
  avgHighPrice: number | null;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolume: number;
}[];

export interface ItemData {
  title: string;
  id: number;
  diff: number;
  examine: string;
  limit: number;
  priceData: PriceData;
  volume: number;
}
