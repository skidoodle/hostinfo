import { CpuChipIcon, ServerIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { GeoData } from '@/utils/types';

export const LocalNetworkView = ({ data, domain }: { data: GeoData, domain: string }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans">
      <Header
        title={domain}
        flagCode="unknown"
      />
      <div className="p-5">
        <InfoRow
          icon={CpuChipIcon}
          label="Type"
          value="Local / Private Network"
          iconColor="text-orange-500"
        />
        <InfoRow
          icon={ServerIcon}
          label="IP Address"
          value={data.ip}
          canCopy
          iconColor="text-blue-500"
        />
      </div>
    </div>
  );
};
