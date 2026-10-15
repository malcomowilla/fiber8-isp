import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LANGUAGES } from './languages';

const modules = import.meta.glob('./locales/*.json', { eager: true });

const resources = {};
Object.entries(modules).forEach(([file, mod]) => {
  const code = file.match(/\.\/locales\/(.+)\.json$/)[1];
  resources[code] = { translation: mod.default };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// RTL support (Arabic etc.)
const applyDir = (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
};
applyDir(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', applyDir);

export default i18n;