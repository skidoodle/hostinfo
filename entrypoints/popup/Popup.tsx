import ServerInfo from '@/components/ServerInfo';
import Error from '@/components/Error';
import { useHostInfo } from '@/hooks/useHostInfo';

export default function Popup() {
  const { info, loading } = useHostInfo();

  if (loading) {
    return (
      <div className="w-80 bg-base-950 flex flex-col items-center justify-center font-sans py-16">
        <div className="flex gap-1 mb-4">
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-6 bg-white animate-[bounce_1s_infinite_400ms]"></div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Synchronizing</span>
      </div>
    );
  }

  if (!info) {
    return <Error error="No active page found" />;
  }

  return <ServerInfo state={info} />;
}
