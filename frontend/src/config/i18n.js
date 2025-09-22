// Supported languages with their display names and flags
export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false,
  },
  ne: {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    flag: '🇳🇵',
    rtl: false,
  },
  lep: {
    code: 'lep',
    name: 'Lepcha',
    nativeName: 'ᰛᰩᰵᰛᰧᰵᰶ',
    flag: '🇮🇳',
    rtl: false,
  },
  sik: {
    code: 'sik',
    name: 'Sikkimese',
    nativeName: 'सिक्किमी',
    flag: '🇮🇳',
    rtl: false,
  },
};

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Language detection options
export const LANGUAGE_DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
  checkWhitelist: true,
};

// Translation namespaces
export const NAMESPACES = {
  COMMON: 'common',
  AUTH: 'auth',
  DASHBOARD: 'dashboard',  
  VALIDATION: 'validation',
  ERRORS: 'errors',
};

// Default namespace
export const DEFAULT_NAMESPACE = NAMESPACES.COMMON;
