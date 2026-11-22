import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr';

// Le français est inclus directement au démarrage ; les autres langues sont chargées dynamiquement
const LOADERS: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  EN: () => import('./locales/en'),
  PT: () => import('./locales/pt'),
  ES: () => import('./locales/es'),
  DE: () => import('./locales/de'),
  FR: () => Promise.resolve({ default: fr }),
};

i18n
  .use(LanguageDetector)
  .use({
    type: 'backend' as const,
    read(lng: string, _ns: string, done: (err: unknown, data?: Record<string, unknown>) => void) {
      const normalized = lng.slice(0, 2).toUpperCase();
      const load = LOADERS[normalized] || LOADERS[lng];
      if (!load) return done(null, {});
      load().then((m) => done(null, m.default)).catch((err) => done(err));
    },
  })
  .use(initReactI18next)
  .init({
    resources: { FR: { translation: fr } },
    partialBundledLanguages: true,
    lng: "FR",
    fallbackLng: "FR",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Maintient l'attribut lang du <html> synchronisé avec la langue choisie
const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.slice(0, 2).toLowerCase();
};
syncHtmlLang(i18n.language || 'FR');
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
