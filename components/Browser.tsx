import { CpuChipIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { HostInfo } from '@/utils/types';

export const BrowserResourceView = ({ data }: { data: HostInfo }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans">
      <Header
        title="System Resource"
        flagCode="unknown"
      />
      <div className="p-5">
        <InfoRow
          icon={CpuChipIcon}
          label="Type"
          value="Local Browser Page"
          iconColor="text-orange-500"
        />
        <InfoRow
          icon={GlobeAltIcon}
          label="URL"
          value={data.url}
          iconColor="text-gray-400"
        />
      </div>
      <div className="px-5 pb-5 text-xs text-gray-400 text-center">
        This page is generated locally by your browser.
      </div>
    </div>
  );
};
