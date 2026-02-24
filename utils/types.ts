export interface GeoData {
  ip: string;
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
  region: string | null;
  org: string | null;
  asn: string | null;
  timezone: string | null;
  isLocal: boolean;
  isBogon: boolean;
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TabState {
  url: string;
  domain: string;
  status: LoadingStatus;
  data: GeoData | null;
  errorMessage: string | null;
  lastUpdated: number;
}

export interface CacheEntry {
  data: GeoData;
  timestamp: number;
}
