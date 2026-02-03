import type { HostInfo } from '@/utils/types';
import Error from './Error';
import { BrowserResourceView } from './Browser';
import { LocalNetworkView } from './Local';
import { PublicNetworkView } from './Public';

export default function ServerInfo({ data }: { data: HostInfo }) {
  const { network, isBrowserResource } = data;

  // Browser Resource View
  if (isBrowserResource) {
    return <BrowserResourceView data={data} />;
  }

  // Fallback if network data is missing
  if (!network) {
    return <Error error="Host information unavailable." />;
  }

  // Local Network View
  if (network.isLocal) {
    return <LocalNetworkView data={data} />;
  }

  // Public Internet View
  return <PublicNetworkView data={data} />;
}
