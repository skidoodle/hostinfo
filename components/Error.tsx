import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({ error }: { error: string }) {
  return (
    <div className="w-80 bg-base-950 flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="p-4 border-2 border-red-600 mb-6 bg-base-950">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-base font-black uppercase tracking-tighter text-red-600 mb-2">Technical Error</h3>
      <p className="text-sm font-medium text-white leading-tight">{error}</p>
    </div>
  );
}
