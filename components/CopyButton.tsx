import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 border border-transparent hover:border-accent text-base-400 hover:text-white transition-none opacity-80 hover:opacity-100 focus:opacity-100 cursor-pointer"
      title="Copy to clipboard"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5 text-accent" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
    </button>
  );
};
