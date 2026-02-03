import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({ error }: { error: string }) {
  return (
    <div className="w-[320px] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Unable to Load</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
    </div>
  );
}
