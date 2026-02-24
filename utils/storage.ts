const CACHE_TTL = 1000 * 60 * 60 * 24;

export const StorageService = {
  async getTabState(tabId: number): Promise<TabState | null> {
    const key = `tab_${tabId}`;
    if (browser.storage.session) {
      try {
        const res = await browser.storage.session.get(key);
        if (res[key]) return res[key] as TabState;
      } catch { }
    }
    const res = await browser.storage.local.get(`session_${key}`);
    return (res[`session_${key}`] as TabState) || null;
  },

  async setTabState(tabId: number, state: TabState): Promise<void> {
    const key = `tab_${tabId}`;
    if (browser.storage.session) {
      try {
        await browser.storage.session.set({ [key]: state });
        return;
      } catch { }
    }
    await browser.storage.local.set({ [`session_${key}`]: state });
  },

  async removeTabState(tabId: number): Promise<void> {
    const key = `tab_${tabId}`;
    if (browser.storage.session) {
      try {
        await browser.storage.session.remove(key);
        return;
      } catch { }
    }
    await browser.storage.local.remove(`session_${key}`);
  },

  async getGeoCache(ip: string): Promise<GeoData | null> {
    const key = `geo_${ip.replace(/:/g, '_')}`;
    const res = await browser.storage.local.get(key);
    const entry = res[key] as CacheEntry | undefined;

    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await browser.storage.local.remove(key);
      return null;
    }
    return entry.data;
  },

  async setGeoCache(ip: string, data: GeoData): Promise<void> {
    const key = `geo_${ip.replace(/:/g, '_')}`;
    const entry: CacheEntry = { data, timestamp: Date.now() };
    await browser.storage.local.set({ [key]: entry });
  }
};
