import { CpuChipIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';

export const BrowserResourceView = ({ url }: { url: string }) => {
  return (
    <div className="w-80 bg-base-950 font-sans text-white">
      <Header title="System Resource" flagCode={null} />
      <div className="p-4">

        <InfoRow
          icon={CpuChipIcon}
          label="Resource Type"
          value="Local Browser Page"
        />
        <InfoRow
          icon={GlobeAltIcon}
          label="URL / Protocol"
          value={url}
        />
      </div>
      <div className="px-5 pb-5 text-[10px] uppercase font-bold tracking-widest text-base-500 text-center">
        Generated locally by browser
      </div>
    </div>
  );
};
