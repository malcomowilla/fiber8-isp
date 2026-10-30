import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ title, subtitle, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const width = size === 'lg' ? 'max-w-5xl' : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full ${width} flex-col rounded-2xl border border-black/10
          bg-white font-sans shadow-xl dark:border-white/10 dark:bg-[#1e1e1e]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-black dark:text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="rounded-lg p-1 text-gray-500
             hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10"
          >
            <CloseIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t
           border-black/10 px-5 py-3 dark:border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;