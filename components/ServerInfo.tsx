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
      <div className="w-80 flex flex-col items-center justify-center bg-base-950 border-2 border-base-100 py-16">
        <div className="flex gap-1 mb-4">
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_400ms]"></div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Analyzing Network</span>
      </div>
    );
  }

  if (state.data.isLocal || state.data.isBogon) {
    return <LocalNetworkView data={state.data} domain={state.domain} />;
  }

  return <PublicNetworkView data={state.data} domain={state.domain} />;
}
