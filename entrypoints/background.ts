import psl from 'psl';

export default defineBackground({
  main() {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.type === 'FETCH_SERVER_INFO') {
        (async () => {
          try {
            const dnsResponse = await fetch(`https://dns.google/resolve?name=${request.hostname}&type=A`);
            const dnsData = await dnsResponse.json();
            const ip = dnsData.Answer?.[0]?.data;

            if (!ip) {
              sendResponse({ error: 'DNS resolution failed', data: null });
              return;
            }

            const apiResponse = await fetch(`https://ip.albert.lol/${ip}`);
            const apiData = await apiResponse.json();

            const parsed = psl.parse(request.hostname);
            const origin = 'domain' in parsed ? parsed.domain : null;

            await updateIcon(apiData.country);

            sendResponse({
              error: null,
              data: {
                origin: origin,
                ip: apiData.ip,
                hostname: apiData.hostname ? apiData.hostname : "N/A",
                country: apiData.country ? apiData.country : null,
                city: apiData.city ? apiData.city : null,
                org: apiData.org
              }
            });
          } catch (error) {
            await updateIcon(null);
            sendResponse({
              error: error instanceof Error ? error.message : 'Unknown error',
              data: null
            });
          }
        })();
        return true;
      }
    });
  },
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (!tab.url) return;

  try {
    const url = new URL(tab.url);
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${url.hostname}&type=A`);
    const dnsData = await dnsResponse.json();
    const ip = dnsData.Answer?.[0]?.data;

    if (!ip) return;

    const apiResponse = await fetch(`https://ip.albert.lol/${ip}`);
    const apiData = await apiResponse.json();

    await updateIcon(apiData.country);
  } catch {
    await updateIcon(null);
  }
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
  if (!changeInfo.url) return;

  try {
    const url = new URL(changeInfo.url);
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${url.hostname}&type=A`);
    const dnsData = await dnsResponse.json();
    const ip = dnsData.Answer?.[0]?.data;

    if (!ip) return;

    const apiResponse = await fetch(`https://ip.albert.lol/${ip}`);
    const apiData = await apiResponse.json();

    await updateIcon(apiData.country);
  } catch {
    await updateIcon(null);
  }
});
