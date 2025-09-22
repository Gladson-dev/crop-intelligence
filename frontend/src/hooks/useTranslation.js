import { useTranslation as useI18NextTranslation } from 'react-i18next';
import { NAMESPACES } from '../config/i18n';
import { useEffect } from 'react';

/**
 * Enhanced translation hook with additional functionality
 * @param {string} ns - The namespace to use
 * @returns {Object} - Translation utilities
 */
export const useTranslation = (ns = NAMESPACES.COMMON) => {
  const { t, i18n, ready } = useI18NextTranslation(ns);

  // Set HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir() || 'ltr';
  }, [i18n.language]);

  /**
   * Enhanced translate function with additional features
   * @param {string} key - Translation key
   * @param {Object} options - Translation options
   * @returns {string} - Translated string
   */
  const translate = (key, options = {}) => {
    if (!key) return '';
    
    // If key contains a dot, it's already namespaced
    if (key.includes('.')) {
      return t(key, options);
    }
    
    // Otherwise, use the current namespace
    return t(key, { ...options, ns });
  };

  /**
   * Change the current language
   * @param {string} lng - Language code
   */
  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  };

  /**
   * Get current language information
   */
  const getCurrentLanguage = () => ({
    code: i18n.language,
    dir: i18n.dir(),
    isRTL: i18n.dir() === 'rtl',
  });

  return {
    t: translate,
    i18n,
    ready,
    changeLanguage,
    getCurrentLanguage,
    language: i18n.language,
    languages: i18n.languages,
    isRTL: i18n.dir() === 'rtl',
  };
};

// Export the default translation hook
export default useTranslation;
