import { CpuChipIcon, ServerIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { HostInfo } from '@/utils/types';

export const LocalNetworkView = ({ data }: { data: HostInfo }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans">
      <Header
        title={data.domain}
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
          value={data.network?.ip || null}
          canCopy
          iconColor="text-blue-500"
        />
      </div>
    </div>
  );
};
