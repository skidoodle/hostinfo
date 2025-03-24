import psl from 'psl'

let currentTabUrl: string | null = null

async function resolveARecord(hostname: string): Promise<string | null> {
  try {
    let dnsResponse = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`,
      { headers: { Accept: 'application/dns-json' } }
    )
    if (dnsResponse.ok) {
      const dnsData = await dnsResponse.json()
      const aRecord = dnsData.Answer?.find(
        (entry: DNSEntry) => entry.type === 1
      )?.data
      if (aRecord) return aRecord
    }

    dnsResponse = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${hostname}&type=AAAA`,
      { headers: { Accept: 'application/dns-json' } }
    )
    if (dnsResponse.ok) {
      const dnsData = await dnsResponse.json()
      const aaaaRecord = dnsData.Answer?.find(
        (entry: DNSEntry) => entry.type === 28
      )?.data
      if (aaaaRecord) return aaaaRecord
    }

    return null
  } catch (error) {
    console.error('Failed to fetch DNS data:', error)
    return null
  }
}

function isIP(host: string): boolean {
  const cleanedHost = host.replace(/^\[|\]$/g, '')

  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  const ipv6Regex =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/

  return ipv4Regex.test(cleanedHost) || ipv6Regex.test(cleanedHost)
}

async function getIPInfo(host: string): Promise<any | null> {
  const cleanedHost = host.replace(/^\[|\]$/g, '')

  if (isIP(cleanedHost)) {
    const response = await fetch(`https://ip.albert.lol/${cleanedHost}`)
    const data = await response.json()
    return data.ip ? data : null
  }

  const resolvedIp = await resolveARecord(cleanedHost)
  if (!resolvedIp) return null

  const response = await fetch(`https://ip.albert.lol/${resolvedIp}`)
  return await response.json()
}

async function handleTabUpdate(url: string) {
  if (url === currentTabUrl) return
  currentTabUrl = url

  try {
    const hostname = new URL(url).hostname
    const apiData = await getIPInfo(hostname)
    if (!apiData || !apiData.ip) {
      await updateIcon(null)
      return
    }

    if (apiData.bogon === true) {
      await updateIcon(null)
      return
    }
    const country = apiData.country || null
    const asn = apiData.org?.split(' ')[0]
    let iconCode = country
    if (!iconCode && asn === 'AS13335') {
      iconCode = 'cloudflare'
    }
    await updateIcon(iconCode)
  } catch (error) {
    console.error('Failed to handle tab update:', error)
    await updateIcon(null)
  }
}

browser.tabs.onActivated.addListener(async activeInfo => {
  const tab = await browser.tabs.get(activeInfo.tabId)
  if (tab.url) await handleTabUpdate(tab.url)
})

browser.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
  if (changeInfo.url) await handleTabUpdate(changeInfo.url)
})

export default defineBackground({
  main() {
    browser.runtime.onMessage.addListener(
      (request: any, _sender, sendResponse) => {
        if (request.type === 'FETCH_SERVER_INFO') {
          ;(async () => {
            try {
              const cleanHostname =
                request.hostname.startsWith('[') &&
                request.hostname.endsWith(']')
                  ? request.hostname.slice(1, -1)
                  : request.hostname

              const apiData = await getIPInfo(cleanHostname)
              if (!apiData || !apiData.ip) {
                sendResponse({ error: 'DNS resolution failed', data: null })
                return
              }
              if (apiData.bogon === true) {
                await updateIcon(null)
                sendResponse({
                  error: null,
                  data: {
                    origin: '',
                    ip: cleanHostname,
                    hostname: '',
                    country: '',
                    city: '',
                    org: '',
                    isLocal: true,
                    isBrowserResource: false,
                  },
                })
                return
              }

              const parsed = psl.parse(cleanHostname)
              const origin = 'domain' in parsed ? parsed.domain : null
              const country = apiData.country || null
              const asn = apiData.org?.split(' ')[0]
              let iconCode = country
              if (!iconCode && asn === 'AS13335') {
                iconCode = 'cloudflare'
              }
              await updateIcon(iconCode)
              sendResponse({
                error: null,
                data: {
                  origin,
                  ip: apiData.ip,
                  hostname: apiData.hostname || 'N/A',
                  country: apiData.country || null,
                  city: apiData.city || null,
                  org: apiData.org,
                  isLocal: false,
                  isBrowserResource: false,
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
        sendResponse({ error: 'Unknown request type', data: null })
        return true
      }
    )
  },
})
