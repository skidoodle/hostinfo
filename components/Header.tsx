export const Header = ({ title, flagCode }: { title: string, flagCode?: string | null }) => {
  const getFlagUrl = (code?: string | null) => {
    if (!code) return '';
    try {
      const path = `/${code.toLowerCase()}.png`;
      return browser.runtime.getURL(path as any);
    } catch {
      return '';
    }
  };

  return (
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
          className="w-12 h-9 object-contain shadow-sm rounded-sm"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
    </div>
  );
};
