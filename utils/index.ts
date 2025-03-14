export function isPrivateIP(host: string): boolean {
    try {
      const ip = host.startsWith('[') ? host.slice(1, -1) : host;
      if (ip === 'localhost') return true;

      // IPv4 private ranges
      if (ip.includes('.')) {
        const parts = ip.split('.').map(Number);
        return parts[0] === 10 ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
          (parts[0] === 192 && parts[1] === 168) ||
          (parts[0] === 169 && parts[1] === 254);
      }

      // IPv6 private ranges
      if (ip.includes(':')) {
        return ip.startsWith('fc00::/7') ||
               ip.startsWith('fe80::/10') ||
               ip.startsWith('::1');
      }

      return false;
    } catch {
      return false;
    }
  }
