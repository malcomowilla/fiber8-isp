import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { LANGUAGES } from '../i18n/languages';

export default function LanguageSwitcher({ floating = false }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || 'en').split('-')[0];

  const box = (
    <div className="flex items-center gap-1.5 font-sans rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 shadow-sm">
      <LanguageIcon fontSize="small" />
      <select
        aria-label="Language"
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="text-sm bg-transparent outline-none cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="text-slate-900">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );

  return floating ? <div className="fixed bottom-4 right-4 z-[9999]">{box}</div> : box;
}