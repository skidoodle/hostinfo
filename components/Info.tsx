import { CopyButton } from './CopyButton';

export const InfoRow = ({
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
