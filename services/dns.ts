export const DnsService = {
  async resolve(hostname: string): Promise<string | null> {
    const a = await this.resolveA(hostname);
    if (a) return a;
    return this.resolveAAAA(hostname);
  },

  async resolveA(hostname: string): Promise<string | null> {
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return '127.0.0.1';
    }
    return this.resolveType(hostname, 'A');
  },

  async resolveAAAA(hostname: string): Promise<string | null> {
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return '::1';
    }
    return this.resolveType(hostname, 'AAAA');
  },

  async resolveType(hostname: string, type: 'A' | 'AAAA'): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${hostname}&type=${type}`,
        {
          headers: { accept: 'application/dns-json' },
          credentials: 'omit',
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!response.ok) return null;

      const data = await response.json();
      const typeNum = type === 'A' ? 1 : 28;
      return data.Answer?.find((r: any) => r.type === typeNum)?.data || null;
    } catch (error) {
      return null;
    }
  }
};
