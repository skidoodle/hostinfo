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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://ip.albert.lol/${ip}`, {
        method: 'GET',
        cache: 'force-cache',
        credentials: 'omit',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const raw = await res.json();
      const data = this.transform(ip, raw);

      await StorageService.setGeoCache(ip, data);
      return data;
    } catch (error) {
      console.warn('Geo lookup failed for', ip, error);
      const failedData: GeoData = {
        ip,
        hostname: null,
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

      await StorageService.setGeoCache(ip, failedData);
      return failedData;
    }
  },

  getLocalData(ip: string): GeoData {
    return {
      ip,
      hostname: null,
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
    const asnMatch = apiData.org?.match(/^AS\d+/i);

    return {
      ip,
      hostname: apiData.hostname || null,
      countryCode: apiData.country || null,
      countryName: apiData.country ? (codes[apiData.country.toLowerCase()] || apiData.country) : null,
      city: apiData.city || null,
      region: apiData.region || null,
      org: apiData.org || null,
      asn: asnMatch ? asnMatch[0].toUpperCase() : null,
      timezone: apiData.timezone || null,
      isLocal: false,
      isBogon: apiData.bogon || false
    };
  }
}
