import type { HostInfo } from './types';

export const StorageService = {
  /**
   * Returns the storage key for a specific tab with the required type prefix
   */
  getKey(tabId: number): `session:${string}` {
    return `session:host-info-${tabId}`;
  },

  /**
   * Save host info for a tab
   */
  async set(tabId: number, data: HostInfo) {
    await storage.setItem<HostInfo>(this.getKey(tabId), data);
  },

  /**
   * Get host info for a tab
   */
  async get(tabId: number): Promise<HostInfo | null> {
    return await storage.getItem<HostInfo>(this.getKey(tabId));
  },

  /**
   * Clear data when a tab is closed
   */
  async remove(tabId: number) {
    await storage.removeItem(this.getKey(tabId));
  }
};
