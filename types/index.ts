export type WikiAPIResponse = [string, string[], string[], string[]];

export namespace OSRSWiki {
  export interface MappedProperties {
    wikitext: WikitextData.Property[];
    realTimePrice: RealTimePriceData.Property[];
  }

  export type PropertyMap = Data.PropertyMap & ItemData.PropertyMap;
  export type PropertyMapKey =
    | keyof Data.PropertyMap
    | keyof ItemData.PropertyMap;

  export namespace Data {
    export type PropertyMapKey = keyof PropertyMap;
    export interface PropertyMap {
      geids: WikitextData.Property;
      prices: RealTimePriceData.Property;
    }
  }

  export namespace ItemData {
    export type PropertyKey = keyof PropertyMap;

    export interface Options {
      timestep?: '5m' | '1h' | '6h' | '24h';
    }
    export interface PropertyMap {
      id: WikitextData.Property;
      diff: WikitextData.Property;
      examine: WikitextData.Property;
      ha: WikitextData.Property;
      la: WikitextData.Property;
      limit: WikitextData.Property;
      volume: WikitextData.Property;
      latest: RealTimePriceData.Property;
      timeseries: RealTimePriceData.Property;
    }
  }

  export namespace WikitextData {
    export interface Property {
      name?: string;
      type: 'wikitext';
      wikitext: string;
    }
  }

  export namespace RealTimePriceData {
    export interface Property {
      name?: 'latest' | 'timeseries' | 'prices';
      type: 'real-time-price';
      url: URL;
      params?: {
        name: 'id' | 'timestep';
        value: string;
      }[];
      timestep?: '5m' | '1h' | '6h' | '24h';
    }
    export interface Latest {
      high: number;
      highTime: number;
      low: number;
      lowTime: number;
    }

    export interface Timeseries {
      timestamp: number;
      avgHighPrice: number | null;
      avgLowPrice: number;
      highPriceVolume: number;
      lowPriceVolume: number;
    }
  }
}
