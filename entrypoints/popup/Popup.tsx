import ServerInfo from '@/components/ServerInfo';
import Error from '@/components/Error';
import { useHostInfo } from '@/hooks/useHostInfo';

export default function Popup() {
  const { info, loading } = useHostInfo();

  if (loading) {
    return (
      <div className="w-80 h-75 bg-white dark:bg-gray-950 flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-xs font-medium">Loading host info...</p>
      </div>
    );
  }

  if (!info) {
    return <Error error="No active page found" />;
  }

  if (info.error) {
    return <Error error={info.error} />;
  }

  return <ServerInfo data={info} />;
}
