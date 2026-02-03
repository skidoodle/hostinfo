import {
  ServerIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { HostInfo } from '@/utils/types';

export const PublicNetworkView = ({ data }: { data: HostInfo }) => {
  const { network, location, domain } = data;

  if (!network) return null;

  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <Header
        title="Host Information"
        flagCode={location?.countryCode || 'unknown'}
      />

      <div className="p-5 space-y-0.5">
        <InfoRow
          icon={ServerIcon}
          label="IP Address"
          value={network.ip}
          href={`https://ip.albert.lol/${network.ip}`}
          canCopy
          iconColor="text-blue-500"
        />
        <InfoRow
          icon={GlobeAltIcon}
          label="Hostname"
          value={network.hostname}
          canCopy
          iconColor="text-indigo-500"
        />
        <InfoRow
          icon={MapPinIcon}
          label="Location"
          value={location?.countryName || 'Unknown Location'}
          iconColor="text-emerald-500"
        />
        <InfoRow
          icon={BuildingOfficeIcon}
          label="Organization / ASN"
          value={network.org}
          href={network.asn ? `https://bgp.he.net/${network.asn}` : undefined}
          iconColor="text-violet-500"
        />
      </div>

      <div className="px-5 pb-5 pt-2">
        <a
          href={`https://platform.censys.io/search?q=${network.hostname || domain}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full py-2 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md transition-all text-xs font-medium shadow-sm hover:shadow cursor-pointer"
        >
          <GlobeAltIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
          Analyze on Censys
        </a>
      </div>
    </div>
  );
};
