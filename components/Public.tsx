import { ServerIcon, MapPinIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Header } from './Header';
import { InfoRow } from './Info';
import type { GeoData } from '@/utils/types';

export const PublicNetworkView = ({ data, domain }: { data: GeoData, domain: string }) => {
  const ipv4 = data.ipv4;
  const ipv6 = data.ipv6;

  const ipEntries = [];
  if (ipv6) {
    ipEntries.push({
      value: ipv6,
      href: `https://ip.albert.lol/${ipv6}`
    });
  }
  if (ipv4) {
    ipEntries.push({
      value: ipv4,
      href: `https://ip.albert.lol/${ipv4}`
    });
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <Header
        title="Host Information"
        flagCode={data.countryCode}
      />

      <div className="p-5 space-y-0.5">
        <InfoRow
          icon={ServerIcon}
          label="IP Address"
          value={null}
          iconColor="text-blue-500"
          canCopy
          extraValues={ipEntries}
        />
        <InfoRow
          icon={GlobeAltIcon}
          label="Hostname"
          value={data.hostname || 'N/A'}
          canCopy
          iconColor="text-indigo-500"
        />
        <InfoRow
          icon={MapPinIcon}
          label="Location"
          value={data.countryName || 'N/A'}
          iconColor="text-emerald-500"
        />
        <InfoRow
          icon={BuildingOfficeIcon}
          label="Organization / ASN"
          value={data.org}
          href={data.asn ? `https://bgp.he.net/${data.asn}` : undefined}
          iconColor="text-violet-500"
        />
      </div>

      <div className="px-5 pb-5 pt-2">
        <a
          href={`https://platform.censys.io/search?q=${domain}`}
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
