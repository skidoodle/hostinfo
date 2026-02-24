import { CpuChipIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';

export const BrowserResourceView = ({ url }: { url: string }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans">
      <Header title="System Resource" flagCode={null} />
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
          value={url}
          iconColor="text-gray-400"
        />
      </div>
      <div className="px-5 pb-5 text-xs text-gray-400 text-center">
        This page is generated locally by your browser.
      </div>
    </div>
  );
};
