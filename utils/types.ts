export interface HostLocation {
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
}

export interface HostNetwork {
  ip: string;
  asn: string | null;
  org: string | null;
  hostname: string | null;
  isLocal: boolean;
  isBogon: boolean;
}

export interface HostInfo {
  url: string;
  domain: string;
  network: HostNetwork | null;
  location: HostLocation | null;
  error: string | null;
  loading: boolean;
  isBrowserResource: boolean;
}

export interface GeoApiResponse {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  bogon?: boolean;
}
