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
    <div className="px-5 py-4 bg-base-950 flex items-center justify-between">

      <div className="min-w-0 pr-3">
        <h1 className="text-lg font-black tracking-widest text-white uppercase" title={title}>
          {title}
        </h1>
      </div>
      {flagCode && (
        <div className="p-0.5">
          <img
            src={getFlagUrl(flagCode)}
            alt={flagCode}
            className="w-12 h-auto block"
            onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
          />
        </div>
      )}
    </div>
  );
};
