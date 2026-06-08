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
    <div className="w-80 bg-base-950 font-sans text-white border-2 border-base-100">
      <Header
        title="Host Info"
        flagCode={data.countryCode}
      />

      <div className="p-4 space-y-0">
        <InfoRow
          icon={ServerIcon}
          label="Address"
          value={null}
          canCopy
          extraValues={ipEntries}
        />
        <InfoRow
          icon={GlobeAltIcon}
          label="Hostname"
          value={data.hostname || 'N/A'}
          canCopy
        />
        <InfoRow
          icon={MapPinIcon}
          label="Location"
          value={data.countryName || 'N/A'}
        />
        <InfoRow
          icon={BuildingOfficeIcon}
          label="Organization"
          value={data.org}
          href={data.asn ? `https://bgp.tools/${data.asn}` : undefined}
        />
      </div>

      <div className="px-4 pb-4 pt-1">
        <a
          href={`https://platform.censys.io/search?q=${domain}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full py-3 px-4 bg-accent text-white hover:bg-white hover:text-base-950 transition-none text-[10px] font-black uppercase tracking-[0.2em] border border-accent hover:border-white cursor-pointer"
        >
          Censys Search
        </a>
      </div>
    </div>
  );
};
