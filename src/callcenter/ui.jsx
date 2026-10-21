import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const inputCls =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm ' +
  'text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500';

export const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${className}`}>
    {children}
  </div>
);

export const Btn = ({ variant = 'primary', className = '', ...p }) => {
  const styles = {
    primary: 'bg-lime-500 hover:bg-lime-400 text-slate-900',
    ghost: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
    danger: 'bg-red-500 hover:bg-red-400 text-white',
  };
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
};

export const Dot = ({ on, pulse }) => (
  <span className="relative inline-flex w-2.5 h-2.5">
    {on && pulse && <span className="absolute inset-0 rounded-full bg-lime-400 animate-ping opacity-60" />}
    <span className={`relative w-2.5 h-2.5 rounded-full ${on ? 'bg-lime-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
  </span>
);

export const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
  </button>
);

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</span>
    {hint && <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">{hint}</span>}
    {children}
  </label>
);

// Rendered in a portal on document.body so page-level click handlers and
// transformed/overflow parents can't interfere. Closes only via Esc or the
// buttons the caller provides (Cancel / Done), never by clicking the backdrop.
export const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 font-sans"
      >
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>,
    document.body
  );
};