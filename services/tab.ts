import { IpUtils } from '@/utils/ip';
import { StorageService } from '@/utils/storage';
import { GeoService } from './geo';
import { IconService } from './icon';
import type { HostInfo } from '@/utils/types';

export const Tab = {
  /**
   * Handle System/Browser specific pages
   */
  async processSystemPage(tabId: number) {
    await IconService.update(tabId, null, true);
  },

  /**
   * Handle Network Errors (DNS, Connection Refused, etc)
   */
  async handleError(tabId: number, url: string, error: string) {
    let message = error;

    // Normalize error string (remove net:: prefix if present)
    const code = error.startsWith('net::') ? error.replace('net::', '') : error;

    switch (code) {
      case 'ERR_NAME_NOT_RESOLVED':
      case 'NS_ERROR_UNKNOWN_HOST':
        message = 'DNS Resolution Failed (NXDOMAIN)';
        break;
      case 'ERR_CONNECTION_REFUSED':
      case 'NS_ERROR_CONNECTION_REFUSED':
        message = 'Connection Refused';
        break;
      case 'ERR_INTERNET_DISCONNECTED':
      case 'NS_ERROR_OFFLINE':
        message = 'No Internet Connection';
        break;
      case 'ERR_CONNECTION_TIMED_OUT':
      case 'NS_ERROR_NET_TIMEOUT':
        message = 'Connection Timed Out';
        break;
      case 'ERR_ADDRESS_UNREACHABLE':
        message = 'Address Unreachable';
        break;
      default:
        // Fallback: clean up the code for display (e.g. ERR_SSL_PROTOCOL_ERROR -> Err ssl protocol error)
        message = code.replace(/_/g, ' ').toLowerCase();
        message = message.charAt(0).toUpperCase() + message.slice(1);
        break;
    }

    const errorInfo: HostInfo = {
      url,
      domain: new URL(url).hostname,
      loading: false,
      error: message,
      network: null,
      location: null,
      isBrowserResource: false
    };

    await StorageService.set(tabId, errorInfo);
    await IconService.update(tabId, 'unknown', false);
  },

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

    // Handle Local/Private IPs (Bogons)
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

    // If Geo lookup fails (e.g. LAN domain with public IP, or API down),
    // we still want to show the IP we captured.
    if (!geoData) {
      const fallbackInfo: HostInfo = {
        ...initialState,
        loading: false,
        network: {
          ip,
          hostname: null,
          asn: null,
          org: 'Unknown',
          isLocal: false,
          isBogon: false
        },
        location: {
          countryCode: null,
          countryName: 'Unknown Location',
          city: null,
          region: null,
          timezone: null
        }
      };
      await StorageService.set(tabId, fallbackInfo);
      await IconService.update(tabId, 'unknown', false);
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
