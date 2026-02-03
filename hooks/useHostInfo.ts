import { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import { StorageService } from '@/utils/storage';
import { IconService } from '@/services/icon';
import type { HostInfo } from '@/utils/types';

export function useHostInfo() {
  const [info, setInfo] = useState<HostInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unwatch: (() => void) | undefined;

    const init = async () => {
      // Get Current Tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || !tab?.url) {
        setLoading(false);
        return;
      }

      // Handle System/Browser Pages immediately
      const urlObj = new URL(tab.url);

      const systemProtocols = [
        'chrome:',
        'about:',
        'edge:',
        'moz-extension:',
        'chrome-extension:',
        'edge-extension:',
        'extension:',
        'file:',
        'view-source:',
        'resource:',
        'blob:',
        'data:'
      ];

      const isSystemPage = systemProtocols.includes(urlObj.protocol);

      if (isSystemPage) {
        await IconService.update(tab.id, null, true);

        setInfo({
          url: tab.url,
          domain: 'System Resource',
          loading: false,
          error: null,
          network: null,
          location: null,
          isBrowserResource: true
        });
        setLoading(false);
        return;
      }

      // Handle Network Pages via Storage
      const key = StorageService.getKey(tab.id);

      // Initial Load
      const current = await StorageService.get(tab.id);
      setInfo(current);
      setLoading(false);

      // Watch for changes
      unwatch = storage.watch<HostInfo>(key, (newValue) => {
        setInfo(newValue);
      });
    };

    init();

    return () => {
      if (unwatch) unwatch();
    };
  }, []);

  return { info, loading };
}
