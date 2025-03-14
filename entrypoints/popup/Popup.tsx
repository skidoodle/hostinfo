import { Spinner } from '@/components/Spinner';
import ServerInfo from '@/components/ServerInfo';
import Error from '@/components/Error';

export default function Popup() {
  const { data, loading, error } = useTabData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-900">
        <Spinner className="w-12 h-12 text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Error error={error} />
    );
  }

  if (!data) {
    return (
      <Error error="No data found" />
    );
  }

  return <ServerInfo data={data} />;
}
