import { browser } from 'wxt/browser';
import { Tab } from '@/services/tab';
import { StorageService } from '@/utils/storage';

export default defineBackground({
  main() {
    // Listen for Network Responses
    browser.webRequest.onResponseStarted.addListener(
      async (details) => {
        if (details.tabId === -1 || details.type !== 'main_frame' || !details.ip) return;
        await Tab.process(details.tabId, details.url, details.ip);
      },
      { urls: ['<all_urls>'] }
    );

    // Listen for Network Errors (DNS, Connection Refused, etc.)
    browser.webRequest.onErrorOccurred.addListener(
      async (details) => {
        if (details.tabId === -1 || details.type !== 'main_frame') return;
        await Tab.handleError(details.tabId, details.url, details.error);
      },
      { urls: ['<all_urls>'] }
    );

    // Listen for Navigation
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        const urlObj = new URL(tab.url);
        const isSystemPage = ['chrome:', 'about:', 'edge:', 'moz-extension:', 'chrome-extension:', 'file:'].includes(urlObj.protocol);

        if (isSystemPage) {
          await Tab.processSystemPage(tabId);
        } else if (tab.url.startsWith('http')) {
          // We might not have the IP yet if it was cached, so we trigger a process
          // If IP is missing, Tab waits or we can force a HEAD request here
          await Tab.process(tabId, tab.url);

          // Force connection to ensure webRequest fires if cached
          try {
            await fetch(tab.url, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
          } catch { /* ignore */ }
        }
      }
    });

    // Cleanup
    browser.tabs.onRemoved.addListener(async (tabId) => {
      await StorageService.remove(tabId);
    });
  },
});
