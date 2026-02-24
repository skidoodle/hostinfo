import { StorageService } from '@/utils/storage';
import { GeoService } from '@/services/geo';
import { IconService } from '@/services/icon';
import { DnsService } from '@/services/dns';

const SYSTEM_PROTOCOLS = [
  'chrome:', 'about:', 'edge:', 'moz-extension:',
  'chrome-extension:', 'file:', 'view-source:', 'data:', 'devtools:'
];

const tabStates = new Map<number, TabState>();

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function applyIconForState(tabId: number, state: TabState) {
  const isSystem = SYSTEM_PROTOCOLS.some(p => state.url.startsWith(p));
  if (isSystem) {
    IconService.updateIcon(tabId, null, true);
  } else if (state.status === 'success' && state.data) {
    let code = state.data.countryCode;
    if (state.data.asn === 'AS13335') code = 'cloudflare';
    IconService.updateIcon(tabId, code, state.data.isLocal);
  } else {
    IconService.updateIcon(tabId, null, false);
  }
}

async function initTab(tabId: number, url: string, resolveDns = false) {
  if (!url) return;
  const isSystem = SYSTEM_PROTOCOLS.some(p => url.startsWith(p));
  const domain = getDomain(url);

  let currentState = tabStates.get(tabId);

  if (!currentState || currentState.url !== url) {
    tabStates.set(tabId, {
      url,
      domain,
      status: 'loading',
      data: null,
      errorMessage: null,
      lastUpdated: Date.now()
    });
  }

  if (!currentState) {
    currentState = await StorageService.getTabState(tabId) || undefined;
  }

  const latestState = tabStates.get(tabId);
  if (latestState && latestState.url !== url) return;
  if (latestState && latestState.status === 'success' && latestState.data) return;

  const isSameDomain = currentState?.domain === domain;
  const hasExistingData = isSameDomain && !!currentState?.data;

  const newState: TabState = {
    url,
    domain,
    status: isSystem || hasExistingData ? 'success' : 'loading',
    data: hasExistingData ? currentState!.data : null,
    errorMessage: null,
    lastUpdated: Date.now()
  };

  tabStates.set(tabId, newState);
  StorageService.setTabState(tabId, newState).catch(() => { });

  applyIconForState(tabId, newState);

  if (!isSystem && !hasExistingData && resolveDns) {
    const ip = await DnsService.resolve(domain);
    if (ip) {
      await processIp(tabId, url, ip);
    } else {
      await updateState(tabId, {
        status: 'error',
        errorMessage: 'Could not resolve host'
      });
    }
  }
}

async function processIp(tabId: number, url: string, ip: string) {
  let current = tabStates.get(tabId);
  if (!current) {
    current = await StorageService.getTabState(tabId) || undefined;
  }

  const latestState1 = tabStates.get(tabId);
  if (latestState1) {
    try {
      if (new URL(latestState1.url).hostname !== new URL(url).hostname) return;
    } catch {
      return;
    }
  }

  if (current?.status === 'success' && current.data?.ip === ip) {
    return;
  }

  const geoData = await GeoService.getGeoData(ip);

  const stateAfterFetch = tabStates.get(tabId);
  if (stateAfterFetch) {
    try {
      if (new URL(stateAfterFetch.url).hostname !== new URL(url).hostname) return;
    } catch {
      return;
    }
  }

  const newState: TabState = {
    url: stateAfterFetch?.url || url,
    domain: stateAfterFetch?.domain || getDomain(url),
    status: 'success',
    data: geoData,
    errorMessage: null,
    lastUpdated: Date.now()
  };

  tabStates.set(tabId, newState);
  await StorageService.setTabState(tabId, newState);

  applyIconForState(tabId, newState);
}

async function updateState(tabId: number, updates: Partial<TabState>) {
  let current = tabStates.get(tabId);
  if (!current) {
    current = await StorageService.getTabState(tabId) || undefined;
  }

  if (current) {
    const newState = { ...current, ...updates };
    tabStates.set(tabId, newState);
    await StorageService.setTabState(tabId, newState);
    applyIconForState(tabId, newState);
  }
}

export default defineBackground({
  main() {
    browser.webNavigation.onBeforeNavigate.addListener((details) => {
      if (details.frameId !== 0) return;
      initTab(details.tabId, details.url, false);
    });

    browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
      if (details.frameId !== 0) return;
      initTab(details.tabId, details.url, true);
    });

    browser.webNavigation.onCommitted.addListener((details) => {
      if (details.frameId !== 0) return;
      const state = tabStates.get(details.tabId);
      if (state) {
        applyIconForState(details.tabId, state);
      }
    });

    browser.webRequest.onResponseStarted.addListener(
      (details) => {
        if (details.tabId === -1 || details.type !== 'main_frame') return;
        if (details.ip) {
          processIp(details.tabId, details.url, details.ip);
        }
      },
      { urls: ['<all_urls>'] }
    );

    browser.webNavigation.onCompleted.addListener(async (details) => {
      if (details.frameId !== 0) return;

      const state = tabStates.get(details.tabId);

      if (state) {
        applyIconForState(details.tabId, state);
      }

      if (state && state.status === 'loading' && !state.data) {
        let hostname = '';
        try {
          hostname = new URL(details.url).hostname;
        } catch {
          return;
        }
        const ip = await DnsService.resolve(hostname);

        if (ip) {
          await processIp(details.tabId, details.url, ip);
        } else {
          await updateState(details.tabId, {
            status: 'error',
            errorMessage: 'Could not resolve host'
          });
        }
      }
    });

    browser.webRequest.onErrorOccurred.addListener(
      async (details) => {
        if (details.type !== 'main_frame') return;
        if (details.error === 'net::ERR_ABORTED') return;

        await updateState(details.tabId, {
          status: 'error',
          errorMessage: details.error
        });
      },
      { urls: ['<all_urls>'] }
    );

    browser.tabs.onRemoved.addListener((tabId) => {
      tabStates.delete(tabId);
      StorageService.removeTabState(tabId);
    });

    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await browser.tabs.get(activeInfo.tabId);
      if (tab.url) {
        const state = tabStates.get(tab.id!);
        if (state) {
          applyIconForState(tab.id!, state);
        } else {
          initTab(tab.id!, tab.url, true);
        }
      }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status && tab.url) {
        const state = tabStates.get(tabId);
        if (state) {
          applyIconForState(tabId, state);
        }
      }
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'INIT_TAB' && message.tabId && message.url) {
        initTab(message.tabId, message.url, true);
      }
    });
  },
});
