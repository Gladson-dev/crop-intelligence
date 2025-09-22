import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { DEFAULT_LANGUAGE, LANGUAGES } from './config/i18n';

// Initialize i18next
i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    lng: localStorage.getItem('i18nextLng') || 'en',
    // Fallback language
    fallbackLng: 'en',
    // Disable debug in production
    debug: process.env.NODE_ENV === 'development',
    // Path to load translations from
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Namespaces
    ns: ['common', 'translation'],
    defaultNS: 'common',
    // Don't use a key separator (we use dots as key separators in our translation keys)
    keySeparator: false,
    // Allow empty strings as valid translations
    returnEmptyString: false,
    // Supported languages
    supportedLngs: Object.keys(LANGUAGES),
    // Disable saving missing keys to prevent 404 errors
    saveMissing: process.env.NODE_ENV === 'development',
    // Don't use a key separator (we use dots as key separators in our translation keys)
    keySeparator: false,
    // Allow empty strings as valid translations
    returnEmptyString: false,
    // Debug mode and missing key handler
    debug: process.env.NODE_ENV === 'development',
    // Custom missing key handler
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key}`);
      }
    },
    // React i18next options
    react: {
      useSuspense: false, // We'll handle loading states manually
    },
    // Backend options
    backend: {
      // Path where resources get loaded from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Custom request headers
      requestOptions: {
        cache: 'no-store',
      },
    },
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      checkWhitelist: true,
    },
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

// Add a listener for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
});

export default i18n;
