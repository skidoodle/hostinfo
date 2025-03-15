import psl from 'psl'

let currentTabUrl: string | null = null

async function resolveARecord(hostname: string): Promise<string | null> {
  try {
    const dnsResponse = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`,
      {
        headers: { Accept: 'application/dns-json' },
      }
    )

    if (!dnsResponse.ok) {
      console.error(`DNS query failed: ${dnsResponse.status}`)
      return null
    }

    const dnsData = await dnsResponse.json()
    return (
      dnsData.Answer?.find((entry: DNSEntry) => entry.type === 1)?.data || null
    )
  } catch (error) {
    console.error('Failed to fetch DNS data:', error)
    return null
  }
}

async function handleTabUpdate(url: string) {
  if (url === currentTabUrl) return
  currentTabUrl = url

  try {
    const hostname = new URL(url).hostname
    const ip = await resolveARecord(hostname)

    if (!ip) {
      await updateIcon(null)
      return
    }

    const apiResponse = await fetch(`https://ip.albert.lol/${ip}`)
    const apiData = await apiResponse.json()

    await updateIcon(apiData.country || null)
  } catch (error) {
    console.error('Failed to handle tab update:', error)
    await updateIcon(null)
  }
}

chrome.tabs.onActivated.addListener(async activeInfo => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (tab.url) await handleTabUpdate(tab.url)
})

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
  if (changeInfo.url) await handleTabUpdate(changeInfo.url)
})

export default defineBackground({
  main() {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.type === 'FETCH_SERVER_INFO') {
        ;(async () => {
          try {
            const ip = await resolveARecord(request.hostname)
            if (!ip) {
              sendResponse({ error: 'DNS resolution failed', data: null })
              return
            }

            const apiResponse = await fetch(`https://ip.albert.lol/${ip}`)
            const apiData = await apiResponse.json()

            const parsed = psl.parse(request.hostname)
            const origin = 'domain' in parsed ? parsed.domain : null

            await updateIcon(apiData.country)

            sendResponse({
              error: null,
              data: {
                origin,
                ip: apiData.ip,
                hostname: apiData.hostname || 'N/A',
                country: apiData.country || null,
                city: apiData.city || null,
                org: apiData.org,
              },
            })
          } catch (error) {
            await updateIcon(null)
            sendResponse({
              error: error instanceof Error ? error.message : 'Unknown error',
              data: null,
            })
          }
        })()
        return true
      }
    })
  },
})
