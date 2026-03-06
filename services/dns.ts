export const DnsService = {
  async resolve(hostname: string): Promise<string | null> {
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return '127.0.0.1';
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`,
        {
          headers: { accept: 'application/dns-json' },
          credentials: 'omit',
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!response.ok) return null;

      const data = await response.json();
      return data.Answer?.find((r: any) => r.type === 1)?.data || null;
    } catch (error) {
      return null;
    }
  }
};
