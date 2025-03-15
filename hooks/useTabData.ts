export function useTabData() {
  const [data, setData] = useState<ServerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

        if (!tab?.url) throw new Error('No active tab found')

        const url = new URL(tab.url)
        const hostname = url.hostname

        if (['chrome:', 'about:', 'file:'].includes(url.protocol)) {
          return setData({
            origin: '',
            ip: '',
            hostname: url.href,
            country: '',
            city: '',
            org: '',
            isLocal: false,
            isBrowserResource: true,
          })
        }

        const isInternal = isPrivateIP(hostname)
        if (isInternal) {
          return setData({
            origin: '',
            ip: hostname,
            hostname: url.href,
            country: '',
            city: '',
            org: '',
            isLocal: true,
            isBrowserResource: false,
          })
        }

        const response = await chrome.runtime.sendMessage({
          type: 'FETCH_SERVER_INFO',
          hostname: hostname,
        })

        if (!response) {
          throw new Error('No response from background script')
        }

        if (response.error) {
          throw new Error(response.error)
        }

        if (!response.data?.ip) {
          throw new Error('Invalid server data received')
        }

        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
