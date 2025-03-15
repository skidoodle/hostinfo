import { LinkIcon, ServerIcon, IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { codes } from '@/utils/codes';

export default function ServerInfo({ data }: { data: ServerData }) {

  const countryName = data.country
  ? codes[data.country.toLowerCase()] || "N/A"
  : "N/A";

  if (data.isBrowserResource) {
    return (
      <div className="min-w-[300px] bg-gray-900 shadow-2xl p-6 text-white font-sans">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Browser Resource
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <p className="text-sm text-gray-300">The requested document was obtained from the local computer</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.isLocal) {
    return (
      <div className="min-w-[300px] bg-gray-900 shadow-2xl p-6 text-white font-sans">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Internal Network
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <ServerIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400">IP Address</p>
            <p className="font-medium">{data.ip}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[300px] bg-gray-900 shadow-2xl p-6 text-white font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Host Information
        </h2>
      </div>
      <div className="space-y-4">

        <div className="flex items-center space-x-3">
          <ServerIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400">IP Address</p>
            <p className="font-medium hover:underline"><a href={`https://ip.albert.lol/${data.ip}`} target='_blank'>{data.ip}</a></p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <LinkIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400">Hostname</p>
            <p className="font-medium break-all">{data.hostname}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPinIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400">Location</p>
            <p className="font-medium">{countryName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <IdentificationIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400">Org</p>
            <p className="font-medium hover:underline">
              <a href={`https://bgp.he.net/${data.org.split(' ')[0]}`} target='_blank'>{data.org}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center hover:underline">
          <a href={`https://search.censys.io/search?resource=hosts&sort=RELEVANCE&per_page=25&virtual_hosts=EXCLUDE&q=${data.origin}`} target='_blank'>Search on Censys</a>
        </p>
      </div>
    </div>
  );
}
