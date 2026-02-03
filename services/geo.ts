import type { GeoApiResponse, HostInfo } from '@/utils/types';
import { codes } from '@/utils/codes';

const CACHE = new Map<string, GeoApiResponse>();

export const GeoService = {
  async resolve(ip: string): Promise<GeoApiResponse | null> {
    if (CACHE.has(ip)) return CACHE.get(ip)!;

    try {
      const res = await fetch(`https://ip.albert.lol/${ip}`);
      if (!res.ok) throw new Error(`Geo API Error: ${res.status}`);

      const data: GeoApiResponse = await res.json();
      CACHE.set(ip, data);

      if (CACHE.size > 100) {
        const firstKey = CACHE.keys().next().value;
        if (firstKey) CACHE.delete(firstKey);
      }

      return data;
    } catch (error) {
      console.error('Geo lookup failed', error);
      return null;
    }
  },

  mapToHostInfo(url: string, ip: string, geo: GeoApiResponse | null): HostInfo {
    const urlObj = new URL(url);

    const info: HostInfo = {
      url,
      domain: urlObj.hostname,
      loading: false,
      error: null,
      isBrowserResource: false,
      network: {
        ip,
        hostname: geo?.hostname || urlObj.hostname,
        asn: geo?.org?.split(' ')[0] || null,
        org: geo?.org || 'Unknown Organization',
        isLocal: false,
        isBogon: geo?.bogon || false,
      },
      location: {
        countryCode: geo?.country || null,
        countryName: geo?.country ? (codes[geo.country.toLowerCase()] || geo.country) : null,
        city: geo?.city || null,
        region: geo?.region || null,
        timezone: geo?.timezone || null,
      }
    };

    return info;
  }
};
