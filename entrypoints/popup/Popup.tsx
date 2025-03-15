import ServerInfo from '@/components/ServerInfo';
import Error from '@/components/Error';

export default function Popup() {
  const { data, error } = useTabData();

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
