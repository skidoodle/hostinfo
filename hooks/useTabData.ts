export function useTabData() {
  const [data, setData] = useState<ServerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tab] = await browser.tabs.query({
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

        const response = await browser.runtime.sendMessage<
          FetchServerInfoRequest,
          FetchServerInfoResponse
        >({
          type: 'FETCH_SERVER_INFO',
          hostname: hostname,
        })

        if (!response) {
          throw new Error('No response from background script')
        }

        if (response.error) {
          return setData({
            origin: '',
            ip: '',
            hostname: hostname,
            country: '',
            city: '',
            org: '',
            isLocal: true,
            isBrowserResource: false,
          })
        }

        if (!response.data?.ip) {
          throw new Error('Invalid server data received')
        }

        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No data found')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
