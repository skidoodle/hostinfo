export function useHostInfo() {
  const [info, setInfo] = useState<TabState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
          if (isMounted) setLoading(false);
          return;
        }

        const data = await StorageService.getTabState(tab.id);
        if (data) {
          if (isMounted) {
            setInfo(data);
            setLoading(false);
          }
          if (data.status === 'loading' && Date.now() - data.lastUpdated > 2000) {
            browser.runtime.sendMessage({ type: 'INIT_TAB', tabId: tab.id, url: tab.url })
          }
        } else {
          if (tab.url) {
            await browser.runtime.sendMessage({ type: 'INIT_TAB', tabId: tab.id, url: tab.url });
          } else {
            if (isMounted) setLoading(false);
          }
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };

    fetchInfo();

    const listener = (changes: any, areaName: string) => {
      if (areaName === 'session' || areaName === 'local') {
        browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
          if (tab?.id) {
            const sessionKey = `tab_${tab.id}`;
            const localKey = `session_tab_${tab.id}`;
            if (changes[sessionKey] || changes[localKey]) {
              fetchInfo();
            }
          }
        });
      }
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      isMounted = false;
      browser.storage.onChanged.removeListener(listener);
    };
  }, []);

  return { info, loading };
}
