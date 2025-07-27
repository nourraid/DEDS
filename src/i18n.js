// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationES from "./locales/es/translation.json";
import translationTR from "./locales/tr/translation.json";
const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
    fr: { translation: translationFR },
  es: { translation: translationES },
  tr: { translation: translationTR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",  // اللغة الافتراضية
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
