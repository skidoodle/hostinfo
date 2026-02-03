import { useState } from 'react';
import {
  ServerIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import type { HostInfo } from '@/utils/types';
import { browser } from 'wxt/browser';
import Error from './Error';

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
      className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
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
  canCopy,
  iconColor = "text-gray-400 dark:text-gray-500"
}: {
  icon: any,
  label: string,
  value: string | null,
  href?: string,
  canCopy?: boolean,
  iconColor?: string
}) => {
  if (!value) return null;

  return (
    <div className="group flex items-start py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className={`mt-0.5 mr-3 ${iconColor}`}>
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
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors flex items-center gap-1.5"
            >
              <span className="truncate">{value}</span>
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate select-all">{value}</span>
          )}
          {canCopy && <CopyButton text={value} />}
        </div>
      </div>
    </div>
  );
};

export default function ServerInfo({ data }: { data: HostInfo }) {
  const { network, location, domain, isBrowserResource } = data;

  // URL generation for flags
  const getFlagUrl = (code?: string | null) => {
    if (!code) return '';
    try {
      const path = `/${code.toLowerCase()}.webp`;
      return browser.runtime.getURL(path as any);
    } catch {
      return '';
    }
  };

  // Header Component
  const Header = ({ title, flagCode }: { title: string, flagCode?: string | null }) => (
    <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <div className="min-w-0 pr-3">
        <h1 className="text-base font-bold text-gray-900 dark:text-white truncate" title={title}>
          {title}
        </h1>
      </div>
      {flagCode && (
        <img
          src={getFlagUrl(flagCode)}
          alt={flagCode}
          className="w-8 h-auto rounded shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
    </div>
  );

  // Browser Resource View
  if (isBrowserResource) {
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
  }

  // Fallback if network data is missing
  if (!network) {
    return <Error error="Host information unavailable." />;
  }

  // Local Network View
  if (network.isLocal) {
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
            value={network.ip}
            canCopy
            iconColor="text-blue-500"
          />
        </div>
      </div>
    );
  }

  // Public Internet View
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
}
