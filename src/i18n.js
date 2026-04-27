import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

/**
 * Vue i18n configuration for internationalization support in the application.
 * This setup allows for easy switching between English and Spanish languages.
 * The default locale is set to English, and it falls back to English if a translation is missing.
 */
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { es, en },
  legacy: false,
  globalInjection: true,
});

export default i18n;