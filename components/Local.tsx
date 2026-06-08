import { CpuChipIcon, ServerIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { GeoData } from '@/utils/types';

export const LocalNetworkView = ({ data, domain }: { data: GeoData, domain: string }) => {
  return (
    <div className="w-80 bg-base-950 font-sans text-white border-2 border-base-100">
      <Header
        title="Local Network"
        flagCode={null}
      />
      <div className="p-4">
        <InfoRow
          icon={CpuChipIcon}
          label="Resource Type"
          value="Private / Local Network"
        />
        <InfoRow
          icon={ServerIcon}
          label="Network Address"
          value={data.ip}
          canCopy
        />
      </div>
    </div>
  );
};
