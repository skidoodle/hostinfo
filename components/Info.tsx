import { CopyButton } from './CopyButton';

export const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
  canCopy,
  iconColor = "text-gray-400 dark:text-gray-500",
  extraValues
}: {
  icon: any,
  label: string,
  value: string | null,
  href?: string,
  canCopy?: boolean,
  iconColor?: string,
  extraValues?: { value: string, label?: string, href?: string }[]
}) => {
  if (!value && (!extraValues || extraValues.length === 0)) return null;

  const renderValue = (val: string, link?: string, showCopy?: boolean) => {
    return (
      <div className="flex items-center">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors flex items-center gap-1.5"
          >
            <span className="truncate">{val}</span>
          </a>
        ) : (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate select-all">{val}</span>
        )}
        {showCopy && <CopyButton text={val} />}
      </div>
    );
  };

  return (
    <div className="group flex items-start py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className={`mt-0.5 mr-3 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-0.5">{label}</p>

        {value && renderValue(value, href, canCopy)}

        {extraValues?.map((extra, i) => (
          <div key={i} className={i === 0 && !value ? "mt-1.5" : "mt-1 pt-1 border-t border-gray-50 dark:border-gray-900/50"}>
            {extra.label && (
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-0.5">{extra.label}</p>
            )}
            {renderValue(extra.value, extra.href, canCopy)}
          </div>
        ))}
      </div>
    </div>
  );
};
