import { CopyButton } from './CopyButton';

export const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
  canCopy,
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
    const isIpOrHost = /^[0-9a-f.:]+$/i.test(val) || val.includes('.') || val === 'localhost';
    const isNA = val === 'N/A';
    const valueClass = `text-sm font-medium ${isNA ? 'text-base-500' : 'text-white'} ${isIpOrHost ? 'font-mono tracking-tight' : 'font-sans'} leading-snug`;

    return (
      <div className="flex items-start justify-between group/val gap-2 w-full overflow-hidden">
        <div className="flex-1 min-w-0">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`${valueClass} hover:text-accent transition-none break-all underline decoration-base-700 underline-offset-4 hover:decoration-accent block`}
            >
              {val}
            </a>
          ) : (
            <span className={`${valueClass} select-all break-all block`}>{val}</span>
          )}
        </div>
        {showCopy && !isNA && (
          <div className="shrink-0 mt-0.5">
            <CopyButton text={val} />
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="border-b border-base-900 last:border-0 py-3 first:pt-1">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-accent" />
        <p className="text-[10px] uppercase tracking-[0.15em] text-base-400 font-bold">{label}</p>
      </div>

      <div className="pl-5.5">

        {value && renderValue(value, href, canCopy)}

        {extraValues?.map((extra, i) => (
          <div key={i} className={i === 0 && !value ? "" : "mt-1"}>
            {extra.label && (
              <p className="text-[10px] uppercase tracking-[0.15em] text-base-500 font-bold mb-0.5">{extra.label}</p>
            )}
            {renderValue(extra.value, extra.href, canCopy)}
          </div>
        ))}
      </div>
    </div>
  );
};
