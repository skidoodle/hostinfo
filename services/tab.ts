import { IpUtils } from '@/utils/ip';
import { StorageService } from '@/utils/storage';
import { GeoService } from './geo';
import { IconService } from './icon';
import type { HostInfo } from '@/utils/types';

export const Tab = {
  /**
   * Main entry point to process a tab's data
   */
  async process(tabId: number, url: string, ip?: string) {
    // Initial State (Loading)
    const initialState: HostInfo = {
      url,
      domain: new URL(url).hostname,
      loading: true,
      error: null,
      network: null,
      location: null,
      isBrowserResource: false
    };

    // Don't overwrite if we already have data for this exact URL,
    // but do update if we have a new IP
    const existing = await StorageService.get(tabId);
    if (!existing || existing.url !== url) {
      await StorageService.set(tabId, initialState);
    }

    // Resolve IP if missing
    if (!ip) {
      return;
    }

    // Handle Local/Private IPs
    if (IpUtils.isLocalOrBogon(ip)) {
      const localInfo: HostInfo = {
        ...initialState,
        loading: false,
        network: {
          ip,
          hostname: 'Local Network',
          asn: null,
          org: 'Private Network',
          isLocal: true,
          isBogon: false
        },
        location: null
      };
      await StorageService.set(tabId, localInfo);
      await IconService.update(tabId, null, true);
      return;
    }

    // Fetch Public Data
    const geoData = await GeoService.resolve(ip);

    if (!geoData) {
      await StorageService.set(tabId, { ...initialState, loading: false, error: 'Failed to fetch host info' });
      return;
    }

    // Save Final State
    const finalInfo = GeoService.mapToHostInfo(url, ip, geoData);
    await StorageService.set(tabId, finalInfo);

    // Determine Icon
    const asn = finalInfo.network?.asn;
    let iconCode = finalInfo.location?.countryCode || null;

    if (asn === 'AS13335') {
      iconCode = 'cloudflare';
    }

    await IconService.update(tabId, iconCode, false);
  }
};
