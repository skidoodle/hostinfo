import { useState } from 'react';
import {
  ServerIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import type { HostInfo } from '@/utils/types';
import { browser } from 'wxt/browser';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all"
      title="Copy to clipboard"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
    </button>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
  canCopy
}: {
  icon: any,
  label: string,
  value: string | null,
  href?: string,
  canCopy?: boolean
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="mt-0.5 mr-3 text-gray-400 dark:text-gray-500">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-0.5">{label}</p>
        <div className="flex items-center">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors flex items-center gap-1"
            >
              <span className="truncate">{value}</span>
              <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-50" />
            </a>
          ) : (
            <span className="text-sm text-gray-900 dark:text-gray-100 truncate select-all">{value}</span>
          )}
          {canCopy && <CopyButton text={value} />}
        </div>
      </div>
    </div>
  );
};

export default function ServerInfo({ data }: { data: HostInfo }) {
  const { network, location, domain, isBrowserResource } = data;

  // Header Component
  const Header = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
      {Icon && <Icon className="w-6 h-6 text-gray-500" />}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  // Browser Resource View
  if (isBrowserResource) {
    return (
      <div className="w-80 bg-white dark:bg-gray-950 font-sans">
        <Header
          title="System Resource"
          subtitle="Local browser page"
          icon={CpuChipIcon}
        />
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <CpuChipIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No network information available for this page.</p>
        </div>
      </div>
    );
  }

  if (!network) return null;

  const flagUrl = location?.countryCode
    ? `/${location.countryCode.toLowerCase()}.webp`
    : '';

  // Local Network View
  if (network.isLocal) {
    return (
      <div className="w-80 bg-white dark:bg-gray-950 font-sans">
        <Header
          title="Private Network"
          subtitle="Local or internal resource"
          icon={ServerIcon}
        />
        <div className="p-5">
          <InfoRow
            icon={ServerIcon}
            label="IP Address"
            value={network.ip}
            canCopy
          />
          <InfoRow
            icon={GlobeAltIcon}
            label="Hostname"
            value={network.hostname || 'Localhost'}
            canCopy
          />
        </div>
      </div>
    );
  }

  // Public Internet View
  return (
    <div className="w-80 bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
        <div className="min-w-0 pr-2">
          <h1 className="text-base font-bold text-gray-900 dark:text-white truncate" title={domain}>
            {domain}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Publicly Accessible
          </p>
        </div>
        {location?.countryCode && (
          <img
            src={flagUrl}
            alt={location.countryCode}
            className="w-8 h-auto rounded shadow-sm border border-gray-200 dark:border-gray-700"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
      </div>

      <div className="p-5 space-y-1">
        <InfoRow
          icon={ServerIcon}
          label="IP Address"
          value={network.ip}
          href={`https://ip.albert.lol/${network.ip}`}
          canCopy
        />

        <InfoRow
          icon={GlobeAltIcon}
          label="Hostname"
          value={network.hostname}
          canCopy
        />

        <InfoRow
          icon={MapPinIcon}
          label="Location"
          value={location?.countryName || 'Unknown'}
        />

        <InfoRow
          icon={BuildingOfficeIcon}
          label="Organization / ASN"
          value={network.org}
          href={network.asn ? `https://bgp.he.net/${network.asn}` : undefined}
        />
      </div>

      <div className="px-5 pb-5 pt-1">
        <a
          href={`https://platform.censys.io/search?q=${network.hostname || domain}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-md transition-colors text-xs font-medium shadow-sm"
        >
          <GlobeAltIcon className="w-3.5 h-3.5 mr-2" />
          Analyze on Censys
        </a>
      </div>
    </div>
  );
}
