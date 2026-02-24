import { StorageService } from '@/utils/storage';
import { IpUtils } from '@/utils/ip';
import { codes } from '@/utils/codes';
import type { GeoData } from '@/utils/types';

export const GeoService = {
  async getGeoData(ip: string): Promise<GeoData> {
    if (IpUtils.isLocalOrBogon(ip)) {
      return this.getLocalData(ip);
    }

    const cached = await StorageService.getGeoCache(ip);
    if (cached) return cached;

    try {
      const res = await fetch(`https://ip.albert.lol/${ip}`, {
        method: 'GET',
        cache: 'force-cache',
        credentials: 'omit'
      });

      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const raw = await res.json();
      const data = this.transform(ip, raw);

      await StorageService.setGeoCache(ip, data);
      return data;
    } catch (error) {
      console.warn('Geo lookup failed for', ip, error);
      return {
        ip,
        countryCode: null,
        countryName: 'Unknown',
        city: null,
        region: null,
        org: 'Lookup Failed',
        asn: null,
        timezone: null,
        isLocal: false,
        isBogon: false
      };
    }
  },

  getLocalData(ip: string): GeoData {
    return {
      ip,
      countryCode: null,
      countryName: 'Local Network',
      city: null,
      region: null,
      org: 'Private Network',
      asn: null,
      timezone: null,
      isLocal: true,
      isBogon: false
    };
  },

  transform(ip: string, apiData: any): GeoData {
    return {
      ip,
      countryCode: apiData.country || null,
      countryName: apiData.country ? (codes[apiData.country.toLowerCase()] || apiData.country) : null,
      city: apiData.city || null,
      region: apiData.region || null,
      org: apiData.org || null,
      asn: apiData.org?.split(' ')[0] || null,
      timezone: apiData.timezone || null,
      isLocal: false,
      isBogon: apiData.bogon || false
    };
  }
};
