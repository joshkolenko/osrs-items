export interface Item {
  examine: string;
  id: number;
  members: boolean;
  lowalch: number;
  limit: number;
  value: number;
  highalch: number;
  icon: string;
  name: string;
  price: Price;
  volume: number;
}

export interface Price {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
}

export type Timeseries = {
  timestamp: number;
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolume: number;
};

export interface TimeseriesData {
  latest?: Timeseries[];
  hourly?: Timeseries[];
  daily?: Timeseries[];
}
