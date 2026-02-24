import type { TabState } from '@/utils/types';
import Error from './Error';
import { BrowserResourceView } from './Browser';
import { LocalNetworkView } from './Local';
import { PublicNetworkView } from './Public';

export default function ServerInfo({ state }: { state: TabState }) {

  if (state.status === 'error') {
    return <Error error={state.errorMessage || 'Unknown Error'} />;
  }

  if (state.status === 'success' && !state.data) {
    return <BrowserResourceView url={state.url} />;
  }

  if (state.status === 'loading' || !state.data) {
    return (
      <div className="w-80 h-64 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-gray-950">
        <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-xs text-gray-400 font-medium">Analyzing Network...</span>
      </div>
    );
  }

  if (state.data.isLocal || state.data.isBogon) {
    return <LocalNetworkView data={state.data} domain={state.domain} />;
  }

  return <PublicNetworkView data={state.data} domain={state.domain} />;
}
