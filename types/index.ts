export namespace OSRSWiki {
  export interface Requests {
    templates: () => Promise<TemplateData>;
    geids: () => GEIDs;
    id: () => number;
    latest: () => Promise<Latest>;
    prices: () => Promise<GEIDs>;
    timeseries: () => Promise<{
      [key in Timestep]?: Timeseries[];
    }>;
  }

  export type Templates = {
    [key in keyof TemplateData]: string;
  };

  export type FilteredTemplates = Partial<Templates>;

  export type Property = keyof Data;

  export interface Options {
    item?: string;
    timestep?: Timestep | Timestep[];
  }

  export interface Data {
    examine: string;
    ha: number;
    id: number;
    geids: GEIDs;
    icon: string;
    la: number;
    latest: Latest;
    limit: number;
    members: boolean;
    prices: [];
    timeseries: { [key in Timestep]?: Timeseries[] };
    volume: number;
  }

  type TemplateProps =
    | 'examine'
    | 'ha'
    | 'icon'
    | 'la'
    | 'limit'
    | 'members'
    | 'volume';

  export type TemplateData = Pick<Data, TemplateProps>;
  export type RequestData = Omit<Data, TemplateProps>;

  export type Timestep = '5m' | '1h' | '6h' | '24h';

  export type GEIDs = {
    '%LAST_UPDATE%': number;
    '%LAST_UPDATE_F%': string;
  } & {
    [key: string]: number;
  };

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

  export type Stats = Pick<
    OSRSWiki.Data,
    'latest' | 'timeseries' | 'id' | 'ha' | 'la' | 'limit' | 'volume'
  >;
}
