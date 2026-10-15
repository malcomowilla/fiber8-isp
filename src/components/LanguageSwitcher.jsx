import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || 'en').split('-')[0];

  return (
    <div className="flex items-center gap-1.5 font-sans text-slate-700 dark:text-slate-200">
      <LanguageIcon fontSize="small" />
      <select
        aria-label={t('common.language')}
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="text-sm bg-transparent border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="text-slate-900">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}